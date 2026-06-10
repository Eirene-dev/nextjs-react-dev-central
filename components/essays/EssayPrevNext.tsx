import Link from '@/components/Link'
import type { AdjacentEssay } from '@/lib/essay-drafts'

// 이전/다음 글 내비게이션 — 발행일 기준 인접 발행 글. 서버 렌더(링크만).
// 사이트 UI 폰트(Pretendard), reading 변수(--reading-*) 미사용. 한쪽 없으면 반대쪽만(space-between).
export default function EssayPrevNext({
  prev,
  next,
}: {
  prev: AdjacentEssay | null
  next: AdjacentEssay | null
}) {
  // 둘 다 없거나 slug 가 없으면 링크 불가 — 렌더 안 함
  const prevOk = prev && prev.slug
  const nextOk = next && next.slug
  if (!prevOk && !nextOk) return null

  return (
    <nav
      aria-label="이전·다음 글"
      className="mx-auto mt-12 flex max-w-[680px] flex-col gap-3 border-t border-line pt-6 font-sans sm:flex-row sm:items-stretch sm:justify-between"
    >
      {prevOk ? (
        <Link
          href={`/essays/${encodeURIComponent(prev!.slug!)}`}
          rel="prev"
          className="group min-w-0 flex-1 rounded-xl border border-line bg-surface-2 px-4 py-3 transition-colors hover:border-coral-soft sm:max-w-[48%]"
        >
          <span className="block text-[12px] font-semibold text-ink-3 transition-colors group-hover:text-coral-2">
            ← 이전 글
          </span>
          <span className="mt-1 block truncate font-semibold text-ink-2 transition-colors group-hover:text-ink">
            {prev!.title || '(제목 없음)'}
          </span>
        </Link>
      ) : (
        <span className="hidden flex-1 sm:block" aria-hidden />
      )}

      {nextOk ? (
        <Link
          href={`/essays/${encodeURIComponent(next!.slug!)}`}
          rel="next"
          className="group min-w-0 flex-1 rounded-xl border border-line bg-surface-2 px-4 py-3 text-right transition-colors hover:border-coral-soft sm:max-w-[48%]"
        >
          <span className="block text-[12px] font-semibold text-ink-3 transition-colors group-hover:text-coral-2">
            다음 글 →
          </span>
          <span className="mt-1 block truncate font-semibold text-ink-2 transition-colors group-hover:text-ink">
            {next!.title || '(제목 없음)'}
          </span>
        </Link>
      ) : (
        <span className="hidden flex-1 sm:block" aria-hidden />
      )}
    </nav>
  )
}
