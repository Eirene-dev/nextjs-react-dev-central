import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { listPosts, createPost, createSchema } from '@/lib/board'

export const runtime = 'nodejs'

// 동일 출처 가드(CSRF 보강) — 세션 쿠키 sameSite 와 더불어 Origin 호스트 일치 확인
function sameOrigin(req: NextRequest): boolean {
  const origin = req.headers.get('origin')
  if (!origin) return true // 동일 출처 GET/리다이렉트 등엔 Origin 없음. 변경은 호출부에서 추가 확인.
  try {
    return new URL(origin).host === req.headers.get('host')
  } catch {
    return false
  }
}

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams
  const pageKey = sp.get('pageKey') || 'book:judgment-dev'
  const type = sp.get('type') || undefined
  const cursorRaw = sp.get('cursor')
  const cursor = cursorRaw && /^\d+$/.test(cursorRaw) ? Number(cursorRaw) : undefined
  const data = await listPosts(pageKey, { type, cursor })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
  }
  if (req.headers.get('origin') && !sameOrigin(req)) {
    return NextResponse.json({ error: '허용되지 않은 요청입니다.' }, { status: 403 })
  }
  const json = await req.json().catch(() => null)
  const parsed = createSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: '입력이 올바르지 않습니다.' }, { status: 400 })
  }
  const result = await createPost(parsed.data, {
    id: session.user.id,
    name: session.user.name || '익명',
    avatar: session.user.image || null,
  })
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: result.status ?? 400 })
  }
  return NextResponse.json(result.post, { status: 201 })
}
