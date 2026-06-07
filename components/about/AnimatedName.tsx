'use client'

import { useEffect, useRef } from 'react'

// 이름 타이포 deco — 글자별 굵기(wght)만 사인파로 은은히 물결. 색·위치 변화 없음.
// 폰트는 셀프호스트 Pretendard Variable(css/about-name.css, /public/fonts) — CDN/CSP 비의존.
// 가변 폰트 미로드·reduced-motion 이면 정적 extrabold(800) 폴백.
// wght 범위 400–800: 최대가 기존 제목 굵기(extrabold)와 일치해 절제되게.
const BASE = 600
const AMP = 200
const STEP = 0.5 // 글자당 위상차(rad)
const PERIOD = 5000 // ms — 느린 물결

export default function AnimatedName({ name, className }: { name: string; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const m = window.matchMedia('(prefers-reduced-motion: reduce)')
    const spans = Array.from(el.querySelectorAll<HTMLElement>('span[data-ch]'))
    let raf = 0
    let cancelled = false

    const tick = (t: number) => {
      for (let i = 0; i < spans.length; i++) {
        const w = BASE + AMP * Math.sin((t / PERIOD) * Math.PI * 2 + i * STEP)
        spans[i].style.fontVariationSettings = `'wght' ${Math.round(w)}`
      }
      raf = requestAnimationFrame(tick)
    }
    const stop = () => {
      cancelAnimationFrame(raf)
      // 정적 폴백(클래스의 extrabold 800)으로 복귀
      spans.forEach((s) => s.style.removeProperty('font-variation-settings'))
    }
    const start = () => {
      // 가변 wght 축이 실제 로드된 경우에만 구동 — 실패 시 정적 폴백 유지
      document.fonts
        .load("800 1em 'Pretendard Variable'")
        .then((loaded) => {
          if (cancelled || m.matches || loaded.length === 0) return
          cancelAnimationFrame(raf)
          raf = requestAnimationFrame(tick)
        })
        .catch(() => {})
    }
    const onMotionChange = () => (m.matches ? stop() : start())

    m.addEventListener('change', onMotionChange)
    if (!m.matches) start()
    // 시작 후엔 끊김 없이 계속 구동 — rAF 는 탭 비활성 시 브라우저가 자동 정지/재개.
    // (IntersectionObserver 미사용: 폰트 스왑 등 레이아웃 변동 시 재발화로 한 프레임에 동결되는 원인 제거)
    return () => {
      cancelled = true
      m.removeEventListener('change', onMotionChange)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <h1
      ref={ref}
      aria-label={name}
      className={className}
      style={{
        fontFamily:
          "'Pretendard Variable', Pretendard, ui-sans-serif, system-ui, -apple-system, sans-serif",
      }}
    >
      {[...name].map((ch, i) => (
        <span key={i} data-ch aria-hidden="true">
          {ch === ' ' ? ' ' : ch}
        </span>
      ))}
    </h1>
  )
}
