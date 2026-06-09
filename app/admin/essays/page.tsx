import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from '@/components/Link'
import { auth } from '@/auth'
import { isAdmin } from '@/lib/auth-helpers'
import { listDrafts } from '@/lib/essay-drafts'
import EssaysManager from '@/components/admin/essays/EssaysManager'
import AdminUserMenu from '@/components/admin/AdminUserMenu'

// 글 관리 — 비공개 라우트 + 관리자 게이트(/admin/editor 와 동일 패턴). noindex.
// 사이트맵·골든 비대상(admin 라우트는 sitemap routes 목록·content 컬렉션에 없음).
export const metadata: Metadata = {
  title: '글 관리',
  robots: { index: false, follow: false }, // 비공개 — noindex
}

// 세션 의존 → 매 요청 렌더
export const dynamic = 'force-dynamic'

export default async function AdminEssaysPage() {
  const session = await auth()
  if (!session?.user) {
    redirect(`/login?callbackUrl=${encodeURIComponent('/admin/essays')}`)
  }
  if (!isAdmin(session)) {
    redirect('/')
  }

  // author-scoped 전체 글(초안+발행), 수정일 내림차순. 직렬화 위해 날짜→ISO.
  const rows = await listDrafts(session.user.id!)
  const essays = rows.map((r) => ({
    id: r.id,
    title: r.title,
    status: r.status,
    slug: r.slug,
    updatedAt: r.updatedAt ? new Date(r.updatedAt).toISOString() : null,
    publishedAt: r.publishedAt ? new Date(r.publishedAt).toISOString() : null,
  }))

  return (
    <div className="mx-auto max-w-[1000px] px-5 py-8 sm:py-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">글 관리</h1>
        <div className="flex items-center gap-3">
          <AdminUserMenu name={session.user.name} image={session.user.image} />
          <Link
            href="/admin/editor"
            className="rounded-lg bg-coral px-3.5 py-2 text-sm font-bold text-white transition-colors hover:bg-coral-2"
          >
            + 새 글
          </Link>
        </div>
      </div>
      <EssaysManager initial={essays} />
    </div>
  )
}
