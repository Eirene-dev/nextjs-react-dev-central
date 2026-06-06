import type { Session } from 'next-auth'

export { auth, signIn, signOut } from '@/auth'

// 관리자 식별 — 내 GitHub 숫자 id 를 ADMIN_GITHUB_ID env 로(값은 Vercel Prod·Preview 에 직접 설정).
// env 미설정 시 누구도 관리자 아님(false).
export function isAdmin(session: Session | null): boolean {
  const adminId = process.env.ADMIN_GITHUB_ID
  return !!adminId && session?.user?.id === adminId
}
