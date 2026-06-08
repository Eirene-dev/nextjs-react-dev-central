import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { isAdmin } from '@/lib/auth-helpers'
import { listDrafts, createDraft } from '@/lib/essay-drafts'

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

// 관리자 게이트 — 세션 + isAdmin. author_id = 세션 id.
async function gate() {
  const session = await auth()
  if (!session?.user?.id || !isAdmin(session)) return null
  return session.user.id
}

export async function GET() {
  const authorId = await gate()
  if (!authorId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  return NextResponse.json(await listDrafts(authorId))
}

export async function POST(req: NextRequest) {
  const authorId = await gate()
  if (!authorId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  if (req.headers.get('origin') && !sameOrigin(req)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }
  const row = await createDraft(authorId)
  return NextResponse.json(row, { status: 201 })
}
