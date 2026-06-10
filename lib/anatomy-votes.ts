import { eq, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { anatomyVotes } from '@/lib/db/schema'

// 해부 전시 투표 집계/기록. slug·option 화이트리스트 검증은 API(route)에서 수행.
// (slug, voter_token) UNIQUE 가 최종 dedupe — 1회 투표, 변경 불가.

export type VoteCounts = Record<string, number>

// slug 의 option별 카운트 집계.
export async function getVoteCounts(slug: string): Promise<{ counts: VoteCounts; total: number }> {
  const rows = await db
    .select({ option: anatomyVotes.option, n: sql<number>`count(*)::int` })
    .from(anatomyVotes)
    .where(eq(anatomyVotes.slug, slug))
    .groupBy(anatomyVotes.option)

  const counts: VoteCounts = {}
  let total = 0
  for (const r of rows) {
    counts[r.option] = r.n
    total += r.n
  }
  return { counts, total }
}

// 1회 투표 — INSERT … ON CONFLICT DO NOTHING. 새로 들어갔으면 true, 이미 투표했으면 false.
export async function castVote(slug: string, option: string, voterToken: string): Promise<boolean> {
  const inserted = await db
    .insert(anatomyVotes)
    .values({ slug, option, voterToken })
    .onConflictDoNothing()
    .returning({ id: anatomyVotes.id })
  return inserted.length > 0
}
