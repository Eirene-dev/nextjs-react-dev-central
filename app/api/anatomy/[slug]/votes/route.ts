import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { allAnatomy } from '@/lib/content'
import { hashIp } from '@/lib/essay-views'
import { getVoteCounts, castVote } from '@/lib/anatomy-votes'
import { bufferVote, mergeVoteDeltas } from '@/lib/counters'

export const runtime = 'nodejs'
// 런타임 신선도 — 빌드에 굽지 않음. 페이지(SSG)와 분리, GET 은 no-store.
export const dynamic = 'force-dynamic'

// slug → 허용 option key 집합(빌드 타임 Velite 데이터 기반 화이트리스트).
const OPTION_KEYS: Record<string, Set<string>> = Object.fromEntries(
  allAnatomy.map((a) => [a.slug, new Set(a.options.map((o) => o.key))])
)

function decodeSlug(s: string): string {
  try {
    return decodeURIComponent(s)
  } catch {
    return s
  }
}

// ── best-effort 레이트리밋 ───────────────────────────────────
// 인메모리(IP 해시) — 짧은 창에 과도한 POST 만 차단. 서버리스에서는 인스턴스별 상태라
// 완벽하지 않다(1차 dedupe 는 (slug, voter_token) UNIQUE). 라이트한 남용 방지용.
const WINDOW_MS = 10_000
const MAX_IN_WINDOW = 8
const hits = new Map<string, { n: number; resetAt: number }>()
function rateLimited(key: string, now: number): boolean {
  const cur = hits.get(key)
  if (!cur || now > cur.resetAt) {
    hits.set(key, { n: 1, resetAt: now + WINDOW_MS })
    return false
  }
  cur.n += 1
  return cur.n > MAX_IN_WINDOW
}

// 집계 — 공개(인증 불필요).
export async function GET(_req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const slug = decodeSlug((await ctx.params).slug)
  if (!OPTION_KEYS[slug]) return NextResponse.json({ error: 'not found' }, { status: 404 })
  try {
    // base(캐시된 Postgres 집계) + 아직 플러시 안 된 Redis 증분.
    const { counts: base } = await getVoteCounts(slug)
    const { counts, total } = await mergeVoteDeltas(slug, base)
    return NextResponse.json({ counts, total }, { headers: { 'cache-control': 'no-store, max-age=0' } })
  } catch {
    return NextResponse.json({ counts: {}, total: 0 }, { headers: { 'cache-control': 'no-store, max-age=0' } })
  }
}

const bodySchema = z.object({
  option: z.string().min(1).max(8),
  token: z
    .string()
    .min(8)
    .max(128)
    .regex(/^[A-Za-z0-9_-]+$/), // UUID 등 안전 문자만
})

// 투표 — 공개. slug·option 화이트리스트 검증, 1회(UNIQUE) 후 갱신된 집계 반환.
export async function POST(req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const slug = decodeSlug((await ctx.params).slug)
  const allowed = OPTION_KEYS[slug]
  if (!allowed) return NextResponse.json({ error: 'not found' }, { status: 404 })

  const parsed = bodySchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success || !allowed.has(parsed.data.option)) {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }

  // 레이트리밋(IP 해시) — best-effort.
  const xff = req.headers.get('x-forwarded-for') || ''
  const ip = xff.split(',')[0].trim() || 'unknown'
  if (rateLimited(hashIp(ip), Date.now())) {
    return NextResponse.json({ error: 'too many requests' }, { status: 429 })
  }

  try {
    // Redis 버퍼 우선 — 표를 여기 모았다가 cron 이 하루 1회 Postgres 에 재생한다.
    // 미설정·장애·대기열 포화면 null → 예전처럼 즉시 Postgres 에 쓴다.
    const buffered = await bufferVote(slug, parsed.data.option, parsed.data.token)
    if (buffered === null) {
      await castVote(slug, parsed.data.option, parsed.data.token) // 중복은 ON CONFLICT 로 무시
    }
    const { counts: base } = await getVoteCounts(slug)
    const { counts, total } = await mergeVoteDeltas(slug, base)
    return NextResponse.json({ counts, total })
  } catch {
    return NextResponse.json({ counts: {}, total: 0 }, { status: 200 })
  }
}
