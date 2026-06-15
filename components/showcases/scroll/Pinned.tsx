'use client'

import { useRef, type ReactNode } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from './gsap'

// sticky 리빌 — 한 진술(focal)을 화면에 고정한 채 주석(steps)이 스크롤에 맞춰 차례로 드러난다.
// "스크롤=프레젠테이션" 기법을 그 기법으로 시연한다. reduced-motion이면 핀 없이 전부 표시.
export default function Pinned({ focal, steps }: { focal: ReactNode; steps: string[] }) {
  const ref = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>(ref.current!.querySelectorAll('[data-step]'))
      if (prefersReducedMotion()) {
        gsap.set(items, { opacity: 1, y: 0 })
        return
      }
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ref.current,
          start: 'top top',
          end: `+=${steps.length * 230}`,
          pin: true,
          scrub: 0.5,
        },
      })
      items.forEach((it) => {
        tl.from(it, { opacity: 0, y: 28, duration: 0.6 }).to(it, { duration: 0.25 })
      })
    },
    { scope: ref }
  )
  return (
    <div ref={ref} className="flex min-h-[78vh] flex-col justify-center gap-8 py-10">
      <div>{focal}</div>
      <ul className="space-y-5">
        {steps.map((s, i) => (
          <li key={i} data-step className="flex gap-4 text-lg text-ink-2 sm:text-xl">
            <span className="font-mono text-sm text-coral-2">{String(i + 1).padStart(2, '0')}</span>
            <span>{s}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
