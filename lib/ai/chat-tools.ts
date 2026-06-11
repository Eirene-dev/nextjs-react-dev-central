import 'server-only'
import { buildSearchRecords } from '@/lib/search-records'
import { allAnatomy } from '@/lib/content'
import showcasesData from '@/data/showcasesData'
import booksData from '@/data/booksData'

// 챗봇 function 3종 — 순수 서버 함수(외부 fetch 없이 import 한 소스에서). 반환은 LLM이 읽을
// 간결한 구조 + 링크용 path(환각 없는 안내). 정의는 Responses API flat tool 형태.

// 링크 path 정규화: 내부 경로는 선행 슬래시 제거('essays/x'), 외부 URL(https://)은 그대로.
const linkPath = (p: string) => (/^https?:\/\//.test(p) ? p : p.replace(/^\//, ''))

// Responses API flat function tools — strict:true(기본). strict 규칙: 모든 속성을 required 에 넣고,
// 선택 인자는 nullable(type:['x','null']) + enum 에 null 포함으로 표현. additionalProperties:false.
export const tools = [
  {
    type: 'function' as const,
    name: 'search_content',
    strict: true,
    description:
      '사이트의 글(에세이)과 해부(결정 기록)를 제목·요약으로 검색한다. query=null 이면 최신 목록, type 으로 종류 한정.',
    parameters: {
      type: 'object',
      properties: {
        query: { type: ['string', 'null'], description: '검색어(한국어 키워드). null 이면 최신순 전체' },
        type: {
          type: ['string', 'null'],
          enum: ['essay', 'anatomy', null],
          description: '종류 한정: essay | anatomy. null 이면 둘 다',
        },
      },
      required: ['query', 'type'],
      additionalProperties: false,
    },
  },
  {
    type: 'function' as const,
    name: 'list_showcases',
    strict: true,
    description:
      '쇼케이스 세 틀(해부=만들며 내린 결정 기록, 실험=인터랙티브 데모, 실물=운영 제품) 목록. 쇼케이스 전반을 물으면 tier 없이(null) 호출해 세 틀을 모두 소개하라.',
    parameters: {
      type: 'object',
      properties: {
        tier: {
          type: ['string', 'null'],
          enum: ['anatomy', 'experiment', 'built', null],
          description: 'null 이면 세 틀 전체',
        },
      },
      required: ['tier'],
      additionalProperties: false,
    },
  },
  {
    type: 'function' as const,
    name: 'get_books',
    strict: true,
    description: '저자가 쓴/쓰는 책 목록.',
    parameters: { type: 'object', properties: {}, required: [], additionalProperties: false },
  },
]

export type ToolFn = (args: Record<string, unknown>) => unknown | Promise<unknown>

export const toolFns: Record<string, ToolFn> = {
  async search_content(args) {
    const q = typeof args?.query === 'string' ? args.query.trim().toLowerCase() : ''
    const t = args?.type === 'essay' || args?.type === 'anatomy' ? args.type : null
    let recs = await buildSearchRecords()
    if (t) recs = recs.filter((r) => r.type === t)
    const hits = (q ? recs.filter((r) => `${r.title} ${r.summary}`.toLowerCase().includes(q)) : recs).slice(0, 5)
    return {
      results: hits.map((r) => ({
        type: r.type,
        title: r.title,
        path: r.path,
        summary: r.summary,
        // 해부 결과엔 decision(label + sub) 포함. rationale 은 반환하지 않음.
        ...(r.decision ? { decision: r.decision } : {}),
      })),
    }
  },

  list_showcases(args) {
    const tier =
      args?.tier === 'anatomy' || args?.tier === 'experiment' || args?.tier === 'built'
        ? args.tier
        : null // null = 세 틀 전체
    const results: Record<string, unknown>[] = []

    // 해부(velite, exhibit 내림차순 상위 5) — decision 라벨(+sub), question 앞부분. rationale 미반환.
    if (!tier || tier === 'anatomy') {
      const anat = [...allAnatomy]
        .sort((a, b) => b.exhibit - a.exhibit)
        .slice(0, 5)
        .map((a) => ({
          tier: 'anatomy',
          title: a.title,
          decision: a.decision.label + (a.decision.sub ? ` — ${a.decision.sub}` : ''),
          summary: a.question.length > 100 ? a.question.slice(0, 100) + '…' : a.question,
          path: `showcases/anatomy/${a.slug}`,
        }))
      results.push(...anat)
    }

    // 실험/실물(showcasesData)
    if (tier !== 'anatomy') {
      const sc = showcasesData
        .filter((s) => !tier || s.tier === tier)
        .map((s) => ({
          tier: s.tier,
          title: s.title,
          blurb: s.blurb,
          category: s.category,
          path: linkPath(s.tier === 'experiment' ? s.href : s.url),
        }))
      results.push(...sc)
    }

    return { results }
  },

  get_books() {
    return {
      results: booksData.map((b) => ({
        title: b.title,
        description: b.description,
        status: b.status,
        path: linkPath(b.href),
      })),
    }
  },
}
