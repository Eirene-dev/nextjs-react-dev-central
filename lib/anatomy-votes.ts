import { revalidateTag, unstable_cache } from 'next/cache'
import { eq, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { anatomyVotes } from '@/lib/db/schema'

// 해부 전시 투표 집계/기록. slug·option 화이트리스트 검증은 API(route)에서 수행.
// (slug, voter_token) UNIQUE 가 최종 dedupe — 1회 투표, 변경 불가.

export type VoteCounts = Record<string, number>

// 전시별 태그 — 한 전시의 투표가 다른 20개 전시의 캐시까지 버리지 않게 slug 단위로 끊는다.
const votesTag = (slug: string) => `anatomy-votes:${slug}`
// 7일. 정확성은 투표 시 태그 무효화가 책임진다. 전시가 21개라 1시간 TTL 은
// 최악의 경우 하루 21×24 번의 만료 시점을 만들었다 — 전부 개별 wake 후보다.
const VOTES_TTL = 604800

// slug 의 option별 카운트 집계.
async function selectVoteCounts(slug: string): Promise<{ counts: VoteCounts; total: number }> {
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

// 전시 페이지는 SSG(빌드 타임 정적)인데 이 집계만 런타임 GET 이라, 캐시가 없으면
// 정적 페이지를 여는 것만으로 Neon 이 깨어난다 — 그 한 번이 5분치 compute 로 결제된다.
// 반환값에 Date 가 없어 JSON 직렬화 이슈도 없다.
export const getVoteCounts = (slug: string) =>
  unstable_cache(() => selectVoteCounts(slug), ['anatomy:vote-counts', slug], {
    tags: [votesTag(slug)],
    revalidate: VOTES_TTL,
  })()

// 1회 투표 — INSERT … ON CONFLICT DO NOTHING. 새로 들어갔으면 true, 이미 투표했으면 false.
export async function castVote(slug: string, option: string, voterToken: string): Promise<boolean> {
  const inserted = await db
    .insert(anatomyVotes)
    .values({ slug, option, voterToken })
    .onConflictDoNothing()
    .returning({ id: anatomyVotes.id })
  // 실제로 표가 들어갔을 때만 집계 캐시를 버린다(중복 투표는 집계가 그대로라 버릴 이유가 없다).
  if (inserted.length > 0) revalidateTag(votesTag(slug), { expire: 0 })
  return inserted.length > 0
}
