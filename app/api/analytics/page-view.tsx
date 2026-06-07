'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// 페이지뷰 트래커 — pathname 변경마다 1회, 같은 오리진의 /api/analytics 프록시로 전송.
// (Umami v2 가 기대하는 hostname/url/referrer/title/language/screen 을 보낸다.)
let lastPath = '' // 하이드레이션 중 effect 중복 실행 대비 — 같은 pathname 은 1회만

export function PageView() {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname === lastPath) return
    lastPath = pathname
    const body = JSON.stringify({
      hostname: window.location.hostname,
      url: pathname,
      referrer: document.referrer,
      title: document.title,
      language: navigator.language,
      screen: `${window.screen.width}x${window.screen.height}`,
    })

    // navigator.sendBeacon() 사용 가능한 경우 사용, 그렇지 않으면 fetch() 사용
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics', body)
    } else {
      fetch('/api/analytics', { body, method: 'POST', keepalive: true }).catch(() => {})
    }
  }, [pathname])

  return null
}
