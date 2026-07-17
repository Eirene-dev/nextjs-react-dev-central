import { listPublishedEssaysSafe } from '@/lib/essay-drafts'
import { allAnatomy } from '@/lib/content'

// 사이트 검색/안내 인덱스 — 발행 에세이(DB) + 해부(velite). 헤더 검색(/api/search-index)과
// 챗봇 search_content(lib/ai/chat-tools)가 공유한다. 외부 fetch 없이 서버 소스에서 합성.
export type SearchRecord = {
  type: 'essay' | 'anatomy'
  title: string
  path: string // 라우팅: '/' + path
  date: string
  summary: string
  decision?: string // 해부 전용: decision.label (+ sub). 에세이는 없음. rationale 은 미포함.
}

export async function buildSearchRecords(): Promise<SearchRecord[]> {
  // 발행 에세이(DB) — slug 있는 것만, path=essays/{slug}
  // DB 장애 시 검색 전체를 죽이지 않고 해부(velite)만으로 축소 동작한다.
  const essays = (await listPublishedEssaysSafe()) ?? []
  const essayRecs: SearchRecord[] = essays
    .filter((e) => !!e.slug)
    .map((e) => ({
      type: 'essay',
      title: e.title || '(제목 없음)',
      path: `essays/${e.slug}`,
      date: e.publishedAt ? new Date(e.publishedAt).toISOString() : '',
      summary: e.excerpt || '',
    }))

  // 해부(velite) — exhibit 내림차순, path=showcases/anatomy/{slug}
  const anatomyRecs: SearchRecord[] = [...allAnatomy]
    .sort((a, b) => b.exhibit - a.exhibit)
    .map((a) => ({
      type: 'anatomy',
      title: a.title,
      path: `showcases/anatomy/${a.slug}`,
      date: '',
      summary: a.question,
      decision: a.decision.label + (a.decision.sub ? ` — ${a.decision.sub}` : ''),
    }))

  return [...essayRecs, ...anatomyRecs]
}
