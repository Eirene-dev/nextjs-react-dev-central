import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { isAdmin } from '@/lib/auth-helpers'
import { proofread, proofreadSchema } from '@/lib/essay-proofread'

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
  const parsed = proofreadSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: '교정할 본문이 없거나 너무 깁니다.' }, { status: 400 })
  }
  try {
    const result = await proofread(parsed.data.body)
    return NextResponse.json(result)
  } catch {
    // API 오류·파싱 실패 — 키/모델 미노출, 친절한 메시지만
    return NextResponse.json(
      { error: '교정에 실패했습니다. 잠시 후 다시 시도해 주세요.' },
      { status: 502 }
    )
  }
}
