import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { isAdmin } from '@/lib/auth-helpers'
import { getPublishedEssayBySlug } from '@/lib/essay-drafts'
import { hashIp, today, recordView } from '@/lib/essay-views'

export const runtime = 'nodejs'

// 익명 조회 집계 — 공개(인증 불필요). 발행 글만. 관리자(작성자) 조회는 카운트하지 않음.
// 오류는 조용히 처리하고 가능한 현재 카운트(또는 0)를 반환한다.
function decodeSlug(s: string): string {
  try {
    return decodeURIComponent(s)
  } catch {
    return s
  }
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  try {
    const slug = decodeSlug((await ctx.params).slug)
    const essay = await getPublishedEssayBySlug(slug)
    if (!essay) return NextResponse.json({ error: 'not found' }, { status: 404 })

    const current = essay.viewCount ?? 0

    // 관리자(작성자 본인) → 카운트 없이 현재값만(뻥튀기 방지)
    const session = await auth()
    if (isAdmin(session)) return NextResponse.json({ count: current })

    // IP(x-forwarded-for 첫 값) 해시 — 원본 IP 미저장. 헤더 없으면 'unknown'.
    const xff = req.headers.get('x-forwarded-for') || ''
    const ip = xff.split(',')[0].trim() || 'unknown'
    const ipHash = hashIp(ip)

    const count = await recordView(essay.id, ipHash, today(), current)
    return NextResponse.json({ count })
  } catch {
    // 집계 실패는 사용자에게 노출하지 않음 — 가능한 현재 카운트(없으면 0)
    try {
      const slug = decodeSlug((await ctx.params).slug)
      const essay = await getPublishedEssayBySlug(slug)
      return NextResponse.json({ count: essay?.viewCount ?? 0 })
    } catch {
      return NextResponse.json({ count: 0 })
    }
  }
}
