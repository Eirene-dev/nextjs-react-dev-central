import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from '@/components/Link'
import { auth } from '@/auth'
import { isAdmin } from '@/lib/auth-helpers'
import { allAnatomy } from '@/lib/content'
import AdminUserMenu from '@/components/admin/AdminUserMenu'
import AnatomyComposer from '@/components/admin/anatomy/AnatomyComposer'

// 해부 컴포저 — 비공개 라우트 + 관리자 게이트(/admin/essays 와 동일 패턴). noindex.
// 폼 → 완성 MDX/JSON 변환 도구일 뿐(저장은 git). DB·마이그레이션 없음.
export const metadata: Metadata = {
  title: '해부 컴포저',
  robots: { index: false, follow: false }, // 비공개 — noindex
}

export const dynamic = 'force-dynamic'

export default async function AdminAnatomyPage() {
  const session = await auth()
  if (!session?.user) {
    redirect(`/login?callbackUrl=${encodeURIComponent('/admin/anatomy')}`)
  }
  if (!isAdmin(session)) {
    redirect('/')
  }

  // allAnatomy 에서 폼 기본값 도출(빌드 타임 데이터).
  const nextExhibit = allAnatomy.reduce((m, a) => Math.max(m, a.exhibit), 0) + 1
  const existingSlugs = allAnatomy.map((a) => a.slug)
  const categories = [...new Set(allAnatomy.map((a) => a.category))]

  return (
    <div className="mx-auto max-w-[1100px] px-5 py-8 sm:py-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink">해부 컴포저</h1>
          <p className="mt-1 text-sm text-ink-3">
            폼을 완성된 MDX 로 변환합니다 — 저장은 git(data/anatomy). DB 없음.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <AdminUserMenu name={session.user.name} image={session.user.image} />
          <Link
            href="/showcases/anatomy"
            target="_blank"
            className="rounded-lg border border-line bg-surface px-3.5 py-2 text-sm font-bold text-ink-2 transition-colors hover:border-coral-soft hover:text-ink"
          >
            전시 보기 ↗
          </Link>
        </div>
      </div>

      <AnatomyComposer
        nextExhibit={nextExhibit}
        existingSlugs={existingSlugs}
        categories={categories}
      />
    </div>
  )
}
