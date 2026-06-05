import { allEssays, sortPosts, allCoreContent } from '@/lib/content'
import Link from '@/components/Link'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({
  title: 'Essays',
  description: 'AI가 아닌, 제 생각으로 쓴 글.',
})

const ym = (d: string | number) => {
  const dt = new Date(d)
  return `${dt.getFullYear()}.${String(dt.getMonth() + 1).padStart(2, '0')}`
}

export default function EssaysPage() {
  const essays = allCoreContent(sortPosts(allEssays.filter((e) => e.draft !== true)))
  return (
    <div className="py-12">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-ink">Essays</h1>
        <p className="mt-3 text-ink-2">AI가 아닌, 제 생각으로 쓴 글.</p>
      </header>
      <div className="mx-auto flex max-w-[760px] flex-col gap-3.5">
        {essays.length === 0 && (
          <div className="rounded-2xl border border-dashed border-line bg-surface-2 py-20 text-center">
            <p className="text-ink-2">첫 에세이를 준비 중입니다.</p>
            <p className="mt-2 text-sm text-ink-3">곧 첫 글을 올립니다 — AI가 아닌, 제 생각으로.</p>
          </div>
        )}
        {essays.map((e) => (
          <Link
            key={e.slug}
            href={`/essays/${e.slug}`}
            className="flex items-center justify-between gap-5 rounded-2xl border border-line bg-surface-2 px-6 py-5 transition hover:-translate-y-0.5 hover:border-coral-soft hover:shadow-soft"
          >
            <h2 className="text-[17.5px] font-bold tracking-tight text-ink">{e.title}</h2>
            <span className="shrink-0 font-mono text-xs text-ink-3">{ym(e.date)}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
