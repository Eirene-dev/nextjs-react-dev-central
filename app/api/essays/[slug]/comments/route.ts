import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/auth'
import { getPublishedEssayBySlug } from '@/lib/essay-drafts'
import { listComments, createComment } from '@/lib/essay-comments'

export const runtime = 'nodejs'
// 런타임 신선도 — 빌드에 굽지 않음. GET 은 no-store(아래 헤더), 페이지(SSG)와 분리.
export const dynamic = 'force-dynamic'

function decodeSlug(s: string): string {
  try {
    return decodeURIComponent(s)
  } catch {
    return s
  }
}

// 목록 — 공개(인증 불필요). 발행 글의 top-level 댓글 시간순.
export async function GET(req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const slug = decodeSlug((await ctx.params).slug)
  const essay = await getPublishedEssayBySlug(slug)
  if (!essay) return NextResponse.json({ error: 'not found' }, { status: 404 })

  const comments = await listComments(essay.id)
  return NextResponse.json(
    { comments },
    { headers: { 'cache-control': 'no-store, max-age=0' } }
  )
}

const bodySchema = z.object({
  body: z.string().trim().min(1).max(2000),
})

// 작성 — 로그인 필요. 평문 저장(마크다운/HTML 파싱 안 함).
export async function POST(req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const slug = decodeSlug((await ctx.params).slug)
  const essay = await getPublishedEssayBySlug(slug)
  if (!essay) return NextResponse.json({ error: 'not found' }, { status: 404 })

  const parsed = bodySchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: 'bad request' }, { status: 400 })

  const comment = await createComment(essay.id, {
    authorId: session.user.id,
    authorProvider: session.user.provider ?? 'github', // 신원 스냅샷(레거시 토큰 fallback)
    authorName: session.user.name ?? '익명',
    authorImage: session.user.image ?? null,
    body: parsed.data.body,
  })
  return NextResponse.json({ comment }, { status: 201 })
}
