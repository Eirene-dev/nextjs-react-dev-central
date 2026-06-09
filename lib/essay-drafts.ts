import { z } from 'zod'
import { and, eq, desc } from 'drizzle-orm'
import { db } from '@/lib/db'
import { essayDrafts } from '@/lib/db/schema'

// 에세이 드래프트 데이터 계층 — 모든 쿼리는 authorId 로 스코프(본인 글만).
const MAX_TITLE = 200
const MAX_BODY = 100_000
const MAX_SLUG = 200
const MAX_EXCERPT = 500

export const updateSchema = z.object({
  title: z.string().max(MAX_TITLE).optional(),
  body: z.string().max(MAX_BODY).optional(),
})
export type UpdateInput = z.infer<typeof updateSchema>

export const publishSchema = z.object({
  action: z.enum(['publish', 'unpublish']),
  slug: z.string().max(MAX_SLUG).optional(),
  excerpt: z.string().max(MAX_EXCERPT).optional(),
})
export type PublishInput = z.infer<typeof publishSchema>

// slug 생성 — 한글 허용, 영문 소문자, 공백→하이픈, 위험 문자 제거, 연속 하이픈 정리.
export function slugify(s: string): string {
  return (s || '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9가-힣-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// excerpt 자동 생성 — 마크다운 제거 후 앞 ~150~160자(가능하면 문장 경계에서 자름).
// 목록 발췌 겸 SEO 메타 설명으로 쓰임.
export function autoExcerpt(md: string): string {
  const text = (md || '')
    .replace(/```[\s\S]*?```/g, ' ') // 코드블록
    .replace(/`[^`]*`/g, ' ') // 인라인 코드
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // 이미지
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // 링크 → 텍스트
    .replace(/^[#>\s]+/gm, '') // 줄머리 # > 공백
    .replace(/[*_~`#>]/g, '') // 마크다운 기호
    .replace(/\s+/g, ' ')
    .trim()
  if (text.length <= 160) return text
  const head = text.slice(0, 160)
  // 100자 이후 첫 문장부호(.!?。)에서 자름 — 없으면 마지막 공백, 그것도 없으면 160자 하드컷.
  const sentence = head.search(/[.!?。][^.!?。]*$/)
  if (sentence >= 100) return head.slice(0, sentence + 1).trim()
  const lastSpace = head.lastIndexOf(' ')
  return (lastSpace >= 100 ? head.slice(0, lastSpace) : head).trim()
}

// 공개 목록 — 발행된 글만, 공개 필드만. 인증 없음(공개)이되 status='published' 로 한정.
export async function listPublishedEssays() {
  return db
    .select({
      id: essayDrafts.id,
      slug: essayDrafts.slug,
      title: essayDrafts.title,
      excerpt: essayDrafts.excerpt,
      publishedAt: essayDrafts.publishedAt,
      updatedAt: essayDrafts.updatedAt,
    })
    .from(essayDrafts)
    .where(eq(essayDrafts.status, 'published'))
    .orderBy(desc(essayDrafts.publishedAt))
}

// 공개 단건 — 발행된 글만(slug + status='published'). 없으면 null → 라우트에서 notFound.
export async function getPublishedEssayBySlug(slug: string) {
  const [row] = await db
    .select({
      id: essayDrafts.id,
      slug: essayDrafts.slug,
      title: essayDrafts.title,
      body: essayDrafts.body,
      excerpt: essayDrafts.excerpt,
      publishedAt: essayDrafts.publishedAt,
      updatedAt: essayDrafts.updatedAt,
      viewCount: essayDrafts.viewCount, // 읽은 개수(초기 표시)
    })
    .from(essayDrafts)
    .where(and(eq(essayDrafts.slug, slug), eq(essayDrafts.status, 'published')))
    .limit(1)
  return row ?? null
}

// 목록 — 초안+발행 전체(author 스코프), 수정일 내림차순.
// 관리 페이지(/admin/essays)가 상태 배지·날짜·보기 링크에 쓰는 필드까지 포함.
// (에디터 드롭다운은 id/title/updatedAt 만 사용 — 나머지 필드는 무시되어 무해.)
export async function listDrafts(authorId: string) {
  return db
    .select({
      id: essayDrafts.id,
      title: essayDrafts.title,
      status: essayDrafts.status,
      slug: essayDrafts.slug,
      updatedAt: essayDrafts.updatedAt,
      publishedAt: essayDrafts.publishedAt,
    })
    .from(essayDrafts)
    .where(eq(essayDrafts.authorId, authorId))
    .orderBy(desc(essayDrafts.updatedAt))
}

export async function createDraft(authorId: string) {
  const [row] = await db.insert(essayDrafts).values({ authorId }).returning({ id: essayDrafts.id })
  return row // { id }
}

export async function getDraft(authorId: string, id: number) {
  const [row] = await db
    .select({
      id: essayDrafts.id,
      title: essayDrafts.title,
      body: essayDrafts.body,
      status: essayDrafts.status,
      slug: essayDrafts.slug,
      excerpt: essayDrafts.excerpt,
      publishedAt: essayDrafts.publishedAt,
      updatedAt: essayDrafts.updatedAt,
    })
    .from(essayDrafts)
    .where(and(eq(essayDrafts.id, id), eq(essayDrafts.authorId, authorId)))
    .limit(1)
  return row ?? null
}

// slug 유일성 — 전역 unique. 자기 자신 제외, 중복이면 base-2, base-3… 부여.
async function uniqueSlug(base: string, selfId: number): Promise<string> {
  const root = base || `essay-${selfId}`
  for (let n = 1; ; n++) {
    const cand = n === 1 ? root : `${root}-${n}`
    const [hit] = await db
      .select({ id: essayDrafts.id })
      .from(essayDrafts)
      .where(eq(essayDrafts.slug, cand))
      .limit(1)
    if (!hit || hit.id === selfId) return cand
  }
}

// 발행 — status='published', published_at 없으면 now(있으면 유지), slug/excerpt 없으면 생성, slug 유일성 강제.
export async function publishDraft(authorId: string, id: number, input: PublishInput) {
  const cur = await getDraft(authorId, id)
  if (!cur) return null
  const base = slugify(input.slug?.trim() || cur.slug || cur.title) || `essay-${id}`
  const slug = await uniqueSlug(base, id)
  const excerpt =
    (input.excerpt?.trim() ? input.excerpt.trim() : null) ?? cur.excerpt ?? autoExcerpt(cur.body)
  const publishedAt = cur.publishedAt ?? new Date()
  const [row] = await db
    .update(essayDrafts)
    .set({ status: 'published', slug, excerpt, publishedAt, updatedAt: new Date() })
    .where(and(eq(essayDrafts.id, id), eq(essayDrafts.authorId, authorId)))
    .returning({
      status: essayDrafts.status,
      slug: essayDrafts.slug,
      excerpt: essayDrafts.excerpt,
      publishedAt: essayDrafts.publishedAt,
    })
  return row ?? null
}

// 비공개 전환 — status='draft' (slug·published_at·excerpt 유지).
export async function unpublishDraft(authorId: string, id: number) {
  const [row] = await db
    .update(essayDrafts)
    .set({ status: 'draft', updatedAt: new Date() })
    .where(and(eq(essayDrafts.id, id), eq(essayDrafts.authorId, authorId)))
    .returning({
      status: essayDrafts.status,
      slug: essayDrafts.slug,
      excerpt: essayDrafts.excerpt,
      publishedAt: essayDrafts.publishedAt,
    })
  return row ?? null
}

export async function updateDraft(authorId: string, id: number, input: UpdateInput) {
  const [row] = await db
    .update(essayDrafts)
    .set({ ...input, updatedAt: new Date() })
    .where(and(eq(essayDrafts.id, id), eq(essayDrafts.authorId, authorId)))
    .returning({ updatedAt: essayDrafts.updatedAt })
  return row ?? null // null = 본인 글 아님/없음
}

export async function deleteDraft(authorId: string, id: number) {
  const rows = await db
    .delete(essayDrafts)
    .where(and(eq(essayDrafts.id, id), eq(essayDrafts.authorId, authorId)))
    .returning({ id: essayDrafts.id })
  return rows.length > 0
}
