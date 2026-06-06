import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'

// Auth.js v5 — GitHub provider만, JWT 세션(DB 어댑터 없음).
// AUTH_GITHUB_ID/AUTH_GITHUB_SECRET/AUTH_SECRET 는 Auth.js 가 env 에서 자동 인식.
// 글 작성 시 세션의 GitHub id·name·avatar 만 스냅샷으로 저장한다.
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  session: { strategy: 'jwt' },
  trustHost: true,
  callbacks: {
    async jwt({ token, profile }) {
      if (profile) {
        const p = profile as { id?: number | string; avatar_url?: string }
        const t = token as Record<string, unknown>
        if (p.id != null) t.githubId = String(p.id)
        if (p.avatar_url) t.avatar = p.avatar_url
      }
      return token
    },
    async session({ session, token }) {
      const t = token as { githubId?: string; avatar?: string }
      if (session.user && t.githubId) {
        session.user.id = t.githubId
        if (t.avatar) session.user.image = t.avatar
      }
      return session
    },
  },
})
