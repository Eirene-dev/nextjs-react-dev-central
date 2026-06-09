import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { isAdmin } from '@/lib/auth-helpers'
import { publishDraft, unpublishDraft, publishSchema } from '@/lib/essay-drafts'

export const runtime = 'nodejs'

function sameOrigin(req: NextRequest): boolean {
  const origin = req.headers.get('origin')
  if (!origin) return true
  try {
    return new URL(origin).host === req.headers.get('host')
  } catch {
    return false
  }
}

async function gate() {
  const session = await auth()
  if (!session?.user?.id || !isAdmin(session)) return null
  return session.user.id
}

// 발행/비공개 — 세션+isAdmin 게이트, author 스코프, zod. (공개 페이지는 다음 단계)
export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const authorId = await gate()
  if (!authorId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  if (req.headers.get('origin') && !sameOrigin(req)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }
  const id = Number((await ctx.params).id)
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }
  const parsed = publishSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: 'bad request' }, { status: 400 })

  const row =
    parsed.data.action === 'publish'
      ? await publishDraft(authorId, id, parsed.data)
      : await unpublishDraft(authorId, id)
  if (!row) return NextResponse.json({ error: 'not found' }, { status: 404 })
  return NextResponse.json(row)
}
