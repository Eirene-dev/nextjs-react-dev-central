import 'server-only'
import { z } from 'zod'
import { aiComplete, providerSchema } from '@/lib/ai/complete'

// 구조 분석 — 공용 AI 추상화(OpenAI/Anthropic) 재사용. 입력=마크다운, 출력=논증 구조 JSON.
const MAX_BODY = 100_000

export const structureSchema = z.object({
  text: z.string().min(1).max(MAX_BODY),
  provider: providerSchema,
})

export type StructureResult = {
  thesis: { found: boolean; text: string; location: string; clarity: 'clear' | 'implicit' | 'missing' }
  argument_flow: { order: number; type: 'claim' | 'evidence' | 'example' | 'transition'; summary: string }[]
  counterargument: {
    addressed: boolean
    pattern: 'concede-weaken' | 'correct-misunderstanding' | 'none'
    summary: string
  }
  conclusion: {
    found: boolean
    follows: boolean
    type: 'definitive' | 'open-question' | 'next-inquiry'
    clarity_score: number
  }
}

const SYSTEM =
  '당신은 한국어 에세이 구조 분석 도구입니다. 다음 에세이를 읽고 논증 구조를 분석해, 아래 JSON 스키마로만 응답하세요. ' +
  '설명·서문 없이 JSON만 출력합니다.\n' +
  '- thesis: 핵심 주장이 무엇이고 어디에 있는지, 얼마나 명확한지\n' +
  '- argument_flow: 주장을 받치는 단계들의 순서와 유형\n' +
  '- counterargument: 반론을 다뤘는지, 어떤 패턴인지(인정-약화 / 오해-지적 / 없음)\n' +
  '- conclusion: 결론이 있는지, 논증에서 따라 나오는지, 유형, 명확도(0~1)\n' +
  'JSON 스키마:\n' +
  '{"thesis":{"found":true,"text":"주제문 요약","location":"2번째 단락","clarity":"clear|implicit|missing"},' +
  '"argument_flow":[{"order":1,"type":"claim|evidence|example|transition","summary":"한 줄 요약"}],' +
  '"counterargument":{"addressed":true,"pattern":"concede-weaken|correct-misunderstanding|none","summary":"어떤 반론을 어떻게 다뤘는지"},' +
  '"conclusion":{"found":true,"follows":true,"type":"definitive|open-question|next-inquiry","clarity_score":0.0}}'

// ```json 펜스·서문이 있어도 JSON 객체를 견고하게 추출.
function extractJson(text: string): unknown {
  let t = text.trim()
  const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/i)
  if (fence) t = fence[1].trim()
  try {
    return JSON.parse(t)
  } catch {
    const s = t.indexOf('{')
    const e = t.lastIndexOf('}')
    if (s !== -1 && e > s) return JSON.parse(t.slice(s, e + 1))
    throw new Error('unparseable')
  }
}

// 관대한 검증 — 모델 출력 흔들림 대비 enum 은 catch 로 보정, 누락은 기본값.
const resultSchema = z.object({
  thesis: z
    .object({
      found: z.boolean().catch(false),
      text: z.string().catch(''),
      location: z.string().catch(''),
      clarity: z.enum(['clear', 'implicit', 'missing']).catch('missing'),
    })
    .default({ found: false, text: '', location: '', clarity: 'missing' }),
  argument_flow: z
    .array(
      z.object({
        order: z.number().catch(0),
        type: z.enum(['claim', 'evidence', 'example', 'transition']).catch('claim'),
        summary: z.string().catch(''),
      })
    )
    .default([]),
  counterargument: z
    .object({
      addressed: z.boolean().catch(false),
      pattern: z.enum(['concede-weaken', 'correct-misunderstanding', 'none']).catch('none'),
      summary: z.string().catch(''),
    })
    .default({ addressed: false, pattern: 'none', summary: '' }),
  conclusion: z
    .object({
      found: z.boolean().catch(false),
      follows: z.boolean().catch(false),
      type: z.enum(['definitive', 'open-question', 'next-inquiry']).catch('open-question'),
      clarity_score: z.number().catch(0),
    })
    .default({ found: false, follows: false, type: 'open-question', clarity_score: 0 }),
})

export function parseStructureResult(text: string): StructureResult {
  return resultSchema.parse(extractJson(text)) as StructureResult
}

export async function analyzeStructure(
  text: string,
  provider: z.infer<typeof providerSchema>
): Promise<StructureResult> {
  const out = await aiComplete({ provider, system: SYSTEM, user: text, jsonMode: true })
  return parseStructureResult(out)
}
