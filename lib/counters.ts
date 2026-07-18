import 'server-only'
import { getRedis, OPS_KEY, OPS_MAX, type PendingOp } from '@/lib/redis'

// 조회수·반응·투표의 "요청 경로" 계층. 표시값은 Redis 가, 영속화는 cron 이 책임진다.
//
// 모델: Postgres = base(마지막 플러시까지 반영된 값), Redis = delta(그 이후 증분).
//   표시값 = base + delta. base 는 이미 캐시된 에세이 행에 들어 있어 추가 조회가 없다.
// cron 이 op 대기열을 Postgres 에 재생한 뒤 정확히 재생한 만큼만 delta 를 깎는다
//   (DEL 이 아니라 DECRBY 인 이유: 플러시 도중 들어온 증분을 잃지 않기 위해).
//
// Redis 가 없거나(미설정) 실패하면 전부 null 을 돌려주고, 호출부는 기존처럼
// Postgres 에 직접 쓴다. 즉 이 계층은 "있으면 싸지는" 부가물이지 단일 장애점이 아니다.

const VIEW_DEDUPE_TTL = 172800 // 초(2일). day 키가 UTC 기준이라 경계를 넉넉히 덮는다.

const kViewDedupe = (essayId: number, ipHash: string, day: string) =>
  `v:d:${essayId}:${ipHash}:${day}`
const kViewDelta = (essayId: number) => `v:n:${essayId}`
const kReactMember = (essayId: number, reactorId: string) => `r:m:${essayId}:${reactorId}`
const kReactDelta = (essayId: number) => `r:n:${essayId}`
const kVoteDedupe = (slug: string, voterToken: string) => `av:d:${slug}:${voterToken}`
const kVoteDelta = (slug: string) => `av:n:${slug}`

// op 를 대기열에 넣는다. 대기열이 상한을 넘으면 false — 호출부가 Postgres 직접 쓰기로 되돌아간다.
// 버리지 않는 이유: cron 이 며칠 멈춰도 조회수가 조용히 증발하면 안 된다.
async function enqueue(op: PendingOp): Promise<boolean> {
  const redis = getRedis()
  if (!redis) return false
  const len = await redis.rpush(OPS_KEY, JSON.stringify(op))
  if (len > OPS_MAX) {
    // 상한 초과 — 방금 넣은 걸 도로 빼고 직접 쓰기로 넘긴다.
    await redis.rpop(OPS_KEY)
    return false
  }
  return true
}

// ── 조회수 ──────────────────────────────────────────────────────────────────
// 반환: 표시할 카운트. null 이면 Redis 를 못 써서 호출부가 Postgres 로 처리해야 한다.
export async function bufferView(
  essayId: number,
  ipHash: string,
  day: string,
  base: number
): Promise<number | null> {
  const redis = getRedis()
  if (!redis) return null
  try {
    // 오늘 이 IP 가 이미 봤는가 — Postgres UNIQUE 제약이 하던 dedupe 를 여기서 한다.
    const fresh = await redis.set(kViewDedupe(essayId, ipHash, day), 1, {
      nx: true,
      ex: VIEW_DEDUPE_TTL,
    })
    if (fresh === null) {
      const delta = Number(await redis.get(kViewDelta(essayId))) || 0
      return base + Math.max(0, delta) // 중복 조회 — 현재 표시값만
    }

    const queued = await enqueue({ t: 'view', essayId, ipHash, day })
    if (!queued) return null // 대기열 포화 → Postgres 직접 쓰기로

    const delta = await redis.incr(kViewDelta(essayId))
    return base + Math.max(0, delta)
  } catch {
    return null // Redis 장애 → 폴백
  }
}

// ── 반응(👍 토글) ───────────────────────────────────────────────────────────
export async function bufferReaction(
  essayId: number,
  reactorId: string,
  action: 'like' | 'unlike',
  base: number
): Promise<number | null> {
  const redis = getRedis()
  if (!redis) return null
  try {
    const memberKey = kReactMember(essayId, reactorId)
    let changed: boolean
    if (action === 'like') {
      changed = (await redis.set(memberKey, 1, { nx: true })) !== null
    } else {
      changed = (await redis.del(memberKey)) > 0
    }

    const delta = Number(await redis.get(kReactDelta(essayId))) || 0
    if (!changed) return Math.max(0, base + delta) // 이미 눌렀음/누른 적 없음 — 그대로

    const queued = await enqueue({ t: 'react', essayId, reactorId, action })
    if (!queued) {
      // 대기열 포화 → 방금 바꾼 멤버십을 되돌리고 Postgres 직접 쓰기로 넘긴다.
      if (action === 'like') await redis.del(memberKey)
      else await redis.set(memberKey, 1)
      return null
    }

    const next = await redis.incrby(kReactDelta(essayId), action === 'like' ? 1 : -1)
    return Math.max(0, base + next)
  } catch {
    return null
  }
}

// ── 해부 투표 ───────────────────────────────────────────────────────────────
// 반환: null 이면 폴백. accepted=false 는 이미 투표한 토큰.
export async function bufferVote(
  slug: string,
  option: string,
  voterToken: string
): Promise<{ accepted: boolean } | null> {
  const redis = getRedis()
  if (!redis) return null
  try {
    const fresh = await redis.set(kVoteDedupe(slug, voterToken), option, { nx: true })
    if (fresh === null) return { accepted: false } // 1회 투표, 변경 불가

    const queued = await enqueue({ t: 'vote', slug, option, voterToken })
    if (!queued) {
      await redis.del(kVoteDedupe(slug, voterToken))
      return null
    }

    await redis.hincrby(kVoteDelta(slug), option, 1)
    return { accepted: true }
  } catch {
    return null
  }
}

// 투표 표시값 — Postgres 집계(base, 캐시됨)에 아직 플러시 안 된 delta 를 얹는다.
export async function mergeVoteDeltas(
  slug: string,
  base: Record<string, number>
): Promise<{ counts: Record<string, number>; total: number }> {
  const counts = { ...base }
  const redis = getRedis()
  if (redis) {
    try {
      const deltas = await redis.hgetall<Record<string, string>>(kVoteDelta(slug))
      if (deltas) {
        for (const [option, n] of Object.entries(deltas)) {
          counts[option] = (counts[option] ?? 0) + Math.max(0, Number(n) || 0)
        }
      }
    } catch {
      // Redis 장애 시엔 base 만 — 방금 들어온 표가 잠깐 안 보일 뿐 페이지는 정상.
    }
  }
  const total = Object.values(counts).reduce((a, b) => a + b, 0)
  return { counts, total }
}

// 조회수/반응 표시용 delta 조회(페이지 렌더에서 base 에 얹는다).
export async function readDeltas(
  essayId: number
): Promise<{ views: number; reactions: number }> {
  const redis = getRedis()
  if (!redis) return { views: 0, reactions: 0 }
  try {
    const [v, r] = await Promise.all([
      redis.get(kViewDelta(essayId)),
      redis.get(kReactDelta(essayId)),
    ])
    return { views: Math.max(0, Number(v) || 0), reactions: Number(r) || 0 }
  } catch {
    return { views: 0, reactions: 0 }
  }
}
