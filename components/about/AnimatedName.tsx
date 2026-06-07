'use client'

import { useEffect, useRef, useState } from 'react'

// 이름 타이포 deco — 글자별 굵기(wght)만 사인파로 은은히 물결.
// 색·위치 변화 없음. reduced-motion 이면 정적(기존 extrabold 그대로).
// wght 범위 400–800: 최대가 기존 제목 굵기(extrabold)와 일치해 절제되게.
const BASE = 600
const AMP = 200
const STEP = 0.5 // 글자당 위상차(rad)
const PERIOD = 5000 // ms — 느린 물결

// 가변 굵기 축은 Pretendard Variable 에만 있음(전역은 static Pretendard) — 이 페이지에서만 로드.
const VARIABLE_FONT_CSS =
  'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css'

export default function AnimatedName({ name, className }: { name: string; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null)
  const [reduced, setReduced] = useState(true) // SSR/확인 전엔 정적

  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(m.matches)
    onChange()
    m.addEventListener('change', onChange)
    return () => m.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (reduced) return
    const el = ref.current
    if (!el) return
    const spans = Array.from(el.querySelectorAll<HTMLElement>('span[data-ch]'))
    let raf = 0
    let running = false
    const tick = (t: number) => {
      spans.forEach((s, i) => {
        const w = BASE + AMP * Math.sin((t / PERIOD) * Math.PI * 2 + i * STEP)
        s.style.fontVariationSettings = `'wght' ${Math.round(w)}`
      })
      raf = requestAnimationFrame(tick)
    }
    // 화면에 보일 때만 구동(rAF 는 탭 비활성 시 브라우저가 자동 정지)
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !running) {
        running = true
        raf = requestAnimationFrame(tick)
      } else if (!e.isIntersecting && running) {
        running = false
        cancelAnimationFrame(raf)
      }
    })
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [reduced])

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
      {/* React 가 head 로 호이스팅 — /about 에서만 로드 */}
      <link rel="stylesheet" precedence="default" href={VARIABLE_FONT_CSS} />
      {[...name].map((ch, i) => (
        <span key={i} data-ch aria-hidden="true">
          {ch === ' ' ? ' ' : ch}
        </span>
      ))}
    </h1>
  )
}
