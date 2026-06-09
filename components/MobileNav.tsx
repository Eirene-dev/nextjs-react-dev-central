'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useSession } from 'next-auth/react'
import Link from './Link'
import headerNavLinks from '@/data/headerNavLinks'
import { logout } from '@/app/auth-actions'

const MobileNav = () => {
  const { data: session, status } = useSession()
  const [navShow, setNavShow] = useState(false)
  // 포털 마운트 가드(SSR엔 오버레이 미출력 — 기본 닫힘이라 하이드레이션 안전)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const onToggleNav = () => {
    setNavShow((status) => {
      if (status) {
        document.body.style.overflow = 'auto'
      } else {
        // Prevent scrolling
        document.body.style.overflow = 'hidden'
      }
      return !status
    })
  }

  return (
    <>
      <button
        aria-label="Toggle Menu"
        onClick={onToggleNav}
        className="flex h-11 w-11 items-center justify-center rounded-lg text-ink hover:bg-ink/5 sm:hidden"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-8 w-8 text-ink"
        >
          <path
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {/* 오버레이는 body 포털로 렌더 — 헤더의 backdrop-filter 가 fixed 자손의 containing block 을
          헤더 박스로 만들어, 패널 배경이 헤더 70px 띠만 덮고 메뉴 글자가 배경 없이 페이지 위에
          겹쳐 보이던 원인 제거. 뷰포트 래퍼(overflow-hidden)가 오프캔버스 패널을 클리핑해
          닫힌 패널이 만들던 문서 가로 오버플로(우측 스와이프/팬으로 메뉴가 드러남)도 제거.
          열기는 햄버거 버튼 탭으로만. */}
      {mounted &&
        createPortal(
          <div
            className={`fixed inset-0 z-[60] overflow-hidden sm:hidden ${navShow ? '' : 'pointer-events-none'}`}
            aria-hidden={!navShow}
          >
            <div
              className={`absolute inset-0 transform bg-surface duration-300 ease-in-out ${
                navShow ? 'translate-x-0' : 'translate-x-full'
              }`}
            >
              <div className="flex justify-end">
                <button
                  className="mr-8 mt-11 h-8 w-8"
                  aria-label="Toggle Menu"
                  onClick={onToggleNav}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="text-ink"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              <nav className="fixed mt-8 h-full">
                {headerNavLinks.map((link) => (
                  <div key={link.title} className="px-12 py-4">
                    <Link
                      href={link.href}
                      className="text-2xl font-bold tracking-widest text-ink"
                      onClick={onToggleNav}
                    >
                      {link.title}
                    </Link>
                  </div>
                ))}

                {/* 로그인 상태에서만 계정 영역(로그아웃). 로그아웃 상태엔 아무것도 표시 안 함. */}
                {status === 'authenticated' && session?.user && (
                  <div className="mt-4 border-t border-line px-12 pt-6">
                    <div className="flex items-center gap-3">
                      {session.user.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={session.user.image}
                          alt=""
                          className="h-9 w-9 rounded-full object-cover"
                        />
                      ) : (
                        <span
                          aria-hidden
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-coral/15 text-sm font-bold text-coral-2"
                        >
                          {(session.user.name || 'U').trim().charAt(0).toUpperCase()}
                        </span>
                      )}
                      <span className="truncate text-base font-semibold text-ink-2">
                        {session.user.name || '사용자'} 님
                      </span>
                    </div>
                    <form action={logout.bind(null, '/')} className="mt-4">
                      <button
                        type="submit"
                        onClick={onToggleNav}
                        className="rounded-lg border border-line px-4 py-2 text-base font-semibold text-ink-2 transition-colors hover:border-coral-soft hover:text-coral-2"
                      >
                        로그아웃
                      </button>
                    </form>
                  </div>
                )}
              </nav>
            </div>
          </div>,
          document.body
        )}
    </>
  )
}

export default MobileNav
