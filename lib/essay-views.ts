import { createHash } from 'crypto'
import { and, eq, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { essayDrafts, essayViewLog } from '@/lib/db/schema'

// 익명 조회 집계 — 원본 IP 는 저장하지 않고 AUTH_SECRET 솔트로 해시만 보관.
export function hashIp(ip: string): string {
  const salt = process.env.AUTH_SECRET || ''
  return createHash('sha256').update(`${ip}|${salt}`).digest('hex')
}

// 오늘 날짜(UTC, YYYY-MM-DD) — 조회 dedupe 단위.
export function today(): string {
  return new Date().toISOString().slice(0, 10)
}

// (essay_id, ip_hash, day) 를 INSERT … ON CONFLICT DO NOTHING.
// 새로 들어갔으면(첫 조회) view_count += 1 후 갱신값을, 중복이면 현재값을 반환.
export async function recordView(
  essayId: number,
  ipHash: string,
  day: string,
  currentCount: number
): Promise<number> {
  const inserted = await db
    .insert(essayViewLog)
    .values({ essayId, ipHash, day })
    .onConflictDoNothing()
    .returning({ id: essayViewLog.id })

  if (inserted.length === 0) return currentCount // 오늘 이미 본 IP — 카운트 그대로

  const [row] = await db
    .update(essayDrafts)
    .set({ viewCount: sql`${essayDrafts.viewCount} + 1` })
    .where(eq(essayDrafts.id, essayId))
    .returning({ viewCount: essayDrafts.viewCount })
  return row?.viewCount ?? currentCount + 1
}

// 발행 글의 현재 view_count 만 조회(관리자 자기조회 등 카운트 없이 표시할 때).
export async function getPublishedViewCount(essayId: number): Promise<number> {
  const [row] = await db
    .select({ viewCount: essayDrafts.viewCount })
    .from(essayDrafts)
    .where(and(eq(essayDrafts.id, essayId), eq(essayDrafts.status, 'published')))
    .limit(1)
  return row?.viewCount ?? 0
}
