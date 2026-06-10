'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from './Link'
import { logout } from '@/app/auth-actions'

// 전역 헤더 계정 영역(데스크톱) — 세션 인식.
//  - 로그아웃: "로그인" 진입(→ /login?callbackUrl=현재경로).
//  - 로그인: 아바타+이름, 드롭다운에 (관리자면) 대시보드·글 관리·에디터 + 로그아웃.
// 세션은 클라이언트(useSession)에서 읽어 정적 페이지를 보존(루트에 서버 auth() 미도입).

function Avatar({ image, name }: { image?: string | null; name?: string | null }) {
  if (image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={image} alt="" className="h-7 w-7 rounded-full object-cover" />
  }
  const initial = (name || 'U').trim().charAt(0).toUpperCase()
  return (
    <span
      aria-hidden
      className="flex h-7 w-7 items-center justify-center rounded-full bg-coral/15 text-[12px] font-bold text-coral-2"
    >
      {initial}
    </span>
  )
}

export default function UserMenu() {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // 바깥 클릭 / Esc 닫기
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  // 로딩 중엔 깜빡임 방지로 미표시
  if (status === 'loading') return null

  // 로그아웃 상태 → 로그인 진입(절제된 아이콘 + "로그인")
  if (status !== 'authenticated' || !session?.user) {
    const callbackUrl = pathname || '/'
    return (
      <Link
        href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
        aria-label="로그인"
        className="hidden items-center gap-1.5 rounded-full border border-line py-1.5 pl-2.5 pr-3 text-[13.5px] font-semibold text-ink-2 transition-colors hover:border-coral-soft hover:text-ink sm:flex"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
          <polyline points="10 17 15 12 10 7" />
          <line x1="15" y1="12" x2="3" y2="12" />
        </svg>
        로그인
      </Link>
    )
  }

  const name = session.user.name
  const isAdmin = session.user.isAdmin === true
  const itemCls =
    'block w-full rounded-lg px-2.5 py-2 text-left text-[13.5px] font-semibold text-ink-2 transition-colors hover:bg-ink/5 hover:text-coral-2'

  return (
    <div ref={ref} className="relative hidden sm:block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`${name || '사용자'} 계정 메뉴`}
        className="flex items-center gap-2 rounded-full border border-line py-0.5 pl-0.5 pr-2.5 transition-colors hover:border-coral-soft"
      >
        <Avatar image={session.user.image} name={name} />
        <span className="max-w-[120px] truncate text-[13.5px] font-semibold text-ink-2">
          {name || '사용자'}
        </span>
      </button>

      {open && (
        <div
          role="menu"
          aria-label="계정"
          className="absolute right-0 top-full z-50 mt-2 w-44 rounded-xl border border-line bg-surface-2 p-1.5 shadow-soft"
        >
          <p className="truncate px-2.5 py-1.5 text-[12px] text-ink-3" title={name ?? undefined}>
            {name || '사용자'} 님
          </p>

          {isAdmin && (
            <>
              <Link href="/admin" role="menuitem" className={itemCls} onClick={() => setOpen(false)}>
                대시보드
              </Link>
              <Link href="/admin/essays" role="menuitem" className={itemCls} onClick={() => setOpen(false)}>
                글 관리
              </Link>
              <Link href="/admin/editor" role="menuitem" className={itemCls} onClick={() => setOpen(false)}>
                에디터
              </Link>
              <div className="my-1 border-t border-line" />
            </>
          )}

          <form action={logout.bind(null, '/')}>
            <button type="submit" role="menuitem" className={itemCls}>
              로그아웃
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
