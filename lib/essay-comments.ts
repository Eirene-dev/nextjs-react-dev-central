import { and, asc, eq, isNull } from 'drizzle-orm'
import { db } from '@/lib/db'
import { essayComments } from '@/lib/db/schema'

// 에세이 댓글 데이터 계층 — 평면(top-level)만. 평문 저장(마크다운/HTML 파싱 없음).
// view/reaction 헬퍼와 동일한 결: 발행 글 id 기준 쿼리, 클라이언트가 런타임에 호출.

const PUBLIC_COLS = {
  id: essayComments.id,
  parentId: essayComments.parentId,
  authorId: essayComments.authorId,
  authorProvider: essayComments.authorProvider,
  authorName: essayComments.authorName,
  authorImage: essayComments.authorImage,
  body: essayComments.body,
  createdAt: essayComments.createdAt,
}

// top-level(parent_id IS NULL) 댓글 시간순(오름차순).
export async function listComments(essayId: number) {
  return db
    .select(PUBLIC_COLS)
    .from(essayComments)
    .where(and(eq(essayComments.essayId, essayId), isNull(essayComments.parentId)))
    .orderBy(asc(essayComments.createdAt))
}

export type NewCommentInput = {
  authorId: string
  authorProvider: string
  authorName: string
  authorImage?: string | null
  body: string
}

// top-level 댓글 생성 → 생성된 행(공개 컬럼) 반환.
export async function createComment(essayId: number, input: NewCommentInput) {
  const [row] = await db
    .insert(essayComments)
    .values({
      essayId,
      parentId: null, // 이번 단계는 top-level 만
      authorId: input.authorId,
      authorProvider: input.authorProvider,
      authorName: input.authorName,
      authorImage: input.authorImage ?? null,
      body: input.body,
    })
    .returning(PUBLIC_COLS)
  return row ?? null
}
