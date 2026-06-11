import { NextResponse } from 'next/server'
import { listPublishedEssays } from '@/lib/essay-drafts'
import { allAnatomy } from '@/lib/content'

export const runtime = 'nodejs'
// 런타임 인덱스 — 헤더 검색 대상(에세이=DB + 해부=velite). 아카이브(public/search.json)와 무관.
// 에세이가 DB라 발행 직후 반영되도록 no-store(댓글/조회수 API와 일관). public/search.json·골든 불변.
export const dynamic = 'force-dynamic'

type SearchRecord = {
  type: 'essay' | 'anatomy'
  title: string
  path: string // 라우팅: router.push('/' + path)
  date: string
  summary: string
}

const NO_STORE = { 'cache-control': 'no-store, max-age=0' }

export async function GET() {
  try {
    // 발행 에세이(DB) — slug 있는 것만, path=essays/{slug}
    const essays = await listPublishedEssays()
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
      }))

    return NextResponse.json({ records: [...essayRecs, ...anatomyRecs] }, { headers: NO_STORE })
  } catch {
    // DB 다운 등 — 헤더가 죽지 않게 빈 인덱스로 graceful
    return NextResponse.json({ records: [] }, { status: 200, headers: NO_STORE })
  }
}
