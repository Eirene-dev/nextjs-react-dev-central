import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { isAdmin } from '@/lib/auth-helpers'
import EditorShell from '@/components/admin/editor/EditorShell'
import AdminUserMenu from '@/components/admin/AdminUserMenu'

// 에세이 에디터 v1 — 1단계: 비공개 라우트 + 관리자 게이트(에디터·저장은 다음 단계).
// 인증은 보드와 동일하게 기존 auth()/isAdmin 재사용.
export const metadata: Metadata = {
  title: '에세이 에디터',
  robots: { index: false, follow: false }, // 비공개 — noindex
}

// 세션 의존 → 매 요청 렌더
export const dynamic = 'force-dynamic'

export default async function EditorPage(props: {
  searchParams: Promise<{ id?: string }>
}) {
  const session = await auth()

  // 비로그인 → GitHub 로그인(Auth.js 빌트인 signin, 콜백 /admin/editor)
  if (!session?.user) {
    redirect(`/login?callbackUrl=${encodeURIComponent('/admin/editor')}`)
  }
  // 로그인했지만 비관리자 → 홈으로
  if (!isAdmin(session)) {
    redirect('/')
  }

  // 관리 목록 "편집"에서 ?id=N 으로 특정 글 열기. 숫자 아니면 무시(기존 동작=마지막 글 복원).
  const { id } = await props.searchParams
  const n = Number(id)
  const initialId = Number.isInteger(n) && n > 0 ? n : undefined

  return (
    // 뷰포트 높이(헤더 70px 제외) 안에 에디터를 가둠 — 페이지가 아니라 본문 영역이 내부 스크롤.
    <div className="mx-auto flex h-[calc(100dvh-70px)] max-w-[1280px] flex-col px-5 py-4 sm:px-7 sm:py-6">
      <div className="mb-4 flex shrink-0 items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">에세이 에디터</h1>
        <AdminUserMenu name={session.user.name} image={session.user.image} />
      </div>
      <EditorShell initialId={initialId} />
    </div>
  )
}
