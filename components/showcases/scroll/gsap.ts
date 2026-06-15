import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

// 모듈 레벨 1회 등록 — 'use client' 컴포넌트에서만 import한다.
gsap.registerPlugin(ScrollTrigger, useGSAP)

// reduced-motion 질의(브라우저 전용). SSR/구형 환경에선 false → 모션 비활성 분기 없음.
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

export { gsap, ScrollTrigger, useGSAP }
