import { createHash } from 'crypto'
import { and, eq, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { essayDrafts, essayViewLog } from '@/lib/db/schema'

// 익명 조회 집계 — 원본 IP 는 저장하지 않고 AUTH_SECRET 솔트로 해시만 보관.
export function hashIp(ip: string): string {
  const salt = process.env.AUTH_SECRET || ''
  return createHash('sha256').update(`${ip}|${salt}`).digest('hex')
}

// 오늘 날짜(UTC, YYYY-MM-DD) — 조회 dedupe 단위.
export function today(): string {
  return new Date().toISOString().slice(0, 10)
}

// 봇 판별 — 조회수 집계에서 제외한다.
// 집계 정확도 문제이기도 하지만 비용 문제가 더 크다: Neon 은 5분 비활동 후에야 정지하므로
// 봇의 조회 1건이 5분치 compute 를 결제시킨다. 산발적인 봇 방문 = 상시 가동.
// JS 를 실행하는 크롤러(Googlebot 등)만 여기 도달하지만, 그것만으로도 충분히 비싸다.
const BOT_UA = /bot|crawler|spider|crawling|slurp|bingpreview|headlesschrome|phantomjs|puppeteer|playwright|lighthouse|pagespeed|gtmetrix|curl|wget|python-requests|node-fetch|axios|go-http-client|java\/|okhttp|scrapy|facebookexternalhit|embedly|quora link preview|whatsapp|telegrambot|discordbot|slackbot|twitterbot|linkedinbot|pinterest|redditbot|applebot|ia_archiver|semrush|ahrefs|mj12bot|dotbot|petalbot|yandex|baiduspider|duckduckbot|uptime|pingdom|statuscake|monitoring/i

export function isBot(userAgent: string | null | undefined): boolean {
  if (!userAgent) return true // UA 없는 요청은 브라우저가 아니다 — 집계하지 않는다.
  return BOT_UA.test(userAgent)
}

// (essay_id, ip_hash, day) 를 INSERT … ON CONFLICT DO NOTHING.
// 새로 들어갔으면(첫 조회) view_count += 1 후 갱신값을, 중복이면 현재값을 반환.
export async function recordView(
  essayId: number,
  ipHash: string,
  day: string,
  currentCount: number
): Promise<number> {
  const inserted = await db
    .insert(essayViewLog)
    .values({ essayId, ipHash, day })
    .onConflictDoNothing()
    .returning({ id: essayViewLog.id })

  if (inserted.length === 0) return currentCount // 오늘 이미 본 IP — 카운트 그대로

  const [row] = await db
    .update(essayDrafts)
    .set({ viewCount: sql`${essayDrafts.viewCount} + 1` })
    .where(eq(essayDrafts.id, essayId))
    .returning({ viewCount: essayDrafts.viewCount })
  return row?.viewCount ?? currentCount + 1
}

// 발행 글의 현재 view_count 만 조회(관리자 자기조회 등 카운트 없이 표시할 때).
export async function getPublishedViewCount(essayId: number): Promise<number> {
  const [row] = await db
    .select({ viewCount: essayDrafts.viewCount })
    .from(essayDrafts)
    .where(and(eq(essayDrafts.id, essayId), eq(essayDrafts.status, 'published')))
    .limit(1)
  return row?.viewCount ?? 0
}
