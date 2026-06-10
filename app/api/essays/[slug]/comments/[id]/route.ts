import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getPublishedEssayBySlug } from '@/lib/essay-drafts'
import { deleteComment } from '@/lib/essay-comments'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function decodeSlug(s: string): string {
  try {
    return decodeURIComponent(s)
  } catch {
    return s
  }
}

// 삭제 — 로그인 필요. 작성자 본인 또는 관리자만(서버 최종 검증). 답글=하드, 답글 달린 top-level=소프트(묘비).
export async function DELETE(req: NextRequest, ctx: { params: Promise<{ slug: string; id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { slug: rawSlug, id: rawId } = await ctx.params
  const slug = decodeSlug(rawSlug)
  const id = Number(rawId)
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }

  const essay = await getPublishedEssayBySlug(slug)
  if (!essay) return NextResponse.json({ error: 'not found' }, { status: 404 })

  const result = await deleteComment(essay.id, id, {
    id: session.user.id,
    provider: session.user.provider ?? 'github',
    isAdmin: session.user.isAdmin === true,
  })
  if (result === 'not_found') return NextResponse.json({ error: 'not found' }, { status: 404 })
  if (result === 'forbidden') return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  return NextResponse.json({ ok: true })
}
