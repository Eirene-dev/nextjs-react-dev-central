'use server'

import { signIn, signOut } from '@/auth'

// 공개 로그인/로그아웃 서버 액션(누구나 사용). 관리자 전용 아님.
// 독자용 로그인/로그아웃 버튼 UI 는 다음 단계(댓글)에서 이 액션들을 사용한다.

// 오픈 리다이렉트 방지 — 같은 사이트 상대경로만 허용('/'로 시작, '//' 제외).
function safePath(u: unknown): string {
  return typeof u === 'string' && u.startsWith('/') && !u.startsWith('//') ? u : '/'
}

export async function loginWith(provider: 'github' | 'google', callbackUrl: string) {
  await signIn(provider, { redirectTo: safePath(callbackUrl) })
}

export async function logout(redirectTo = '/') {
  await signOut({ redirectTo: safePath(redirectTo) })
}
