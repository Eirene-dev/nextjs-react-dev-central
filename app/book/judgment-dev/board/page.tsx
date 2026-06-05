import Link from '@/components/Link'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({
  title: '판단하는 개발자 — 문의·토론·오타 제보',
  description: '책에 대한 문의·토론·오타 제보 게시판. 곧 공개됩니다.',
})

// 최소 stub — 실 DB 게시판은 Phase 5. 지금은 링크가 죽지 않게.
export default function BoardPage() {
  return (
    <div className="mx-auto max-w-[640px] py-20 text-center">
      <Link
        href="/book/judgment-dev"
        className="text-sm font-semibold text-coral-2 hover:text-coral"
      >
        ← 책으로
      </Link>
      <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-ink">
        문의 · 토론 · 오타 제보
      </h1>
      <p className="mx-auto mt-4 max-w-[30em] text-ink-2">
        『AI 시대, 판단하는 개발자』에 대한 질문과 토론, 오타 제보를 받는 공간입니다.{' '}
        <span className="text-ink">곧 공개됩니다.</span>
      </p>
    </div>
  )
}
