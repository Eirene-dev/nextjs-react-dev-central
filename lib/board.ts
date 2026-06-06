import { z } from 'zod'
import { and, eq, isNull, lt, gt, inArray, desc, asc, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { boardPosts, type BoardPost } from '@/lib/db/schema'
import { isAdmin } from '@/lib/auth-helpers'
import type { Session } from 'next-auth'

// 허용목록 — page_key 로 향후 다른 페이지 재사용
export const PAGE_KEYS = ['book:judgment-dev'] as const
export const TYPES = ['question', 'discussion', 'typo', 'etc'] as const
export const TYPE_LABELS: Record<string, string> = {
  question: '문의',
  discussion: '토론',
  typo: '오타',
  etc: '기타',
}
const MAX_BODY = 4000
const MAX_TITLE = 200
const RATE_WINDOW_MS = 30_000
const RATE_MAX = 5
const PAGE_SIZE = 20

export const createSchema = z.object({
  pageKey: z.enum(PAGE_KEYS),
  type: z.enum(TYPES),
  title: z.string().trim().max(MAX_TITLE).optional().nullable(),
  body: z.string().trim().min(1).max(MAX_BODY),
  parentId: z.number().int().positive().optional().nullable(),
})
export type CreateInput = z.infer<typeof createSchema>

export type PublicPost = {
  id: number
  type: string
  title: string | null
  body: string | null
  parentId: number | null
  authorName: string | null
  authorAvatar: string | null
  authorId: string | null
  createdAt: string
  deleted: boolean
  replies?: PublicPost[]
}

function toPublic(p: BoardPost): PublicPost {
  const deleted = p.deletedAt != null
  return {
    id: p.id,
    type: p.type,
    parentId: p.parentId,
    createdAt: (p.createdAt as unknown as Date).toISOString(),
    deleted,
    // 삭제글은 본문·작성자 비노출(툼스톤)
    title: deleted ? null : p.title,
    body: deleted ? null : p.body,
    authorName: deleted ? null : p.authorName,
    authorAvatar: deleted ? null : p.authorAvatar,
    authorId: deleted ? null : p.authorId,
  }
}

// 목록: top-level(최신순, keyset cursor=id) + 각 글의 답글
export async function listPosts(
  pageKey: string,
  opts: { type?: string; cursor?: number } = {}
): Promise<{ posts: PublicPost[]; nextCursor: number | null }> {
  if (!(PAGE_KEYS as readonly string[]).includes(pageKey)) return { posts: [], nextCursor: null }
  const typeOk = opts.type && (TYPES as readonly string[]).includes(opts.type) ? opts.type : undefined

  const tops = await db
    .select()
    .from(boardPosts)
    .where(
      and(
        eq(boardPosts.pageKey, pageKey),
        isNull(boardPosts.parentId),
        typeOk ? eq(boardPosts.type, typeOk) : undefined,
        opts.cursor ? lt(boardPosts.id, opts.cursor) : undefined
      )
    )
    .orderBy(desc(boardPosts.id))
    .limit(PAGE_SIZE + 1)

  const hasMore = tops.length > PAGE_SIZE
  const page = tops.slice(0, PAGE_SIZE)
  const ids = page.map((p) => p.id)

  let replies: BoardPost[] = []
  if (ids.length) {
    replies = await db
      .select()
      .from(boardPosts)
      .where(and(eq(boardPosts.pageKey, pageKey), inArray(boardPosts.parentId, ids)))
      .orderBy(asc(boardPosts.id))
  }
  const byParent = new Map<number, PublicPost[]>()
  for (const r of replies) {
    const arr = byParent.get(r.parentId!) ?? []
    arr.push(toPublic(r))
    byParent.set(r.parentId!, arr)
  }

  const posts = page.map((p) => ({ ...toPublic(p), replies: byParent.get(p.id) ?? [] }))
  return { posts, nextCursor: hasMore ? page[page.length - 1].id : null }
}

async function rateLimitOk(authorId: string): Promise<boolean> {
  const rows = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(boardPosts)
    .where(
      and(
        eq(boardPosts.authorId, authorId),
        gt(boardPosts.createdAt, new Date(Date.now() - RATE_WINDOW_MS))
      )
    )
  return (rows[0]?.n ?? 0) < RATE_MAX
}

export async function createPost(
  input: CreateInput,
  author: { id: string; name: string; avatar: string | null }
): Promise<{ post?: PublicPost; error?: string; status?: number }> {
  // 답글이면 부모 검증(존재·동일 pageKey·top-level)
  if (input.parentId != null) {
    const parent = await db
      .select()
      .from(boardPosts)
      .where(eq(boardPosts.id, input.parentId))
      .limit(1)
    const pp = parent[0]
    if (!pp || pp.pageKey !== input.pageKey || pp.parentId != null || pp.deletedAt != null) {
      return { error: '답글 대상을 찾을 수 없습니다.', status: 400 }
    }
  }
  if (!(await rateLimitOk(author.id))) {
    return { error: '잠시 후 다시 시도해 주세요.', status: 429 }
  }
  const inserted = await db
    .insert(boardPosts)
    .values({
      pageKey: input.pageKey,
      type: input.type,
      title: input.parentId == null ? (input.title?.trim() || null) : null,
      body: input.body.trim(),
      parentId: input.parentId ?? null,
      authorId: author.id,
      authorName: author.name,
      authorAvatar: author.avatar,
    })
    .returning()
  return { post: toPublic(inserted[0]) }
}

export async function softDeletePost(
  id: number,
  session: Session
): Promise<{ ok: boolean; error?: string; status?: number }> {
  const rows = await db.select().from(boardPosts).where(eq(boardPosts.id, id)).limit(1)
  const post = rows[0]
  if (!post || post.deletedAt != null) return { ok: false, error: '글을 찾을 수 없습니다.', status: 404 }
  const mine = session.user?.id === post.authorId
  if (!mine && !isAdmin(session)) return { ok: false, error: '권한이 없습니다.', status: 403 }
  await db.update(boardPosts).set({ deletedAt: new Date() }).where(eq(boardPosts.id, id))
  return { ok: true }
}
