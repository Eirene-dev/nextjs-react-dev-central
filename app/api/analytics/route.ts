// Umami v2 수집 프록시 — 클라이언트 페이지뷰를 외부 Umami(/api/send)로 전달.
// 분석 실패가 페이지/함수 로그를 더럽히지 않도록 항상 204, 에러는 삼킨다(최대 warn).
export async function POST(request: Request) {
  const endpoint = process.env.ANALYTICS_URL // 전체 URL (…/api/send)
  const website = process.env.ANALYTICS_WEBSITE_ID // Umami website ID

  if (endpoint && website) {
    let body: Record<string, unknown> = {}
    try {
      body = await request.json()
    } catch {
      // 본문 없음/비JSON — 빈 값으로 진행
    }

    // Umami v2 형식: pageview 도 type "event"
    const payload = {
      type: 'event',
      payload: {
        website,
        hostname: body.hostname ?? '',
        url: body.url ?? '/',
        referrer: body.referrer ?? '',
        title: body.title ?? '',
        language: body.language ?? '',
        screen: body.screen ?? '',
      },
    }

    // Umami 는 User-Agent 없는 요청을 봇으로 간주해 기록하지 않음 —
    // 원 클라이언트의 UA·IP 를 그대로 전달한다.
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    const ua = request.headers.get('user-agent')
    if (ua) headers['User-Agent'] = ua
    const xff = request.headers.get('x-forwarded-for')
    if (xff) headers['X-Forwarded-For'] = xff

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      })
      if (!res.ok) console.warn(`analytics upstream ${res.status}`)
    } catch {
      // fire-and-forget — 외부 수집 실패는 조용히 무시
    }
  }

  return new Response(null, { status: 204 })
}
