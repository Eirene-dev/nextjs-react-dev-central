'use client'

import { useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { logout } from '@/app/auth-actions'

// 전역 헤더 계정 메뉴(데스크톱) — 로그인 시 아바타+이름, 클릭 시 드롭다운에 로그아웃.
// 로그아웃 상태에선 아무것도 렌더하지 않음(전역 로그인 CTA 없음 — 로그인은 contextual).
// 세션은 클라이언트(useSession)에서 읽어 정적 페이지를 보존.

// 아바타 — 이미지 없으면 이름 이니셜로 fallback.
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

  if (status !== 'authenticated' || !session?.user) return null
  const name = session.user.name

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
          <form action={logout.bind(null, '/')}>
            <button
              type="submit"
              role="menuitem"
              className="w-full rounded-lg px-2.5 py-2 text-left text-[13.5px] font-semibold text-ink-2 transition-colors hover:bg-ink/5 hover:text-coral-2"
            >
              로그아웃
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
