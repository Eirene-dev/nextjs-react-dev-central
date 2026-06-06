import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { softDeletePost } from '@/lib/board'

export const runtime = 'nodejs'

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
  }
  const origin = req.headers.get('origin')
  if (origin) {
    try {
      if (new URL(origin).host !== req.headers.get('host')) {
        return NextResponse.json({ error: '허용되지 않은 요청입니다.' }, { status: 403 })
      }
    } catch {
      return NextResponse.json({ error: '허용되지 않은 요청입니다.' }, { status: 403 })
    }
  }
  const { id } = await ctx.params
  const postId = Number(id)
  if (!Number.isInteger(postId) || postId <= 0) {
    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 })
  }
  const result = await softDeletePost(postId, session)
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status ?? 400 })
  }
  return NextResponse.json({ ok: true })
}
