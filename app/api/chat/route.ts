import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { hashIp } from '@/lib/essay-views'
import { chatWithTools } from '@/lib/ai/chat'
import { tools, toolFns } from '@/lib/ai/chat-tools'

// 사이트 안내 챗봇 — Responses API + function calling. 키(OPENAI_API_KEY/CHAT_MODEL)는 서버에서만.
// 브라우저는 OpenAI를 직접 부르지 않는다(이 라우트가 중개). 키/실패는 graceful 200(500 아님).
export const runtime = 'nodejs' // server-only + OpenAI SDK → edge 불가
export const dynamic = 'force-dynamic'

const SYSTEM = `당신은 "ReactNext Central"의 안내 도우미입니다. 이 사이트는 만들고 판단한 것을 기록하는 곳으로 — 글(에세이), 해부(만들며 내린 결정의 기록), 쇼케이스(실험 데모·실물 제품), 책, 그리고 만든 사람을 소개합니다.

규칙:
- 이 사이트에 대한 안내만 합니다. 사이트와 무관한 일반 요청(코드 대신 작성, 번역, 잡담, 외부 지식 질문 등)은 "저는 이 사이트 안내만 도와드릴 수 있어요"라고 정중히 사양하세요.
- 정확한 정보는 추측하지 말고 제공된 함수(search_content, list_showcases, get_books)로 가져와 답하세요. 함수 결과에 없는 제목·링크를 지어내지 마세요.
- 한국어로 간결하게 답합니다. 관련 글/페이지가 있으면 그 path(예: essays/..., showcases/anatomy/...)를 함께 안내하세요.
- 모르면 모른다고 말하고 상단 메뉴(에세이·쇼케이스·저서)를 권하세요.
- 사이트 전반 소개·인사 요청은 함수 호출 없이 위 배경지식으로 간결히 답하세요.
- 쇼케이스(해부·실험·실물)는 list_showcases 로 — 전반 질문은 tier 없이 호출해 세 틀을 함께 소개하세요. 특정 키워드 글 검색은 search_content(필요 시 type=essay/anatomy), 에세이 추천은 search_content(type=essay).`

const bodySchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().min(1).max(2000),
      })
    )
    .min(1)
    .max(12),
})

// 레이트리밋(IP 해시) — LLM 비용 보호. 60초 / 10회 초과 시 429. 인메모리 best-effort(서버리스 한계).
const WINDOW_MS = 60_000
const MAX_IN_WINDOW = 10
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

const SORRY =
  '지금은 답변을 드릴 수 없어요. 잠시 후 다시 시도하시거나 상단 메뉴(에세이·쇼케이스·저서)를 둘러봐 주세요.'
const NO_STORE = { 'cache-control': 'no-store' }

export async function POST(req: NextRequest) {
  // 레이트리밋
  const xff = req.headers.get('x-forwarded-for') || ''
  const ip = xff.split(',')[0].trim() || 'unknown'
  if (rateLimited(hashIp(ip), Date.now())) {
    return NextResponse.json({ error: 'too many requests' }, { status: 429 })
  }

  const parsed = bodySchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }

  try {
    const { reply, links } = await chatWithTools({
      system: SYSTEM,
      messages: parsed.data.messages,
      tools,
      toolFns,
    })
    return NextResponse.json({ reply: reply || SORRY, links }, { headers: NO_STORE })
  } catch {
    // 키 미설정/OpenAI 실패 → 정중한 reply(200), 500 아님
    return NextResponse.json({ reply: SORRY, links: [] }, { status: 200, headers: NO_STORE })
  }
}
