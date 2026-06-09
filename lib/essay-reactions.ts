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
    if (inserted.length === 0) return currentCount // 이미 누름 — 그대로

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
  if (deleted.length === 0) return currentCount // 누른 적 없음 — 그대로

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
