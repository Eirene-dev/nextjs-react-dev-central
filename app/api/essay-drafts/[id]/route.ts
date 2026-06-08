import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { isAdmin } from '@/lib/auth-helpers'
import { getDraft, updateDraft, deleteDraft, updateSchema } from '@/lib/essay-drafts'

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

function parseId(raw: string): number | null {
  const n = Number(raw)
  return Number.isInteger(n) && n > 0 ? n : null
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const authorId = await gate()
  if (!authorId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const id = parseId((await ctx.params).id)
  if (!id) return NextResponse.json({ error: 'bad request' }, { status: 400 })
  const row = await getDraft(authorId, id)
  if (!row) return NextResponse.json({ error: 'not found' }, { status: 404 })
  return NextResponse.json(row)
}

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const authorId = await gate()
  if (!authorId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  if (req.headers.get('origin') && !sameOrigin(req)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }
  const id = parseId((await ctx.params).id)
  if (!id) return NextResponse.json({ error: 'bad request' }, { status: 400 })
  const json = await req.json().catch(() => null)
  const parsed = updateSchema.safeParse(json)
  if (!parsed.success) return NextResponse.json({ error: 'bad request' }, { status: 400 })
  const row = await updateDraft(authorId, id, parsed.data)
  if (!row) return NextResponse.json({ error: 'not found' }, { status: 404 })
  return NextResponse.json(row)
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const authorId = await gate()
  if (!authorId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  if (req.headers.get('origin') && !sameOrigin(req)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }
  const id = parseId((await ctx.params).id)
  if (!id) return NextResponse.json({ error: 'bad request' }, { status: 400 })
  const ok = await deleteDraft(authorId, id)
  if (!ok) return NextResponse.json({ error: 'not found' }, { status: 404 })
  return NextResponse.json({ ok: true })
}
