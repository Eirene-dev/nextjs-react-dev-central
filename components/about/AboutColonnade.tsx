'use client'

import { useEffect, useRef } from 'react'

// 1점 투시 회랑 라인 일러스트(저자 승인 아트). 기하/타이밍은 css/about.css 에 그대로 옮김.
// - 색은 테마 인지(.dark 에서 선=크림/포털=따뜻한 빛, 코랄 동일).
// - 작도 애니메이션은 스크롤 진입(IntersectionObserver, 1회) 시 .play 로 시작.
// - reduced-motion 은 css 에서 정적 완성 그림 + 글라이더 숨김.
// - 뷰포트 완전 이탈 시 무한 루프(.idle)만 일시정지(배터리 절약).
const vO = (o: string): React.CSSProperties => ({ ['--o' as string]: o }) as React.CSSProperties

export default function AboutColonnade() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const playIo = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.classList.add('play')
            playIo.disconnect()
            break
          }
        }
      },
      { threshold: 0.3 }
    )
    playIo.observe(el)

    const idleIo = new IntersectionObserver(
      (entries) => {
        for (const e of entries) el.classList.toggle('idle', !e.isIntersecting)
      },
      { threshold: 0 }
    )
    idleIo.observe(el)

    return () => {
      playIo.disconnect()
      idleIo.disconnect()
    }
  }, [])

  return (
    <div ref={ref} className="about-colonnade">
      <svg viewBox="0 0 680 340" role="img" xmlns="http://www.w3.org/2000/svg">
        <title>1점 투시 회랑</title>
        <desc>
          하나의 소실점을 공유하는 동심 반원 아치들이 조화수열 간격으로 후퇴하는 회랑. 작도선이 먼저
          그려지고 아치와 바닥이 차례로 그려진 뒤, 끝의 빛이 숨쉬고 코랄 빛줄기 두 개가 아치를 따라
          느리게 흐른다.
        </desc>
        <path className="fd" style={vO('.1')} strokeWidth=".5" strokeDasharray="4 8" d="M0,210 L680,210" />
        <path className="fd" style={vO('.12')} strokeWidth=".6" strokeDasharray="3 7" d="M40,210 A300,300 0 0 0 640,210" />
        <g className="pw">
          <path className="pb" d="M255,244 L255,210 A85,85 0 0 1 425,210 L425,244 Z" fill="#FDFBF6" />
        </g>
        <path className="ln g0" style={{ stroke: '#E06A4C' }} strokeWidth="1" opacity=".5" pathLength={1} d="M334,210 L346,210" />
        <path className="ln g0" style={{ stroke: '#E06A4C' }} strokeWidth="1" opacity=".5" pathLength={1} d="M340,204 L340,216" />
        <path className="ln g1" strokeWidth="1.3" opacity=".55" pathLength={1} d="M40,210 A300,300 0 0 1 640,210" />
        <path className="ln g1" strokeWidth="1.1" opacity=".5" pathLength={1} d="M40,210 L40,330" />
        <path className="ln g1" strokeWidth="1.1" opacity=".5" pathLength={1} d="M640,210 L640,330" />
        <path className="ln g2" strokeWidth="1.05" opacity=".48" pathLength={1} d="M140,210 A200,200 0 0 1 540,210" />
        <path className="ln g2" strokeWidth=".9" opacity=".42" pathLength={1} d="M140,210 L140,290" />
        <path className="ln g2" strokeWidth=".9" opacity=".42" pathLength={1} d="M540,210 L540,290" />
        <path className="ln g2" strokeWidth=".8" opacity=".36" pathLength={1} d="M128,210 L128,290" />
        <path className="ln g2" strokeWidth=".8" opacity=".36" pathLength={1} d="M552,210 L552,290" />
        <path className="ln g3" strokeWidth=".85" opacity=".4" pathLength={1} d="M190,210 A150,150 0 0 1 490,210" />
        <path className="ln g3" strokeWidth=".75" opacity=".35" pathLength={1} d="M190,210 L190,270" />
        <path className="ln g3" strokeWidth=".75" opacity=".35" pathLength={1} d="M490,210 L490,270" />
        <path className="ln g3" strokeWidth=".65" opacity=".3" pathLength={1} d="M181,210 L181,270" />
        <path className="ln g3" strokeWidth=".65" opacity=".3" pathLength={1} d="M499,210 L499,270" />
        <path className="ln g4" strokeWidth=".7" opacity=".33" pathLength={1} d="M220,210 A120,120 0 0 1 460,210" />
        <path className="ln g4" strokeWidth=".6" opacity=".3" pathLength={1} d="M220,210 L220,258" />
        <path className="ln g4" strokeWidth=".6" opacity=".3" pathLength={1} d="M460,210 L460,258" />
        <path className="ln g4" strokeWidth=".55" opacity=".26" pathLength={1} d="M213,210 L213,258" />
        <path className="ln g4" strokeWidth=".55" opacity=".26" pathLength={1} d="M467,210 L467,258" />
        <path className="ln g5" strokeWidth=".6" opacity=".28" pathLength={1} d="M240,210 A100,100 0 0 1 440,210" />
        <path className="ln g5" strokeWidth=".55" opacity=".26" pathLength={1} d="M240,210 L240,250" />
        <path className="ln g5" strokeWidth=".55" opacity=".26" pathLength={1} d="M440,210 L440,250" />
        <path className="ln g5" strokeWidth=".55" opacity=".3" pathLength={1} d="M255,210 A85,85 0 0 1 425,210" />
        <path className="ln g5" strokeWidth=".5" opacity=".25" pathLength={1} d="M255,210 L255,244" />
        <path className="ln g5" strokeWidth=".5" opacity=".25" pathLength={1} d="M425,210 L425,244" />
        <path className="ln g6" strokeWidth=".55" opacity=".2" pathLength={1} d="M599.8,60 L426.6,160" />
        <path className="ln g6" strokeWidth=".55" opacity=".2" pathLength={1} d="M490,-50 L390,123.4" />
        <path className="ln g6" strokeWidth=".55" opacity=".2" pathLength={1} d="M340,-90 L340,110" />
        <path className="ln g6" strokeWidth=".55" opacity=".2" pathLength={1} d="M190,-50 L290,123.4" />
        <path className="ln g6" strokeWidth=".55" opacity=".2" pathLength={1} d="M80.2,60 L253.4,160" />
        <path className="ln g7" strokeWidth=".65" opacity=".3" pathLength={1} d="M0,330 L680,330" />
        <path className="ln g7" strokeWidth=".6" opacity=".26" pathLength={1} d="M100,290 L580,290" />
        <path className="ln g7" strokeWidth=".55" opacity=".24" pathLength={1} d="M160,270 L520,270" />
        <path className="ln g7" strokeWidth=".5" opacity=".22" pathLength={1} d="M196,258 L484,258" />
        <path className="ln g7" strokeWidth=".5" opacity=".2" pathLength={1} d="M220,250 L460,250" />
        <path className="ln g7" strokeWidth=".55" opacity=".2" pathLength={1} d="M0,323.3 L220,250" />
        <path className="ln g7" strokeWidth=".55" opacity=".2" pathLength={1} d="M680,323.3 L460,250" />
        <path className="ln g7" strokeWidth=".55" opacity=".2" pathLength={1} d="M80,330 L253.3,250" />
        <path className="ln g7" strokeWidth=".55" opacity=".2" pathLength={1} d="M600,330 L426.7,250" />
        <path className="ln g7" strokeWidth=".55" opacity=".2" pathLength={1} d="M180,330 L286.7,250" />
        <path className="ln g7" strokeWidth=".55" opacity=".2" pathLength={1} d="M500,330 L393.3,250" />
        <path className="ln g7" strokeWidth=".55" opacity=".2" pathLength={1} d="M270,330 L316.7,250" />
        <path className="ln g7" strokeWidth=".5" opacity=".14" pathLength={1} d="M340,330 L340,250" />
        <path className="gl gl1" pathLength={100} d="M140,210 A200,200 0 0 1 540,210" />
        <path className="gl gl2" pathLength={100} d="M640,210 A300,300 0 0 0 40,210" />
      </svg>
    </div>
  )
}
