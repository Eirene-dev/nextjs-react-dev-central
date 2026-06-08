import 'server-only'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { essayPrinciples } from '@/lib/db/schema'
import { SEED, principlesSchema, type PrinciplesData } from '@/lib/essay-principles'

// 에세이 원칙 DB 접근(server-only) — 시드/스키마는 lib/essay-principles.ts(클라이언트 안전).
export async function getPrinciples(authorId: string): Promise<PrinciplesData> {
  const [row] = await db
    .select({ data: essayPrinciples.data })
    .from(essayPrinciples)
    .where(eq(essayPrinciples.authorId, authorId))
    .limit(1)
  // 행 없으면 시드 반환(클라이언트가 시드로 시작)
  const parsed = row ? principlesSchema.safeParse(row.data) : null
  return parsed?.success ? parsed.data : SEED
}

export async function putPrinciples(authorId: string, data: PrinciplesData) {
  await db
    .insert(essayPrinciples)
    .values({ authorId, data, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: essayPrinciples.authorId,
      set: { data, updatedAt: new Date() },
    })
}
