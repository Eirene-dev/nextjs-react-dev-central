import Link from '@/components/Link'

// 개별 /blog·/docs 글 상단의 "아카이브" 안내 배너.
// 토큰 무관한 amber 노티스(legacy-theme 스코프 안에서도 동일하게 보임).
export default function ArchiveBanner() {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-800/60 dark:bg-amber-950/40 dark:text-amber-200">
      <span>
        📦 이 글은 <strong>아카이브</strong>입니다 — 이전 튜토리얼·기술 블로그 콘텐츠예요.
      </span>
      <Link href="/archive" className="font-semibold underline underline-offset-2">
        Archive 전체 보기 →
      </Link>
    </div>
  )
}
