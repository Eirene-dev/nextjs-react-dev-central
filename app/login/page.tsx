import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { loginWith } from '@/app/auth-actions'

// 브랜드 로그인 페이지 — 누구나 GitHub/Google 로그인(공개). noindex + sitemap/golden 제외.
// auth.ts 의 pages.signIn 이 이 경로를 가리킴. 로그인 후 callbackUrl 로 복귀.
export const metadata: Metadata = {
  title: '로그인',
  robots: { index: false, follow: false }, // noindex
}

// 세션 의존 → 매 요청 렌더
export const dynamic = 'force-dynamic'

// 오픈 리다이렉트 방지 — 같은 사이트 상대경로만.
function safePath(u: string | undefined): string {
  return u && u.startsWith('/') && !u.startsWith('//') ? u : '/'
}

export default async function LoginPage(props: {
  searchParams: Promise<{ callbackUrl?: string }>
}) {
  const { callbackUrl } = await props.searchParams
  const target = safePath(callbackUrl)

  // 이미 로그인 → 원래 위치로
  const session = await auth()
  if (session?.user) redirect(target)

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-70px)] max-w-[420px] flex-col justify-center px-5 py-12">
      <div className="rounded-2xl border border-line bg-surface-2 p-7 shadow-soft">
        <div className="mb-1 flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-coral" aria-hidden />
          <span className="text-[13px] font-bold uppercase tracking-wide text-ink-3">
            ReactNext Central
          </span>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">로그인</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-2">
          댓글 작성 등 일부 기능에 로그인이 필요합니다. 계정 제공자를 선택하세요.
        </p>

        <div className="mt-6 space-y-2.5">
          {/* GitHub */}
          <form action={loginWith.bind(null, 'github', target)}>
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2.5 rounded-lg bg-ink px-4 py-2.5 text-sm font-bold text-surface-2 transition-colors hover:bg-coral-2"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.5 2.87 8.32 6.84 9.67.5.1.68-.22.68-.49l-.01-1.7c-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.63.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05a9.4 9.4 0 015 0c1.91-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9l-.01 2.82c0 .27.18.6.69.49A10.02 10.02 0 0022 12.26C22 6.58 17.52 2 12 2z" />
              </svg>
              GitHub로 계속하기
            </button>
          </form>

          {/* Google */}
          <form action={loginWith.bind(null, 'google', target)}>
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-line bg-surface px-4 py-2.5 text-sm font-bold text-ink transition-colors hover:border-coral-soft"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.24 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0012 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.11a6.6 6.6 0 010-4.22V7.05H2.18a11 11 0 000 9.9l3.66-2.84z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
                />
              </svg>
              Google로 계속하기
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
