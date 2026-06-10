import 'css/anatomy.css'
import ShowcaseGallery from '@/components/showcases/ShowcaseGallery'
import { allAnatomy } from '@/lib/content'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({
  title: 'Showcases',
  description: '실물 · 해부 · 실험 — 세 가지 틀로 둘러보는 작업과 결정의 기록.',
})

export default function ShowcasesPage() {
  // 해부 tier 카드는 anatomy 컬렉션에서 자동 생성(exhibit 오름차순) — 빌드 타임 데이터, SSG 유지.
  const anatomy = [...allAnatomy]
    .sort((a, b) => a.exhibit - b.exhibit)
    .map((a) => ({
      slug: a.slug,
      exhibit: a.exhibit,
      category: a.category,
      title: a.title,
      question: a.question,
    }))

  return (
    <>
      <ShowcaseGallery anatomy={anatomy} />
      {/* 해부 카드 제목 세리프(고운바탕) — 진입 시 로드, display=swap */}
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Gowun+Batang:wght@400;700&display=swap"
      />
    </>
  )
}
