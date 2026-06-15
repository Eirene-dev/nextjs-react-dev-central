'use client'

import { useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from './gsap'

// 스크럽 카운터 — 정수가 스크롤에 맞춰 0→to로 올라간다(데모의 "30시간" 스펙 카운터 계열 기법).
// "정지된 스펙을 사건으로" 기법. reduced-motion이면 최종값을 바로 표시.
export default function CounterScrub({
  to,
  suffix = '',
  label,
  className,
}: {
  to: number
  suffix?: string
  label: string
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      const num = ref.current!.querySelector('[data-num]')
      if (!num) return
      if (prefersReducedMotion()) {
        num.textContent = `${to}${suffix}`
        return
      }
      const obj = { v: 0 }
      gsap.to(obj, {
        v: to,
        ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top 85%', end: 'top 45%', scrub: 0.5 },
        onUpdate: () => {
          num.textContent = `${Math.round(obj.v)}${suffix}`
        },
      })
    },
    { scope: ref }
  )
  return (
    <div ref={ref} className={className}>
      <div className="text-7xl font-extrabold tabular-nums tracking-tight text-ink sm:text-8xl">
        <span data-num>0{suffix}</span>
      </div>
      <p className="mt-2 text-ink-3">{label}</p>
    </div>
  )
}
