'use client'

import { SessionProvider } from 'next-auth/react'

// 전역 세션 컨텍스트(클라이언트) — 헤더 계정 메뉴 등에서 useSession 사용.
// 서버 auth() 를 루트 레이아웃에서 호출하면 모든 페이지가 동적 렌더로 전환되어 정적(SSG) 콘텐츠가
// 회귀하므로, 헤더 세션은 클라이언트(/api/auth/session)에서 읽어 정적 페이지를 보존한다.
export default function SessionProviders({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}
