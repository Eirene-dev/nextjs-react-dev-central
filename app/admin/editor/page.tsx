import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { isAdmin } from '@/lib/auth-helpers'

// 에세이 에디터 v1 — 1단계: 비공개 라우트 + 관리자 게이트(에디터·저장은 다음 단계).
// 인증은 보드와 동일하게 기존 auth()/isAdmin 재사용.
export const metadata: Metadata = {
  title: '에세이 에디터',
  robots: { index: false, follow: false }, // 비공개 — noindex
}

// 세션 의존 → 매 요청 렌더
export const dynamic = 'force-dynamic'

export default async function EditorPage() {
  const session = await auth()

  // 비로그인 → GitHub 로그인(Auth.js 빌트인 signin, 콜백 /admin/editor)
  if (!session?.user) {
    redirect(`/api/auth/signin?callbackUrl=${encodeURIComponent('/admin/editor')}`)
  }
  // 로그인했지만 비관리자 → 홈으로
  if (!isAdmin(session)) {
    redirect('/')
  }

  return (
    <div className="mx-auto max-w-[760px] py-12">
      <h1 className="text-3xl font-extrabold tracking-tight text-ink">에세이 에디터</h1>
      <p className="mt-4 text-ink-2">준비 중 — 에디터·저장 기능은 다음 단계에서 붙습니다.</p>
    </div>
  )
}
