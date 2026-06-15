'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger, prefersReducedMotion } from './gsap'

// 부드러운 스크롤 — ScrollTrigger와 동기(lenis.on('scroll', update) + gsap.ticker raf).
// reduced-motion이면 초기화하지 않아 네이티브 스크롤을 그대로 둔다(페이지 단위 스코프, 언마운트 시 destroy).
export function useLenis() {
  useEffect(() => {
    if (prefersReducedMotion()) return
    const lenis = new Lenis({ duration: 1.1 })
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
    }
  }, [])
}
