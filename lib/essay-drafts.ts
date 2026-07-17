import { cache } from 'react'
import { revalidateTag, unstable_cache } from 'next/cache'
import { z } from 'zod'
import { and, eq, desc, asc, lt, gt, or } from 'drizzle-orm'
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

// ── 공개 읽기 캐시 ───────────────────────────────────────────────────────────
// Neon 은 쿼리 수가 아니라 compute 가 "깨어 있던 시간"으로 과금한다(CU-hrs).
// 공개 경로가 요청마다 DB 를 때리면 크롤러 핑 하나로 compute 가 잠들지 못해
// 0.25 CU × 24/7 = 월 182 CU-hrs 로 한도(100)가 17일경 터진다. 아래 캐시가 그 고리를 끊는다.
// 무효화는 시간이 아니라 태그가 책임진다 — 발행/비공개/삭제/발행글 수정 시 즉시 반영.
export const ESSAYS_TAG = 'essays'
const PUBLIC_TTL = 3600 // 초. 태그 무효화가 정확성을 보장하므로 TTL 은 안전망일 뿐.

// 발행/비공개/삭제 등 공개 노출이 바뀌는 모든 변경의 단일 무효화 지점.
// 데이터 계층에 두는 이유: 라우트에서 호출을 빠뜨리면 캐시가 조용히 낡기 때문.
//
// 공개 경로(/, /essays, /essays/[slug], /sitemap.xml)는 전부 force-dynamic 이라
// 무효화할 라우트 캐시가 없다 → 버릴 대상은 데이터 캐시뿐이고 태그 하나면 충분하다.
// (ISR 로 바꾸면 revalidatePath 도 함께 불러야 한다 — 태그는 데이터 캐시만 만료시킨다.)
function revalidatePublicEssays() {
  // profile 은 16 에서 필수. { expire: 0 } = 즉시 만료.
  // 권장값 'max' 는 stale-while-revalidate 라 발행 직후 첫 방문자가 옛 목록을 보게 된다.
  // (즉시 갱신용 updateTag 는 Server Action 전용 → 라우트 핸들러인 여기선 쓸 수 없다.)
  revalidateTag(ESSAYS_TAG, { expire: 0 })
}

// 공개 목록 — 발행된 글만, 공개 필드만. 인증 없음(공개)이되 status='published' 로 한정.
// 주의: unstable_cache 는 값을 JSON 으로 직렬화한다 → Date 는 캐시 히트 시 string 으로 돌아온다.
// 타입이 거짓말하지 않도록 캐시에 넣기 전에 ISO 문자열로 고정한다.
async function selectPublishedEssays() {
  const rows = await db
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
  return rows.map((r) => ({
    ...r,
    publishedAt: r.publishedAt ? r.publishedAt.toISOString() : null,
    updatedAt: r.updatedAt.toISOString(),
  }))
}

export const listPublishedEssays = unstable_cache(selectPublishedEssays, ['essays:list-published'], {
  tags: [ESSAYS_TAG],
  revalidate: PUBLIC_TTL,
})

export type PublicEssaySummary = Awaited<ReturnType<typeof selectPublishedEssays>>[number]

// 캐시 미스 + DB 장애(Neon 할당량 402·콜드스타트 타임아웃 등) 시 페이지 전체를 500 으로
// 무너뜨리지 않기 위한 변형. 홈·목록은 나머지 콘텐츠(쇼케이스·해부·책)가 velite 정적
// 데이터라 DB 없이도 의미가 있다 — 에세이 한 섹션 때문에 사이트를 내릴 이유가 없다.
//
// 실패를 [] 가 아니라 null 로 돌리는 게 핵심이다. [] 로 뭉개면 "발행된 글이 없음"과
// "불러오지 못함"이 구분되지 않아 방문자에게 "아직 글이 없습니다"라고 거짓말하게 된다.
//
// 단건(getPublishedEssayBySlug)·sitemap 에는 일부러 쓰지 않는다 — 실제 글을 404 로,
// 사이트맵을 "에세이 없음"으로 내보내면 색인이 지워질 수 있다. 그쪽은 500(재시도 요청)이 맞다.
export async function listPublishedEssaysSafe(): Promise<PublicEssaySummary[] | null> {
  try {
    return await listPublishedEssays()
  } catch (err) {
    console.error('[essays] 발행 목록 조회 실패 — 캐시 미스 + DB 장애:', err)
    return null
  }
}

// 공개 단건 — 발행된 글만(slug + status='published'). 없으면 null → 라우트에서 notFound.
async function selectPublishedEssayBySlug(slug: string) {
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
      reactionCount: essayDrafts.reactionCount, // 👍 개수(초기 표시)
    })
    .from(essayDrafts)
    .where(and(eq(essayDrafts.slug, slug), eq(essayDrafts.status, 'published')))
    .limit(1)
  if (!row) return null
  return {
    ...row,
    publishedAt: row.publishedAt ? row.publishedAt.toISOString() : null,
    updatedAt: row.updatedAt.toISOString(),
  }
}

