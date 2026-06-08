import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { isAdmin } from '@/lib/auth-helpers'
import { analyzeStructure, structureSchema } from '@/lib/essay-structure'

export const runtime = 'nodejs'
export const maxDuration = 60

function sameOrigin(req: NextRequest): boolean {
  const origin = req.headers.get('origin')
  if (!origin) return true
  try {
    return new URL(origin).host === req.headers.get('host')
  } catch {
    return false
  }
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id || !isAdmin(session)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  if (req.headers.get('origin') && !sameOrigin(req)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }
  const json = await req.json().catch(() => null)
  const parsed = structureSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: '분석할 본문이 없거나 너무 깁니다.' }, { status: 400 })
  }
  try {
    const result = await analyzeStructure(parsed.data.text, parsed.data.provider)
    return NextResponse.json(result)
  } catch {
    return NextResponse.json(
      { error: '구조 분석에 실패했습니다. 잠시 후 다시 시도해 주세요.' },
      { status: 502 }
    )
  }
}
