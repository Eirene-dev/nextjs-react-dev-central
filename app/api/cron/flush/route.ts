import { NextRequest, NextResponse } from 'next/server'
import { flushPending } from '@/lib/flush'

// Redis 대기열 → Postgres 일괄 반영. vercel.json 의 crons 가 하루 1회 호출한다.
//
// 하루 1회인 이유: Neon 은 wake 1회당 최소 5분을 결제한다. 시간당 플러시는 하루 24 wake
// (≈월 15 CU-h)를 확정시키는데, 이 사이트의 하루 쓰기량은 그보다 적다 —
// 자주 도는 cron 은 절감이 아니라 순증이 된다. 표시값은 Redis 가 실시간으로 책임지므로
// Postgres 반영이 하루 늦어도 사용자에게 보이는 숫자는 즉시 정확하다.
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function GET(req: NextRequest) {
  // Vercel Cron 은 Authorization: Bearer $CRON_SECRET 을 붙여 보낸다.
  // 공개로 두면 누구나 호출해 DB 를 깨울 수 있다 — 정확히 우리가 없애려는 것.
  const secret = process.env.CRON_SECRET
  if (secret) {
    const auth = req.headers.get('authorization')
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }
  }

  try {
    const result = await flushPending()
    return NextResponse.json(result, {
      status: result.ok ? 200 : 500,
      headers: { 'cache-control': 'no-store' },
    })
  } catch (err) {
    console.error('[cron/flush] 실패:', err)
    return NextResponse.json({ error: 'flush failed' }, { status: 500 })
  }
}
