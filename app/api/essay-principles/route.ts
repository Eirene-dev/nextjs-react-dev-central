import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { isAdmin } from '@/lib/auth-helpers'
import { principlesSchema } from '@/lib/essay-principles'
import { getPrinciples, putPrinciples } from '@/lib/essay-principles-db'

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

export async function GET() {
  const authorId = await gate()
  if (!authorId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  return NextResponse.json(await getPrinciples(authorId))
}

export async function PUT(req: NextRequest) {
  const authorId = await gate()
  if (!authorId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  if (req.headers.get('origin') && !sameOrigin(req)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }
  const json = await req.json().catch(() => null)
  const parsed = principlesSchema.safeParse(json)
  if (!parsed.success) return NextResponse.json({ error: 'bad request' }, { status: 400 })
  await putPrinciples(authorId, parsed.data)
  return NextResponse.json({ ok: true })
}
