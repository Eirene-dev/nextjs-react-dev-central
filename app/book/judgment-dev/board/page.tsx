import { auth, signIn, signOut } from '@/auth'
import { isAdmin } from '@/lib/auth-helpers'
import { listPosts } from '@/lib/board'
import Board from '@/components/board/Board'
import Link from '@/components/Link'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({
  title: '판단하는 개발자 — 문의·토론·오타 제보',
  description: '책에 대한 문의·토론·오타 제보 게시판.',
})

// 세션·DB 의존 → 매 요청 렌더
export const dynamic = 'force-dynamic'

const PAGE_KEY = 'book:judgment-dev'

export default async function BoardPage() {
  const session = await auth()
  const initial = await listPosts(PAGE_KEY, {})

  async function loginAction() {
    'use server'
    await signIn('github')
  }
  async function logoutAction() {
    'use server'
    await signOut()
  }

  const clientSession = session?.user?.id
    ? { user: { id: session.user.id, name: session.user.name, image: session.user.image } }
    : null

  return (
    <div className="mx-auto max-w-[760px] py-12">
      <Link href="/book/judgment-dev" className="text-sm font-semibold text-coral-2 hover:text-coral">
        ← 책으로
      </Link>
      <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-ink">문의 · 토론 · 오타 제보</h1>
      <p className="mb-8 mt-3 text-ink-2">
        『AI 시대, 판단하는 개발자』에 대한 질문과 토론, 오타 제보를 남겨주세요.
      </p>
      <Board
        initial={initial}
        session={clientSession}
        isAdmin={isAdmin(session)}
        loginAction={loginAction}
        logoutAction={logoutAction}
      />
    </div>
  )
}
