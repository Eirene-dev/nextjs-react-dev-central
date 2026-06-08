// 클라이언트 안전 — AI 제공자 타입/목록(서버 키·SDK import 없음).
export type AiProvider = 'openai' | 'anthropic'

export const AI_PROVIDERS: { value: AiProvider; label: string }[] = [
  { value: 'anthropic', label: 'Anthropic' },
  { value: 'openai', label: 'OpenAI' },
]

export const DEFAULT_PROVIDER: AiProvider = 'anthropic'
