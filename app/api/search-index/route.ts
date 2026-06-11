import { NextResponse } from 'next/server'
import { buildSearchRecords } from '@/lib/search-records'

export const runtime = 'nodejs'
// 런타임 인덱스 — 헤더 검색 대상(에세이=DB + 해부=velite). 아카이브(public/search.json)와 무관.
// 에세이가 DB라 발행 직후 반영되도록 no-store(댓글/조회수 API와 일관). public/search.json·골든 불변.
// 인덱스 생성 로직은 lib/search-records 로 추출(챗봇 search_content 와 공유).
export const dynamic = 'force-dynamic'

const NO_STORE = { 'cache-control': 'no-store, max-age=0' }

export async function GET() {
  try {
    const records = await buildSearchRecords()
    return NextResponse.json({ records }, { headers: NO_STORE })
  } catch {
    // DB 다운 등 — 헤더가 죽지 않게 빈 인덱스로 graceful
    return NextResponse.json({ records: [] }, { status: 200, headers: NO_STORE })
  }
}
