import 'server-only'
import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'
import { z } from 'zod'

// 공용 서버 AI 추상화 — 제공자(OpenAI/Anthropic) 선택. 키는 모두 서버 전용.
// 7단계 구조분석에서도 재사용. jsonMode 면 JSON 문자열 출력을 유도(견고 파싱은 호출부).
export const providerSchema = z.enum(['openai', 'anthropic'])
export type AiProvider = z.infer<typeof providerSchema>

const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6'
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini' // 비용 적정·한국어 교정 양호
const MAX_TOKENS = 16000

export async function aiComplete({
  provider,
  system,
  user,
  jsonMode = false,
}: {
  provider: AiProvider
  system: string
  user: string
  jsonMode?: boolean
}): Promise<string> {
  if (provider === 'anthropic') {
    if (!process.env.ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY 미설정')
    const client = new Anthropic()
    // 긴 본문 대비 스트리밍 후 finalMessage(타임아웃 회피). 샘플링 파라미터는
    // 모델별 호환(Opus 4.x 는 temperature 미지원)을 위해 생략 — 결정성은 프롬프트로.
    const stream = client.messages.stream({
      model: ANTHROPIC_MODEL,
      max_tokens: MAX_TOKENS,
      system, // jsonMode 시 system 에 JSON-only 지시 포함되어 있음
      messages: [{ role: 'user', content: user }],
    })
    const msg = await stream.finalMessage()
    return msg.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map((b) => b.text)
      .join('')
  }

  // openai
  if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY 미설정')
  const client = new OpenAI()
  const res = await client.chat.completions.create({
    model: OPENAI_MODEL,
    temperature: 0,
    max_completion_tokens: MAX_TOKENS,
    ...(jsonMode ? { response_format: { type: 'json_object' as const } } : {}),
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
  })
  return res.choices[0]?.message?.content ?? ''
}
