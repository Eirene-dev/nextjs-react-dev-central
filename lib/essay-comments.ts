import { and, asc, eq, isNull } from 'drizzle-orm'
import { db } from '@/lib/db'
import { essayComments } from '@/lib/db/schema'

// 에세이 댓글 데이터 계층 — top-level + 1단계 답글. 평문 저장(마크다운/HTML 파싱 없음).
// 소프트 삭제(deleted_at)는 답글이 달린 top-level 만(묘비). 답글은 항상 하드 삭제.

// 공개로 내보내는 댓글(비삭제) / 묘비(삭제) — 삭제 시 작성자·본문 미노출(안전).
export type PublicComment =
  | {
      id: number
      parentId: number | null
      authorId: string
      authorProvider: string
      authorName: string
      body: string
      createdAt: Date
      deleted: false
    }
  | { id: number; parentId: number | null; createdAt: Date; deleted: true }

// 해당 essay 의 모든 댓글(top-level + 답글)을 created_at 오름차순 플랫으로. 삭제 항목은 묘비로 마스킹.
export async function listComments(essayId: number): Promise<PublicComment[]> {
  const rows = await db
    .select({
      id: essayComments.id,
      parentId: essayComments.parentId,
      authorId: essayComments.authorId,
      authorProvider: essayComments.authorProvider,
      authorName: essayComments.authorName,
      body: essayComments.body,
      createdAt: essayComments.createdAt,
      deletedAt: essayComments.deletedAt,
    })
    .from(essayComments)
    .where(eq(essayComments.essayId, essayId))
    .orderBy(asc(essayComments.createdAt))

  return rows.map((r) =>
    r.deletedAt
      ? { id: r.id, parentId: r.parentId, createdAt: r.createdAt, deleted: true }
      : {
          id: r.id,
          parentId: r.parentId,
          authorId: r.authorId,
          authorProvider: r.authorProvider,
          authorName: r.authorName,
          body: r.body,
          createdAt: r.createdAt,
          deleted: false,
        }
  )
}

export type NewCommentInput = {
  authorId: string
  authorProvider: string
  authorName: string // 표시이름(displayName)
  body: string
  parentId?: number | null
}

// 댓글/답글 생성. parentId 가 있으면 대상이 같은 essay 의 비삭제 top-level 인지 검증(아니면 null 반환=거부).
export async function createComment(essayId: number, input: NewCommentInput) {
  let parentId: number | null = null
  if (input.parentId != null) {
    const [parent] = await db
      .select({
        id: essayComments.id,
        essayId: essayComments.essayId,
        parentId: essayComments.parentId,
        deletedAt: essayComments.deletedAt,
      })
      .from(essayComments)
      .where(eq(essayComments.id, input.parentId))
      .limit(1)
    // (a) 같은 essay (b) top-level (c) 비삭제 — 아니면 거부(답글의 답글/삭제/타 essay 금지)
    if (!parent || parent.essayId !== essayId || parent.parentId !== null || parent.deletedAt) {
      return null
    }
    parentId = input.parentId
  }

  const [row] = await db
    .insert(essayComments)
    .values({
      essayId,
      parentId,
      authorId: input.authorId,
      authorProvider: input.authorProvider,
      authorName: input.authorName,
      authorImage: null, // 아바타는 이니셜 원형 — 프로필 이미지 미사용
      body: input.body,
    })
    .returning({
      id: essayComments.id,
      parentId: essayComments.parentId,
      authorId: essayComments.authorId,
      authorProvider: essayComments.authorProvider,
      authorName: essayComments.authorName,
      body: essayComments.body,
      createdAt: essayComments.createdAt,
    })
  if (!row) return null
  return { ...row, deleted: false as const }
}

export type DeleteResult = 'ok' | 'not_found' | 'forbidden'
export type Requester = { id: string; provider: string; isAdmin: boolean }

// 삭제 — 작성자 본인(provider+id 일치) 또는 관리자만. 답글=하드, top-level=답글 있으면 소프트.
export async function deleteComment(
  essayId: number,
  commentId: number,
  requester: Requester
): Promise<DeleteResult> {
  const [c] = await db
    .select({
      id: essayComments.id,
      essayId: essayComments.essayId,
      parentId: essayComments.parentId,
      authorId: essayComments.authorId,
      authorProvider: essayComments.authorProvider,
      deletedAt: essayComments.deletedAt,
    })
    .from(essayComments)
    .where(eq(essayComments.id, commentId))
    .limit(1)
  if (!c || c.essayId !== essayId || c.deletedAt) return 'not_found' // 이미 묘비/없음/타 essay

  const isOwner = c.authorProvider === requester.provider && c.authorId === requester.id
  if (!requester.isAdmin && !isOwner) return 'forbidden'

  if (c.parentId != null) {
    // 답글 → 하드 삭제 후, 부모가 묘비이고 남은 답글이 없으면 부모도 정리(하드 삭제)
    await db.delete(essayComments).where(eq(essayComments.id, commentId))
    const parentId = c.parentId
    const [parent] = await db
      .select({ id: essayComments.id, deletedAt: essayComments.deletedAt })
      .from(essayComments)
      .where(eq(essayComments.id, parentId))
      .limit(1)
    if (parent?.deletedAt) {
      const remaining = await db
        .select({ id: essayComments.id })
        .from(essayComments)
        .where(eq(essayComments.parentId, parentId))
      if (remaining.length === 0) {
        await db.delete(essayComments).where(eq(essayComments.id, parentId))
      }
    }
    return 'ok'
  }

  // top-level → 답글(비삭제, 답글은 항상 비삭제) 있으면 소프트, 없으면 하드.
  const replies = await db
    .select({ id: essayComments.id })
    .from(essayComments)
    .where(and(eq(essayComments.parentId, commentId), isNull(essayComments.deletedAt)))
  if (replies.length > 0) {
    await db
      .update(essayComments)
      .set({ deletedAt: new Date() })
      .where(eq(essayComments.id, commentId))
  } else {
    await db.delete(essayComments).where(eq(essayComments.id, commentId))
  }
  return 'ok'
}
