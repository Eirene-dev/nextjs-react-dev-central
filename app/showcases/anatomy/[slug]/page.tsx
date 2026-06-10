import 'css/anatomy.css'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from '@/components/Link'
import { allAnatomy } from '@/lib/content'
import { MDXLayoutRenderer } from '@/components/MDXContent'
import AnatomyExhibit from '@/components/anatomy/AnatomyExhibit'
import AnatomyCard from '@/components/anatomy/AnatomyCard'
import { genPageMetadata } from 'app/seo'

// 전시 상세 — SSG(generateStaticParams). 투표 집계만 런타임 GET(댓글 패턴).
export const generateStaticParams = () => allAnatomy.map((a) => ({ slug: a.slug }))

function decodeSlug(s: string): string {
  try {
    return decodeURIComponent(s)
  } catch {
    return s
  }
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await props.params
  const ex = allAnatomy.find((a) => a.slug === decodeSlug(slug))
  if (!ex) return {}
  return genPageMetadata({ title: `${ex.title} — 해부`, description: ex.question })
}

export default async function AnatomyExhibitPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params
  const ex = allAnatomy.find((a) => a.slug === decodeSlug(slug))
  if (!ex) notFound()

  const readingMinutes = Math.max(1, Math.round(ex.readingTime?.minutes ?? 1))

  // 다른 전시 2편(exhibit 오름차순 순환 — 모든 전시가 2장을 보여줌)
  const sorted = [...allAnatomy].sort((a, b) => a.exhibit - b.exhibit)
  const i = sorted.findIndex((a) => a.slug === ex.slug)
  const others = [sorted[(i + 1) % sorted.length], sorted[(i + 2) % sorted.length]].filter(
    (o) => o.slug !== ex.slug
  )

  return (
    <div className="mx-auto max-w-[728px] px-5 py-12">
      <p className="anatomy-mono mb-7 text-[11.5px] tracking-[0.04em] text-ink-3">
        <Link href="/showcases/anatomy" className="hover:text-coral-2">
          Showcases <span className="mx-1.5 text-coral-2">/</span> 해부
        </Link>
      </p>

      <AnatomyExhibit
        slug={ex.slug}
        exhibit={ex.exhibit}
        category={ex.category}
        title={ex.title}
        readingMinutes={readingMinutes}
        question={ex.question}
        options={ex.options}
        decision={ex.decision}
        result={ex.result}
        aiLedger={ex.aiLedger}
      >
        <MDXLayoutRenderer code={ex.body.code} />
      </AnatomyExhibit>

      {/* 다른 전시 + 갤러리로 */}
      <section className="mt-14 border-t border-line pt-7">
        <h4 className="anatomy-mono mb-3.5 text-[12px] font-medium tracking-[0.12em] text-ink-3">
          다른 전시
        </h4>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {others.map((o) => (
            <AnatomyCard
              key={o.slug}
              slug={o.slug}
              exhibit={o.exhibit}
              category={o.category}
              title={o.title}
              question={o.question}
            />
          ))}
        </div>
        <Link
          href="/showcases"
          className="anatomy-mono mt-7 inline-block text-[12px] text-ink-3 hover:text-coral-2"
        >
          ← 쇼케이스 갤러리로
        </Link>
      </section>

      {/* 본문 세리프: 고운바탕(진입 시 로드, display=swap) */}
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Gowun+Batang:wght@400;700&display=swap"
      />
    </div>
  )
}
