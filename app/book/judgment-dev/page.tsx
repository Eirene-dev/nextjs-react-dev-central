import Link from '@/components/Link'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({
  title: 'AI 시대, 판단하는 개발자',
  description: '출간 예정 — 무엇을 왜 선택하는가, 판단과 취향의 기록.',
})

// 스텁 — Phase 4 에서 MDX + 커스텀 컴포넌트(소개·추천사·정오표·보너스)로 채운다.
export default function JudgmentDevPage() {
  return (
    <div className="mx-auto max-w-[720px] py-16 text-center">
      <Link href="/book" className="text-sm font-semibold text-coral-2 hover:text-coral">
        ← Book
      </Link>
      <span className="mt-6 inline-block rounded-full bg-ink/5 px-3 py-1 text-xs font-bold text-ink-2">
        출간 예정
      </span>
      <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-ink">
        AI 시대, 판단하는 개발자
      </h1>
      <p className="mx-auto mt-4 max-w-[34em] text-ink-2">
        AI가 코드를 쓰는 시대에 더 중요해진 것 — 무엇을 왜 선택하는가, 판단과 취향의 기록. 상세 페이지는 곧
        공개됩니다.
      </p>
    </div>
  )
}
