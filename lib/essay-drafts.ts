import { z } from 'zod'
import { and, eq, desc } from 'drizzle-orm'
import { db } from '@/lib/db'
import { essayDrafts } from '@/lib/db/schema'

// 에세이 드래프트 데이터 계층 — 모든 쿼리는 authorId 로 스코프(본인 글만).
const MAX_TITLE = 200
const MAX_BODY = 100_000

export const updateSchema = z.object({
  title: z.string().max(MAX_TITLE).optional(),
  body: z.string().max(MAX_BODY).optional(),
})
export type UpdateInput = z.infer<typeof updateSchema>

export async function listDrafts(authorId: string) {
  return db
    .select({ id: essayDrafts.id, title: essayDrafts.title, updatedAt: essayDrafts.updatedAt })
    .from(essayDrafts)
    .where(eq(essayDrafts.authorId, authorId))
    .orderBy(desc(essayDrafts.updatedAt))
}

export async function createDraft(authorId: string) {
  const [row] = await db.insert(essayDrafts).values({ authorId }).returning({ id: essayDrafts.id })
  return row // { id }
}

export async function getDraft(authorId: string, id: number) {
  const [row] = await db
    .select({ id: essayDrafts.id, title: essayDrafts.title, body: essayDrafts.body, updatedAt: essayDrafts.updatedAt })
    .from(essayDrafts)
    .where(and(eq(essayDrafts.id, id), eq(essayDrafts.authorId, authorId)))
    .limit(1)
  return row ?? null
}

export async function updateDraft(authorId: string, id: number, input: UpdateInput) {
  const [row] = await db
    .update(essayDrafts)
    .set({ ...input, updatedAt: new Date() })
    .where(and(eq(essayDrafts.id, id), eq(essayDrafts.authorId, authorId)))
    .returning({ updatedAt: essayDrafts.updatedAt })
  return row ?? null // null = 본인 글 아님/없음
}

export async function deleteDraft(authorId: string, id: number) {
  const rows = await db
    .delete(essayDrafts)
    .where(and(eq(essayDrafts.id, id), eq(essayDrafts.authorId, authorId)))
    .returning({ id: essayDrafts.id })
  return rows.length > 0
}
