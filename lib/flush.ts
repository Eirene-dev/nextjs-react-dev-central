import 'server-only'
import { revalidateTag } from 'next/cache'
import { getRedis, OPS_KEY, type PendingOp } from '@/lib/redis'
import { ESSAYS_TAG } from '@/lib/essay-drafts'
import { recordView } from '@/lib/essay-views'
import { toggleReaction } from '@/lib/essay-reactions'
import { castVote } from '@/lib/anatomy-votes'

// 대기열 → Postgres 재생. cron 이 하루 1회 부른다 = Neon wake 1회로 하루치 쓰기를 전부 흡수.
//
// 재생을 "기존 함수 그대로" 하는 게 이 설계의 핵심이다. recordView/toggleReaction/castVote 는
// 전부 INSERT … ON CONFLICT DO NOTHING 또는 DELETE 기반이라 같은 op 를 두 번 재생해도
// 결과가 같다(멱등). 덕분에 실패 시 배치 전체를 그냥 다시 돌리면 되고,
// essay_view_log 도 예전처럼 행이 쌓여 관리자 통계(7·30일 추이)가 그대로 동작한다.

const BATCH = 2000

export type FlushResult = {
  ok: boolean
  drained: number
  applied: number
  failed: number
  skipped: boolean // Redis 미설정 등으로 아무것도 안 함
}

export async function flushPending(): Promise<FlushResult> {
  const redis = getRedis()
  if (!redis) return { ok: true, drained: 0, applied: 0, failed: 0, skipped: true }

  const raw = await redis.lrange<string>(OPS_KEY, 0, BATCH - 1)
  if (raw.length === 0) {
    return { ok: true, drained: 0, applied: 0, failed: 0, skipped: false }
  }

  const ops: PendingOp[] = []
  for (const item of raw) {
    try {
      ops.push(typeof item === 'string' ? JSON.parse(item) : (item as PendingOp))
    } catch {
      // 깨진 항목은 버린다 — 남겨두면 대기열이 영구히 막힌다.
    }
  }

  // 재생한 만큼만 delta 를 깎기 위해 op 를 세어둔다(플러시 중 들어온 증분 보호).
  const viewDelta = new Map<number, number>()
  const reactDelta = new Map<number, number>()
  const voteDelta = new Map<string, Map<string, number>>()

  let applied = 0
  let failed = 0

  for (const op of ops) {
    try {
      if (op.t === 'view') {
        await recordView(op.essayId, op.ipHash, op.day, 0)
        viewDelta.set(op.essayId, (viewDelta.get(op.essayId) ?? 0) + 1)
      } else if (op.t === 'react') {
        await toggleReaction(op.essayId, op.reactorId, op.action, 0)
        reactDelta.set(
          op.essayId,
          (reactDelta.get(op.essayId) ?? 0) + (op.action === 'like' ? 1 : -1)
        )
      } else if (op.t === 'vote') {
        await castVote(op.slug, op.option, op.voterToken)
        const perSlug = voteDelta.get(op.slug) ?? new Map<string, number>()
        perSlug.set(op.option, (perSlug.get(op.option) ?? 0) + 1)
        voteDelta.set(op.slug, perSlug)
      }
      applied += 1
    } catch (err) {
      // 개별 op 실패는 배치를 세우지 않는다. 트림하지 않으므로 다음 실행에서 다시 시도된다.
      failed += 1
      console.error('[flush] op 재생 실패:', op, err)
    }
  }

  // 하나라도 실패했으면 트림하지 않는다 — 멱등하므로 다음 실행이 배치 전체를 다시 돌린다.
  if (failed > 0) {
    return { ok: false, drained: 0, applied, failed, skipped: false }
  }

  await redis.ltrim(OPS_KEY, raw.length, -1)

  // 재생분만큼 delta 차감. DEL 이 아닌 이유는 위(counters.ts)와 같다.
  const pipe = redis.pipeline()
  for (const [essayId, n] of viewDelta) pipe.decrby(`v:n:${essayId}`, n)
  for (const [essayId, n] of reactDelta) pipe.decrby(`r:n:${essayId}`, n)
  for (const [slug, perSlug] of voteDelta) {
    for (const [option, n] of perSlug) pipe.hincrby(`av:n:${slug}`, option, -n)
  }
  if (viewDelta.size || reactDelta.size || voteDelta.size) await pipe.exec()

  // base(캐시된 에세이 행의 view_count/reaction_count)가 방금 늘었다. 태그를 버리지 않으면
  // 다음 방문자가 "낡은 base + 0 이 된 delta"를 보게 되어 카운트가 되레 줄어 보인다.
  if (viewDelta.size || reactDelta.size) revalidateTag(ESSAYS_TAG, { expire: 0 })

  return { ok: true, drained: raw.length, applied, failed: 0, skipped: false }
}
