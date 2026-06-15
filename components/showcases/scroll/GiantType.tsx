'use client'

import { useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from './gsap'

// 거대 타이포 — 단어별 스태거로 스크럽 진입. "타이포가 곧 레이아웃" 기법을 그 기법으로 시연한다.
export default function GiantType({
  words,
  className,
}: {
  words: string[]
  className?: string
}) {
  const ref = useRef<HTMLHeadingElement>(null)
  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const spans = ref.current!.querySelectorAll('[data-word]')
      gsap.from(spans, {
        opacity: 0,
        yPercent: 50,
        scale: 0.9,
        transformOrigin: 'left bottom',
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 80%', end: 'top 35%', scrub: 0.6 },
      })
    },
    { scope: ref }
  )
  return (
    <h2 ref={ref} className={className}>
      {words.map((w, i) => (
        <span key={i} data-word className="inline-block will-change-transform">
          {w}
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </h2>
  )
}
