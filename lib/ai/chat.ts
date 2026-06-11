import 'server-only'
import OpenAI from 'openai'

// 챗봇 두뇌 — OpenAI Responses API + function calling 루프(비스트리밍). 키는 서버에서만 읽는다.
// 기존 lib/ai/complete.ts(Chat Completions, 에세이 BYOAI)와 분리 공존(의도됨).
// 모델은 챗봇 전용 CHAT_MODEL(OPENAI_MODEL=에세이 교정과 독립).

const CHAT_MODEL = process.env.CHAT_MODEL || 'gpt-5.4-mini'
const MAX_ROUNDS = 3 // tool 라운드 상한(무한루프 방지)
const MAX_OUTPUT_TOKENS = 800

export class OpenAiKeyMissingError extends Error {
  constructor() {
    super('OPENAI_API_KEY 미설정')
    this.name = 'OpenAiKeyMissingError'
  }
}

export type ChatMsg = { role: 'user' | 'assistant'; content: string }
export type ChatLink = { title: string; path: string }
export type ChatResult = { reply: string; links: ChatLink[] }
export type ToolFns = Record<string, (args: Record<string, unknown>) => unknown | Promise<unknown>>

// 모킹 QA용 최소 클라이언트 인터페이스(client 주입 seam) — 실제 OpenAI 인스턴스도 이 형태에 부합.
export type ResponsesClient = {
  responses: { create: (params: Record<string, unknown>) => Promise<any> }
}

export async function chatWithTools({
  system,
  messages,
  tools,
  toolFns,
  client,
}: {
  system: string
  messages: ChatMsg[]
  tools: unknown[]
  toolFns: ToolFns
  client?: ResponsesClient
}): Promise<ChatResult> {
  // 키는 서버에서만. 미설정이면 throw → 라우트가 graceful reply 로 처리(500 아님).
  if (!client && !process.env.OPENAI_API_KEY) throw new OpenAiKeyMissingError()
  const api: ResponsesClient = client ?? (new OpenAI() as unknown as ResponsesClient)

  // Responses input 아이템 누적(상태 비저장).
  const input: any[] = messages.map((m) => ({ role: m.role, content: m.content }))
  const links: ChatLink[] = []
  const seen = new Set<string>()
  const collect = (result: unknown) => {
    const arr = (result as { results?: unknown })?.results
    if (!Array.isArray(arr)) return
    for (const r of arr) {
      const path = (r as { path?: string })?.path
      const title = (r as { title?: string })?.title
      if (path && title && !seen.has(path)) {
        seen.add(path)
        links.push({ title, path })
      }
    }
  }

  let lastText = ''
  for (let round = 0; round <= MAX_ROUNDS; round++) {
    const res = await api.responses.create({
      model: CHAT_MODEL,
      instructions: system,
      input,
      tools,
      // 마지막 라운드는 tool 사용 금지 → 강제 텍스트 종료.
      tool_choice: round < MAX_ROUNDS ? 'auto' : 'none',
      max_output_tokens: MAX_OUTPUT_TOKENS,
    })

    lastText = res?.output_text ?? lastText
    const calls = Array.isArray(res?.output)
      ? res.output.filter((o: any) => o?.type === 'function_call')
      : []
    if (calls.length === 0) return { reply: lastText, links }

    for (const call of calls) {
      input.push(call) // 모델의 function_call 아이템 echo
      let args: Record<string, unknown> = {}
      try {
        args = JSON.parse(call.arguments || '{}')
      } catch {
        args = {} // 모델이 비정상 JSON 생성 가능 — 방어
      }
      let result: unknown
      try {
        result = toolFns[call.name] ? await toolFns[call.name](args) : { error: 'unknown tool' }
      } catch {
        result = { error: 'tool failed' }
      }
      collect(result)
      input.push({ type: 'function_call_output', call_id: call.call_id, output: JSON.stringify(result) })
    }
  }

  // 최대 라운드 안전 종료(마지막 tool_choice:'none' 의 텍스트).
  return { reply: lastText, links }
}
