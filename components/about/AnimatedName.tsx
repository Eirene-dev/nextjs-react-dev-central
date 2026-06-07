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

    const tick = (t: number) => {
      for (let i = 0; i < spans.length; i++) {
        const w = BASE + AMP * Math.sin((t / PERIOD) * Math.PI * 2 + i * STEP)
        spans[i].style.fontVariationSettings = `'wght' ${Math.round(w)}`
      }
      raf = requestAnimationFrame(tick)
    }
    const stop = () => {
      cancelAnimationFrame(raf)
      raf = 0
      spans.forEach((s) => s.style.removeProperty('font-variation-settings'))
    }
    const start = () => {
      if (m.matches || raf) return
      raf = requestAnimationFrame(tick)
    }
    const onMotionChange = () => (m.matches ? stop() : start())

    m.addEventListener('change', onMotionChange)
    // 폰트 로드 게이트 제거: rAF 즉시 시작. 가변 폰트 스왑 전에는 font-variation-settings가
    // 폴백 폰트에 무효과(깜빡임 없음), woff2 스왑되면 파동이 자연히 적용. reduced-motion은 start()에서 존중.
    start()
    return () => {
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
