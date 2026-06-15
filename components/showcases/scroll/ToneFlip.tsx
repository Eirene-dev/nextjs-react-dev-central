'use client'

import { useRef, type ReactNode } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from './gsap'

// 라이트↔다크 리듬 — 어두운 면이 opacity 스크럽으로 차오르고, 텍스트는 mix-blend-difference로
// 밝은 면에선 검정·어두운 면에선 흰색으로 자동 반전한다(텍스트 색 애니 불필요, 컴포지터 친화).
// "명암의 리듬 = 챕터 전환 신호" 기법을 그 기법으로 시연한다. reduced-motion이면 어두운 면 고정.
export default function ToneFlip({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      const dark = ref.current!.querySelector('[data-dark]')
      if (prefersReducedMotion()) {
        gsap.set(dark, { opacity: 1 })
        return
      }
      gsap.fromTo(
        dark,
        { opacity: 0 },
        {
          opacity: 1,
          ease: 'none',
          scrollTrigger: { trigger: ref.current, start: 'top 75%', end: 'top 25%', scrub: true },
        }
      )
    },
    { scope: ref }
  )
  return (
    <div ref={ref} className="relative overflow-hidden rounded-3xl border border-line">
      <div data-dark className="absolute inset-0 bg-[#0b0b0d]" aria-hidden />
      <div className="relative px-7 py-20 text-white [mix-blend-mode:difference] sm:px-12 sm:py-28">
        {children}
      </div>
    </div>
  )
}