// cache() 로 한 번 더 감싸는 이유: generateMetadata 와 페이지 본문이 같은 slug 로 2번 부른다.
// Next 는 fetch 만 dedupe 하는데 이건 raw Drizzle 이라 그대로 왕복 2회가 된다 → 요청당 1회로 접는다.
// viewCount/reactionCount 는 캐시 TTL 만큼 낡을 수 있다 — 초기 표시용이고 클라이언트가 실제값을 받아온다.
export const getPublishedEssayBySlug = cache((slug: string) =>
  unstable_cache(() => selectPublishedEssayBySlug(slug), ['essays:by-slug', slug], {
    tags: [ESSAYS_TAG],
    revalidate: PUBLIC_TTL,
  })()
)

export type AdjacentEssay = { title: string; slug: string | null }

// 인접 발행 글(발행일 기준) — prev=더 전에 발행, next=더 나중에 발행. 동일 published_at 은 id 로 타이브레이크.
// 읽기 페이지의 '이전/다음 글' 내비게이션용(목록으로 돌아가지 않고 글 사이 이동).
// 두 쿼리는 서로 독립이라 Promise.all — 순차 await 이면 왕복 지연이 2배가 된다.
async function selectAdjacentEssays(
  currentPublishedAt: string,
  currentId: number
): Promise<{ prev: AdjacentEssay | null; next: AdjacentEssay | null }> {
  const cur = new Date(currentPublishedAt)
  const cols = { title: essayDrafts.title, slug: essayDrafts.slug }

  const [prevRows, nextRows] = await Promise.all([
    db
      .select(cols)
      .from(essayDrafts)
      .where(
        and(
          eq(essayDrafts.status, 'published'),
          or(
            lt(essayDrafts.publishedAt, cur),
            and(eq(essayDrafts.publishedAt, cur), lt(essayDrafts.id, currentId))
          )
        )
      )
      .orderBy(desc(essayDrafts.publishedAt), desc(essayDrafts.id))
      .limit(1),
    db
      .select(cols)
      .from(essayDrafts)
      .where(
        and(
          eq(essayDrafts.status, 'published'),
          or(
            gt(essayDrafts.publishedAt, cur),
            and(eq(essayDrafts.publishedAt, cur), gt(essayDrafts.id, currentId))
          )
        )
      )
      .orderBy(asc(essayDrafts.publishedAt), asc(essayDrafts.id))
      .limit(1),
  ])

  return { prev: prevRows[0] ?? null, next: nextRows[0] ?? null }
}

const getAdjacentEssaysCached = unstable_cache(selectAdjacentEssays, ['essays:adjacent'], {
  tags: [ESSAYS_TAG],
  revalidate: PUBLIC_TTL,
})

export async function getAdjacentEssays(
  currentPublishedAt: Date | string | null,
  currentId: number
): Promise<{ prev: AdjacentEssay | null; next: AdjacentEssay | null }> {
  if (!currentPublishedAt) return { prev: null, next: null }
  // 캐시 키 안정화 — Date 로 넘어오든 string 으로 넘어오든 같은 엔트리를 쓰게 ISO 로 통일.
  const cur =
    typeof currentPublishedAt === 'string' ? currentPublishedAt : currentPublishedAt.toISOString()
  return getAdjacentEssaysCached(cur, currentId)
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
  if (!row) return null
  revalidatePublicEssays() // 공개 목록·본문·사이트맵에 즉시 반영
  return row
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
  if (!row) return null
  revalidatePublicEssays() // 캐시에 남아 공개된 채로 보이면 안 됨
  return row
}

export async function updateDraft(authorId: string, id: number, input: UpdateInput) {
  const [row] = await db
    .update(essayDrafts)
    .set({ ...input, updatedAt: new Date() })
    .where(and(eq(essayDrafts.id, id), eq(essayDrafts.authorId, authorId)))
    .returning({ updatedAt: essayDrafts.updatedAt, status: essayDrafts.status })
  if (!row) return null // null = 본인 글 아님/없음
  // 발행된 글을 고쳤을 때만 무효화. 초안 자동저장이 5분마다 PATCH 하는데
  // 그때마다 버리면 공개 캐시가 사실상 무의미해진다.
  if (row.status === 'published') revalidatePublicEssays()
  return { updatedAt: row.updatedAt }
}

export async function deleteDraft(authorId: string, id: number) {
  const rows = await db
    .delete(essayDrafts)
    .where(and(eq(essayDrafts.id, id), eq(essayDrafts.authorId, authorId)))
    .returning({ id: essayDrafts.id, status: essayDrafts.status })
  if (rows.length === 0) return false
  if (rows[0].status === 'published') revalidatePublicEssays()
  return true
}
