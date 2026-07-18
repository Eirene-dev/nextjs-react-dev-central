import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { isAdmin } from '@/lib/auth-helpers'
import { getPublishedEssayBySlug } from '@/lib/essay-drafts'
import { hashIp, today, recordView, isBot } from '@/lib/essay-views'
import { bufferView, readDeltas } from '@/lib/counters'

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

    // base = 마지막 플러시까지 Postgres 에 반영된 값(캐시된 행). delta = 그 이후 Redis 증분.
    const base = essay.viewCount ?? 0

    // 봇 → 카운트 없이 현재값만. 집계 정확도보다 비용이 이유다:
    // 쓰기 1건이 Neon 을 깨우고 5분치 compute 로 결제된다. 위 조회는 캐시라 DB 를 안 친다.
    if (isBot(req.headers.get('user-agent'))) {
      return NextResponse.json({ count: base + (await readDeltas(essay.id)).views })
    }

    // 관리자(작성자 본인) → 카운트 없이 현재값만(뻥튀기 방지)
    const session = await auth()
    if (isAdmin(session)) {
      return NextResponse.json({ count: base + (await readDeltas(essay.id)).views })
    }

    // IP(x-forwarded-for 첫 값) 해시 — 원본 IP 미저장. 헤더 없으면 'unknown'.
    const xff = req.headers.get('x-forwarded-for') || ''
    const ip = xff.split(',')[0].trim() || 'unknown'
    const ipHash = hashIp(ip)

    const day = today()

    // 1순위: Redis 버퍼(Neon 을 깨우지 않는다). 미설정·장애·대기열 포화면 null →
    // 예전처럼 Postgres 에 직접 쓴다. 기능이 Redis 에 종속되지 않게 하는 게 핵심.
    const buffered = await bufferView(essay.id, ipHash, day, base)
    if (buffered !== null) return NextResponse.json({ count: buffered })

    const count = await recordView(essay.id, ipHash, day, base)
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
