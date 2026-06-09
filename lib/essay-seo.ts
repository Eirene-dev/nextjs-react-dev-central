import 'server-only'
import { z } from 'zod'
import { aiComplete, providerSchema } from '@/lib/ai/complete'

// SEO 메타 설명 생성 — 공용 aiComplete 재사용(텍스트만, jsonMode 아님). 입력=마크다운.
const MAX_BODY = 100_000

export const seoSchema = z.object({
  text: z.string().min(1).max(MAX_BODY),
  provider: providerSchema,
})

const SYSTEM =
  '다음 에세이를 구글 검색결과 스니펫에 적합한 한국어 메타 설명으로 요약하세요. ' +
  '150자 이내, 글의 핵심을 담되 자연스럽고 클릭을 부르도록. ' +
  '따옴표·해시태그·이모지 없이 평문 한~두 문장만 출력하세요.'

// 모델이 따옴표·줄바꿈을 덧붙여도 평문 한 줄로 정리.
function clean(out: string): string {
  return out
    .trim()
    .replace(/^["'`“”]+|["'`“”]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 200)
}

export async function generateSeoDescription(
  text: string,
  provider: z.infer<typeof providerSchema>
): Promise<string> {
  const out = await aiComplete({ provider, system: SYSTEM, user: text })
  return clean(out)
}
