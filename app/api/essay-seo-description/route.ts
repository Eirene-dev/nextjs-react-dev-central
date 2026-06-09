import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { isAdmin } from '@/lib/auth-helpers'
import { generateSeoDescription, seoSchema } from '@/lib/essay-seo'

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

// SEO 메타 설명 생성 — 세션+isAdmin 게이트(401), zod, same-origin. 키 서버 전용. 누를 때만 호출.
export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id || !isAdmin(session)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  if (req.headers.get('origin') && !sameOrigin(req)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }
  const parsed = seoSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: '본문이 없거나 너무 깁니다.' }, { status: 400 })
  }
  try {
    const description = await generateSeoDescription(parsed.data.text, parsed.data.provider)
    return NextResponse.json({ description })
  } catch {
    return NextResponse.json(
      { error: '메타 설명 생성에 실패했습니다. 잠시 후 다시 시도해 주세요.' },
      { status: 502 }
    )
  }
}
