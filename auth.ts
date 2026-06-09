import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'

// Auth.js v5 — GitHub + Google provider, JWT 세션(DB 어댑터 없음).
// AUTH_GITHUB_ID/SECRET, AUTH_GOOGLE_ID/SECRET, AUTH_SECRET 은 Auth.js 가 env 에서 자동 인식(코드에 키 없음).
// 관리자는 GitHub 로 로그인 → session.user.id 가 GitHub 숫자 id 로 유지되어 isAdmin 비교가 그대로 동작.
// Google 사용자는 id = sub(관리자 아님, 정상). 신원은 댓글 작성자 식별·본인삭제 비교에 사용(다음 단계).
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub, Google],
  session: { strategy: 'jwt' },
  trustHost: true,
  pages: { signIn: '/login' }, // 브랜드 로그인 페이지
  callbacks: {
    async jwt({ token, account, profile }) {
      // 최초 로그인 시에만 account/profile 존재 — 신원 스냅샷을 토큰에 보관.
      if (account && profile) {
        const t = token as Record<string, unknown>
        t.provider = account.provider
        if (account.provider === 'github') {
          const p = profile as { id?: number | string; avatar_url?: string }
          if (p.id != null) {
            t.uid = String(p.id)
            t.githubId = String(p.id) // 하위호환(관리자 비교용)
          }
          if (p.avatar_url) t.avatar = p.avatar_url
        } else if (account.provider === 'google') {
          const p = profile as { sub?: string; picture?: string }
          if (p.sub) t.uid = String(p.sub)
          if (p.picture) t.avatar = p.picture
        }
      }
      return token
    },
    async session({ session, token }) {
      const t = token as { uid?: string; githubId?: string; avatar?: string; provider?: string }
      if (session.user) {
        const id = t.uid ?? t.githubId // 기존 토큰(githubId 만 있는) 하위호환
        if (id) session.user.id = id
        if (t.avatar) session.user.image = t.avatar
        if (t.provider) session.user.provider = t.provider
        // 관리자 파생값 — lib/auth-helpers.isAdmin 과 동일 기준(매 세션 조회 시 파생, 재로그인 불필요).
        const adminId = process.env.ADMIN_GITHUB_ID
        session.user.isAdmin = !!adminId && session.user.id === adminId
      }
      return session
    },
  },
})
