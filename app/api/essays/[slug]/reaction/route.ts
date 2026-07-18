import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getPublishedEssayBySlug } from '@/lib/essay-drafts'
import { toggleReaction } from '@/lib/essay-reactions'
import { bufferReaction } from '@/lib/counters'

export const runtime = 'nodejs'

// 익명 👍 토글 — 공개(인증 불필요). 발행 글만. token = 클라이언트 localStorage 식별자.
// 오류는 조용히 처리하고 가능한 현재 카운트를 반환한다.
const bodySchema = z.object({
  action: z.enum(['like', 'unlike']),
  token: z
    .string()
    .min(8)
    .max(128)
    .regex(/^[A-Za-z0-9_-]+$/), // UUID 등 안전 문자만
})

function decodeSlug(s: string): string {
  try {
    return decodeURIComponent(s)
  } catch {
    return s
  }
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  let slug = ''
  try {
    slug = decodeSlug((await ctx.params).slug)

    const parsed = bodySchema.safeParse(await req.json().catch(() => null))
    if (!parsed.success) return NextResponse.json({ error: 'bad request' }, { status: 400 })

    const essay = await getPublishedEssayBySlug(slug)
    if (!essay) return NextResponse.json({ error: 'not found' }, { status: 404 })

    // base = 마지막 플러시까지 Postgres 에 반영된 값. Redis 버퍼가 우선, 실패 시 직접 쓰기.
    const base = essay.reactionCount ?? 0

    const buffered = await bufferReaction(essay.id, parsed.data.token, parsed.data.action, base)
    if (buffered !== null) return NextResponse.json({ count: buffered })

    const count = await toggleReaction(essay.id, parsed.data.token, parsed.data.action, base)
    return NextResponse.json({ count })
  } catch {
    // 집계 실패는 노출하지 않음 — 가능한 현재 카운트(없으면 0)
    try {
      const essay = await getPublishedEssayBySlug(slug)
      return NextResponse.json({ count: essay?.reactionCount ?? 0 })
    } catch {
      return NextResponse.json({ count: 0 })
    }
  }
}
