import { and, eq, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { essayDrafts, essayReactions } from '@/lib/db/schema'

// 익명 👍 반응 — localStorage 토큰(reactorId)로 best-effort 중복 제거 + 토글.
// (essay_id, reactor_id) UNIQUE 가 최종 dedupe. reaction_count 는 발행 글 컬럼.

// like: INSERT … ON CONFLICT DO NOTHING. 새로 들어갔으면 reaction_count += 1.
// unlike: DELETE. 실제 삭제됐으면 reaction_count -= 1(0 미만 방지).
// 반환: 현재(또는 갱신된) reaction_count.
export async function toggleReaction(
  essayId: number,
  reactorId: string,
  action: 'like' | 'unlike',
  currentCount: number
): Promise<number> {
  if (action === 'like') {
    const inserted = await db
      .insert(essayReactions)
      .values({ essayId, reactorId })
      .onConflictDoNothing()
      .returning({ id: essayReactions.id })
    // 이미 누름. currentCount(캐시된 행의 base)를 그대로 돌려주면 최대 TTL 만큼 낡은 값이라
    // 방금 올라간 카운트가 도로 내려간 것처럼 보인다. 위 INSERT 로 compute 는 이미 깨어 있으므로
    // 여기서의 SELECT 는 wake 를 새로 만들지 않는다. (Redis 경로는 여기까지 오지 않는다.)
    if (inserted.length === 0) return await getReactionCount(essayId)

    const [row] = await db
      .update(essayDrafts)
      .set({ reactionCount: sql`${essayDrafts.reactionCount} + 1` })
      .where(eq(essayDrafts.id, essayId))
      .returning({ reactionCount: essayDrafts.reactionCount })
    return row?.reactionCount ?? currentCount + 1
  }

  // unlike
  const deleted = await db
    .delete(essayReactions)
    .where(and(eq(essayReactions.essayId, essayId), eq(essayReactions.reactorId, reactorId)))
    .returning({ id: essayReactions.id })
  if (deleted.length === 0) return await getReactionCount(essayId) // 누른 적 없음 — 위와 같은 이유

  // 0 미만 방지(GREATEST)
  const [row] = await db
    .update(essayDrafts)
    .set({ reactionCount: sql`GREATEST(${essayDrafts.reactionCount} - 1, 0)` })
    .where(eq(essayDrafts.id, essayId))
    .returning({ reactionCount: essayDrafts.reactionCount })
  return row?.reactionCount ?? Math.max(currentCount - 1, 0)
}

// 발행 글의 현재 reaction_count 조회(필요 시).
export async function getReactionCount(essayId: number): Promise<number> {
  const [row] = await db
    .select({ reactionCount: essayDrafts.reactionCount })
    .from(essayDrafts)
    .where(and(eq(essayDrafts.id, essayId), eq(essayDrafts.status, 'published')))
    .limit(1)
  return row?.reactionCount ?? 0
}
