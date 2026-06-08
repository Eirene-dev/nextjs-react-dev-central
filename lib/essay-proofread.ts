import 'server-only'
import Anthropic from '@anthropic-ai/sdk'
import { z } from 'zod'

// 교정 BYOAI — 서버에서 Claude 호출(키 서버 전용). 입력=마크다운, 출력=교정 JSON.
// 모델은 ANTHROPIC_MODEL env, 없으면 교정 품질용 Sonnet 기본값.
const MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6'
const MAX_BODY = 100_000

export const proofreadSchema = z.object({
  body: z.string().min(1).max(MAX_BODY),
})

export type ProofChange = { before: string; after: string; reason: string }
export type ProofResult = { corrected: string; changes: ProofChange[] }

const SYSTEM =
  '당신은 한국어 교정 도구입니다. 다음 글의 맞춤법, 띄어쓰기, 비문, 명백한 오타만 고쳐주세요. ' +
  "문장 구조나 표현을 '더 자연스럽게' 바꾸지 마세요. 짧은 문장을 늘리지 말고, 직설적 표현을 부드럽게 바꾸지 마세요. " +
  '반복이 의도된 강조일 수 있으니 임의로 줄이지 마세요. 비표준 표현도 의도일 수 있으니 지적만 하고 단정적으로 수정하지 마세요. ' +
  '설명·서문 없이 JSON만 출력하세요. ' +
  '출력 형식: {"corrected": "교정된 전체 본문", "changes": [{"before": "원문", "after": "수정", "reason": "사유"}]}'

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

const resultSchema = z.object({
  corrected: z.string(),
  changes: z
    .array(z.object({ before: z.string(), after: z.string(), reason: z.string() }))
    .default([]),
})

// 모델 출력 텍스트 → 검증된 ProofResult (펜스·서문 제거 + 스키마 검증). 견고성 단위 테스트 대상.
export function parseProofResult(text: string): ProofResult {
  return resultSchema.parse(extractJson(text))
}

export async function proofread(body: string): Promise<ProofResult> {
  const client = new Anthropic() // ANTHROPIC_API_KEY (서버 전용)
  // 긴 본문 대비 스트리밍으로 최종 메시지 수집(HTTP 타임아웃 회피). 샘플링 파라미터는
  // 모델별 호환(Opus 4.x 는 temperature 미지원)을 위해 생략 — 결정성은 프롬프트로 유도.
  const stream = client.messages.stream({
    model: MODEL,
    max_tokens: 32000,
    system: SYSTEM,
    messages: [{ role: 'user', content: body }],
  })
  const msg = await stream.finalMessage()
  const text = msg.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('')
  return parseProofResult(text)
}
