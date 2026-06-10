import 'css/anatomy.css'
import Link from '@/components/Link'
import { allAnatomy } from '@/lib/content'
import AnatomyCard from '@/components/anatomy/AnatomyCard'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({
  title: '해부 — Showcases',
  description: '이 사이트를 만들며 실제로 부딪힌 결정들의 기록 — 저자의 답을 보기 전에 당신이라면 어떻게 했을지 골라 보세요.',
})

// 전시 인덱스 — SSG. 전시 카드는 anatomy 컬렉션에서 자동 생성(exhibit 오름차순).
export default function AnatomyIndex() {
  const exhibits = [...allAnatomy].sort((a, b) => a.exhibit - b.exhibit)

  return (
    <div className="mx-auto max-w-[728px] px-5 py-12">
      <p className="anatomy-mono text-[11.5px] tracking-[0.04em] text-ink-3">
        Showcases <span className="mx-1.5 text-coral-2">/</span> 해부
      </p>
      <p className="anatomy-serif mb-11 mt-1.5 max-w-[560px] text-[15px] leading-[1.85] text-ink-2">
        이 사이트를 만들며 실제로 부딪힌 결정들을 전시합니다. 저자의 답을 보기 전에, 먼저 당신이라면
        어떻게 했을지 골라 보세요.
      </p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {exhibits.map((e) => (
          <AnatomyCard
            key={e.slug}
            slug={e.slug}
            exhibit={e.exhibit}
            category={e.category}
            title={e.title}
            question={e.question}
          />
        ))}
      </div>

      <Link
        href="/showcases"
        className="anatomy-mono mt-7 inline-block text-[12px] text-ink-3 hover:text-coral-2"
      >
        ← 쇼케이스 갤러리로
      </Link>

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
