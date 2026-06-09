import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: { id: string; provider?: string } & DefaultSession['user']
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    uid?: string
    githubId?: string
    avatar?: string
    provider?: string
  }
}
