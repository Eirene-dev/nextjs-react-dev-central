import Link from '@/components/Link'
import { listPublishedEssays } from '@/lib/essay-drafts'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({
  title: '에세이',
  description: 'AI가 아닌, 제 생각으로 쓴 글 — 판단·취향·실패의 기록.',
})

// DB(발행 글) 의존 → 매 요청 렌더. 공개·색인 대상(noindex 아님).
// Neon 은 listPublishedEssays 의 데이터 캐시가 지킨다 — 렌더는 해도 DB 왕복은 0.
export const dynamic = 'force-dynamic'

const fmtDate = (d: Date | string) => {
  const dt = new Date(d)
  return `${dt.getFullYear()}년 ${dt.getMonth() + 1}월 ${dt.getDate()}일`
}

export default async function EssaysPage() {
  const essays = await listPublishedEssays()

  return (
    <div className="py-12">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-ink">에세이</h1>
        <p className="mt-3 text-ink-2">AI가 아닌, 제 생각으로 쓴 글.</p>
      </header>

      <div className="mx-auto flex min-w-0 max-w-[760px] flex-col gap-3.5">
        {essays.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line bg-surface-2 py-20 text-center">
            <p className="text-ink-2">아직 발행된 글이 없습니다.</p>
            <p className="mt-2 text-sm text-ink-3">곧 첫 글을 올립니다 — AI가 아닌, 제 생각으로.</p>
          </div>
        ) : (
          essays.map((e) => (
            <Link
              key={e.id}
              href={`/essays/${e.slug}`}
              className="block min-w-0 rounded-2xl border border-line bg-surface-2 px-6 py-5 transition hover:-translate-y-0.5 hover:border-coral-soft hover:shadow-soft"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="min-w-0 break-words text-[17.5px] font-bold tracking-tight text-ink">
                  {e.title || '(제목 없음)'}
                </h2>
                {e.publishedAt && (
                  <time className="shrink-0 text-xs text-ink-3">{fmtDate(e.publishedAt)}</time>
                )}
              </div>
              {e.excerpt && (
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-2">{e.excerpt}</p>
              )}
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
