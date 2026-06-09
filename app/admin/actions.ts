'use server'

import { signOut } from '@/auth'

// 관리자 로그아웃 — Auth.js v5 서버 액션. 세션 종료 후 홈으로 이동.
export async function adminLogout() {
  await signOut({ redirectTo: '/' })
}
