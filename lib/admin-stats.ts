import { and, desc, eq, gte, isNull, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { essayDrafts, essayComments, essayViewLog } from '@/lib/db/schema'

// 관리자 대시보드 통계 — 기존 테이블/컬럼만 사용(스키마 변경 없음). 서버 전용(관리자 게이트 뒤).
// 모든 반환값은 직렬화 가능(숫자/문자열). pg count 는 문자열로 올 수 있어 Number() 강제.

const n = (v: unknown): number => Number(v ?? 0) || 0

// UTC 기준 'YYYY-MM-DD' (offset 일 가감)
function dayStr(offset = 0): string {
  const d = new Date()
  d.setUTCDate(d.getUTCDate() + offset)
  return d.toISOString().slice(0, 10)
}

export type Kpis = {
  published: number
  draft: number
  totalViews: number
  totalReactions: number
  totalComments: number
  views7d: number
  views30d: number
}

export async function getKpis(): Promise<Kpis> {
  const [counts] = await db
    .select({
      published: sql<number>`count(*) filter (where ${essayDrafts.status} = 'published')`,
      draft: sql<number>`count(*) filter (where ${essayDrafts.status} = 'draft')`,
      totalViews: sql<number>`coalesce(sum(${essayDrafts.viewCount}), 0)`,
      totalReactions: sql<number>`coalesce(sum(${essayDrafts.reactionCount}), 0)`,
    })
    .from(essayDrafts)

  const [{ totalComments }] = await db
    .select({ totalComments: sql<number>`count(*)` })
    .from(essayComments)
    .where(isNull(essayComments.deletedAt))

  const [{ views7d }] = await db
    .select({ views7d: sql<number>`count(*)` })
    .from(essayViewLog)
    .where(gte(essayViewLog.day, dayStr(-7)))

  const [{ views30d }] = await db
    .select({ views30d: sql<number>`count(*)` })
    .from(essayViewLog)
    .where(gte(essayViewLog.day, dayStr(-30)))

  return {
    published: n(counts?.published),
    draft: n(counts?.draft),
    totalViews: n(counts?.totalViews),
    totalReactions: n(counts?.totalReactions),
    totalComments: n(totalComments),
    views7d: n(views7d),
    views30d: n(views30d),
  }
}

export type EssayStat = {
  id: number
  title: string
  slug: string | null
  publishedAt: string | null
  views: number
  reactions: number
  comments: number
}

// 발행 글별 통계 — 댓글수는 비삭제 기준.
export async function getEssayStats(): Promise<EssayStat[]> {
  const rows = await db
    .select({
      id: essayDrafts.id,
      title: essayDrafts.title,
      slug: essayDrafts.slug,
      publishedAt: essayDrafts.publishedAt,
      views: essayDrafts.viewCount,
      reactions: essayDrafts.reactionCount,
    })
    .from(essayDrafts)
    .where(eq(essayDrafts.status, 'published'))

  const commentCounts = await db
    .select({ essayId: essayComments.essayId, c: sql<number>`count(*)` })
    .from(essayComments)
    .where(isNull(essayComments.deletedAt))
    .groupBy(essayComments.essayId)
  const cmap = new Map<number, number>()
  for (const r of commentCounts) cmap.set(n(r.essayId), n(r.c))

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    slug: r.slug,
    publishedAt: r.publishedAt ? new Date(r.publishedAt).toISOString() : null,
    views: n(r.views),
    reactions: n(r.reactions),
    comments: cmap.get(r.id) ?? 0,
  }))
}

export type TrendPoint = { day: string; count: number }

// 최근 30일 조회수 추이 — 빠진 날짜는 0으로 채움(오늘-29 ~ 오늘).
export async function getViewTrend(): Promise<TrendPoint[]> {
  const rows = await db
    .select({ day: essayViewLog.day, c: sql<number>`count(*)` })
    .from(essayViewLog)
    .where(gte(essayViewLog.day, dayStr(-29)))
    .groupBy(essayViewLog.day)
  const map = new Map<string, number>()
  for (const r of rows) map.set(String(r.day), n(r.c))

  const out: TrendPoint[] = []
  for (let i = 29; i >= 0; i--) {
    const d = dayStr(-i)
    out.push({ day: d, count: map.get(d) ?? 0 })
  }
  return out
}

export type RecentActivity = {
  drafts: { id: number; title: string; status: string; updatedAt: string | null }[]
  published: { id: number; title: string; slug: string | null; publishedAt: string | null }[]
  comments: {
    id: number
    authorName: string
    body: string
    createdAt: string | null
    title: string | null
    slug: string | null
  }[]
}

export async function getRecentActivity(): Promise<RecentActivity> {
  const drafts = await db
    .select({
      id: essayDrafts.id,
      title: essayDrafts.title,
      status: essayDrafts.status,
      updatedAt: essayDrafts.updatedAt,
    })
    .from(essayDrafts)
    .orderBy(desc(essayDrafts.updatedAt))
    .limit(5)

  const published = await db
    .select({
      id: essayDrafts.id,
      title: essayDrafts.title,
      slug: essayDrafts.slug,
      publishedAt: essayDrafts.publishedAt,
    })
    .from(essayDrafts)
    .where(and(eq(essayDrafts.status, 'published')))
    .orderBy(desc(essayDrafts.publishedAt))
    .limit(5)

  const comments = await db
    .select({
      id: essayComments.id,
      authorName: essayComments.authorName,
      body: essayComments.body,
      createdAt: essayComments.createdAt,
      title: essayDrafts.title,
      slug: essayDrafts.slug,
    })
    .from(essayComments)
    .leftJoin(essayDrafts, eq(essayComments.essayId, essayDrafts.id))
    .where(isNull(essayComments.deletedAt))
    .orderBy(desc(essayComments.createdAt))
    .limit(5)

  const iso = (d: Date | null | undefined) => (d ? new Date(d).toISOString() : null)
  return {
    drafts: drafts.map((d) => ({ id: d.id, title: d.title, status: d.status, updatedAt: iso(d.updatedAt) })),
    published: published.map((p) => ({ id: p.id, title: p.title, slug: p.slug, publishedAt: iso(p.publishedAt) })),
    comments: comments.map((c) => ({
      id: c.id,
      authorName: c.authorName,
      body: c.body.length > 80 ? c.body.slice(0, 80) + '…' : c.body,
      createdAt: iso(c.createdAt),
      title: c.title ?? null,
      slug: c.slug ?? null,
    })),
  }
}
