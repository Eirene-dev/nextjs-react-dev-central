import { allBlogs, allDocs, sortPosts, allCoreContent } from '@/lib/content'
import Link from '@/components/Link'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({
  title: 'Archive',
  description: '이전 튜토리얼·기술 블로그 콘텐츠 보존 아카이브.',
})

const ym = (d: string | number) => {
  const dt = new Date(d)
  return `${dt.getFullYear()}.${String(dt.getMonth() + 1).padStart(2, '0')}`
}

export default function ArchivePage() {
  const blogs = allCoreContent(sortPosts(allBlogs.filter((b) => b.draft !== true)))

  // Docs 카테고리(경로 2번째 세그먼트) + 대표 문서 1개로 진입 링크
  const docCats = new Map<string, string>()
  for (const d of sortPosts(allDocs)) {
    const cat = d.path.split('/')[1] // docs/<cat>/...
    if (cat && !docCats.has(cat)) docCats.set(cat, d.slug)
  }

  return (
    <div className="py-12">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-ink">Archive</h1>
        <p className="mt-3 text-ink-2">이전에 쓴 튜토리얼과 기술 블로그 글을 보존한 곳.</p>
      </header>

      {/* Archive 안내 배너 */}
      <div className="mx-auto mb-10 max-w-[820px] rounded-2xl border border-line bg-coral/5 px-6 py-4 text-center text-sm text-ink-2">
        여기 글들은 <strong className="font-semibold text-ink">아카이브</strong>입니다 — 기존 URL은 그대로
        유지됩니다. 새 글은 <Link href="/essays" className="font-semibold text-coral-2 hover:text-coral">Essays</Link>{' '}
        와 <Link href="/showcases" className="font-semibold text-coral-2 hover:text-coral">Showcases</Link>에서.
      </div>

      {/* 블로그 (주축) */}
      <section className="mx-auto max-w-[820px]">
        <h2 className="mb-4 text-xl font-extrabold tracking-tight text-ink">
          블로그 <span className="text-ink-3">({blogs.length})</span>
        </h2>
        <ul className="divide-y divide-line">
          {blogs.map((b) => (
            <li key={b.slug}>
              <Link
                href={`/blog/${b.slug}`}
                className="flex items-baseline justify-between gap-4 py-3 transition-colors hover:text-coral-2"
              >
                <span className="font-medium text-ink">{b.title}</span>
                <span className="shrink-0 font-mono text-xs text-ink-3">{ym(b.date)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* 문서 (별도 섹션) */}
      <section className="mx-auto mt-14 max-w-[820px]">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-xl font-extrabold tracking-tight text-ink">
            문서 <span className="text-ink-3">({allDocs.length})</span>
          </h2>
          <Link href="/docs/getting-started" className="text-sm font-semibold text-coral-2 hover:text-coral">
            문서 전체 보기 →
          </Link>
        </div>
        <div className="flex flex-wrap gap-2">
          {[...docCats.entries()].map(([cat, slug]) => (
            <Link
              key={cat}
              href={`/docs/${slug}`}
              className="rounded-full border border-line bg-surface-2 px-4 py-2 text-sm font-semibold text-ink-2 transition-colors hover:border-coral-soft hover:text-coral-2"
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
