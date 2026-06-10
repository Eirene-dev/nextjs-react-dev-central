'use client'

import { useEffect, useRef } from 'react'

// 1점 투시 회랑 라인 일러스트 v2(저자 승인 아트). 기하/타이밍은 css/about.css 에 그대로 옮김.
// v2 변경: 전체 구도(viewBox 0 -112 680 468 — 바깥 아치가 잘리지 않는 프로시니엄),
//   45° 천장 리브 한 쌍, 주두·키스톤 틱(.tk), 검산 대각선·작도원(.cn — 호버 시 또렷),
//   포털 halo(숨쉬는 빛), 바닥 글라이더(.gl3 — 빛 속으로), 소실점 십자 맥동(.vpc).
// - 색은 테마 인지(.dark 에서 선=크림/포털=따뜻한 빛, 코랄 동일).
// - 작도 애니메이션은 스크롤 진입(IntersectionObserver, 1회) 시 .play 로 시작.
// - reduced-motion 은 css 에서 정적 완성 그림 + 글라이더 숨김.
// - 뷰포트 완전 이탈 시 무한 루프(.idle)만 일시정지(배터리 절약) — 그리기·맥동(vpc)은 제외.
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
      <svg viewBox="0 -112 680 468" role="img" xmlns="http://www.w3.org/2000/svg">
        <title>1점 투시 회랑</title>
        <desc>
          하나의 소실점을 공유하는 동심 반원 아치들이 조화수열 간격으로 후퇴하는 회랑. 수평선과 검산
          대각선이 먼저 놓이고 — 대각선 두 줄은 바닥 모서리와 포털 모서리를 이어 정확히 중앙축 위에서
          교차한다 — 바깥 아치부터 안쪽으로 차례로 작도된다. 천장의 리브가 바깥 아치에 착지하고 기둥
          주두와 아치 키스톤이 점등되면, 끝의 빛이 숨쉬고 코랄 빛 세 줄 — 아치 둘과 바닥 하나 — 가
          회랑을 느리게 흐른다. 인물은 없다. 선과 빛만 남겼다.
        </desc>

        <defs>
          <radialGradient id="col-haloG" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" className="h0" />
            <stop offset="1" className="h1" />
          </radialGradient>
        </defs>

        {/* 작도선: 수평선(fd) · 작도원/검산 대각선(cn — 호버 리빌) */}
        <path className="fd" style={vO('.1')} strokeWidth=".5" strokeDasharray="4 8" d="M0,210 L680,210" />
        <path className="cn" strokeOpacity=".34" strokeWidth=".6" strokeDasharray="3 7" d="M40,210 A300,300 0 0 0 640,210" />
        <path className="cn" strokeOpacity=".45" strokeWidth=".55" strokeDasharray="3 7" d="M0,330 L425,244" />
        <path className="cn" strokeOpacity=".45" strokeWidth=".55" strokeDasharray="3 7" d="M680,330 L255,244" />

        {/* 포털 빛 */}
        <circle className="halo" cx="340" cy="202" r="122" fill="url(#col-haloG)" />
        <g className="pw">
          <path className="pb" d="M255,244 L255,210 A85,85 0 0 1 425,210 L425,244 Z" fill="#FDFBF6" />
        </g>

        {/* 소실점 십자 — 작도 후 느린 맥동 */}
        <path className="ln g0 vpc" style={{ stroke: '#E06A4C' }} strokeWidth="1" opacity=".5" pathLength={1} d="M334,210 L346,210" />
        <path className="ln g0 vpc" style={{ stroke: '#E06A4C' }} strokeWidth="1" opacity=".5" pathLength={1} d="M340,204 L340,216" />

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

        {/* 천장 리브: 30°·60°·90° + 45° 한 쌍 — 전부 바깥 아치(r300)에 착지 */}
        <path className="ln g6" strokeWidth=".55" opacity=".2" pathLength={1} d="M599.8,60 L426.6,160" />
        <path className="ln g6" strokeWidth=".55" opacity=".2" pathLength={1} d="M490,-50 L390,123.4" />
        <path className="ln g6" strokeWidth=".55" opacity=".2" pathLength={1} d="M340,-90 L340,110" />
        <path className="ln g6" strokeWidth=".55" opacity=".2" pathLength={1} d="M190,-50 L290,123.4" />
        <path className="ln g6" strokeWidth=".55" opacity=".2" pathLength={1} d="M80.2,60 L253.4,160" />
        <path className="ln g6" strokeWidth=".5" opacity=".17" pathLength={1} d="M552.1,-2.1 L410.7,139.3" />
        <path className="ln g6" strokeWidth=".5" opacity=".17" pathLength={1} d="M127.9,-2.1 L269.3,139.3" />

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

        {/* 주두(기둥 머리) 틱 — 건축의 마감 단계에 점등 */}
        <path className="tk" strokeOpacity=".32" strokeWidth=".8" d="M36,214 L44,214" />
        <path className="tk" strokeOpacity=".32" strokeWidth=".8" d="M636,214 L644,214" />
        <path className="tk" strokeOpacity=".32" strokeWidth=".7" d="M125.5,213.5 L142.5,213.5" />
        <path className="tk" strokeOpacity=".32" strokeWidth=".7" d="M537.5,213.5 L554.5,213.5" />
        <path className="tk" strokeOpacity=".3" strokeWidth=".6" d="M178.8,213 L192.2,213" />
        <path className="tk" strokeOpacity=".3" strokeWidth=".6" d="M487.8,213 L501.2,213" />
        <path className="tk" strokeOpacity=".28" strokeWidth=".55" d="M211,212.6 L222,212.6" />
        <path className="tk" strokeOpacity=".28" strokeWidth=".55" d="M458,212.6 L469,212.6" />
        <path className="tk" strokeOpacity=".26" strokeWidth=".5" d="M237.5,212.2 L242.5,212.2" />
        <path className="tk" strokeOpacity=".26" strokeWidth=".5" d="M437.5,212.2 L442.5,212.2" />
        {/* 키스톤 틱 — 아치 꼭대기 */}
        <path className="tk" strokeOpacity=".3" strokeWidth=".8" d="M340,-90 L340,-82.5" />
        <path className="tk" strokeOpacity=".28" strokeWidth=".7" d="M340,10 L340,16" />
        <path className="tk" strokeOpacity=".26" strokeWidth=".6" d="M340,60 L340,65" />
        <path className="tk" strokeOpacity=".24" strokeWidth=".55" d="M340,90 L340,94.2" />
        <path className="tk" strokeOpacity=".22" strokeWidth=".5" d="M340,110 L340,113.6" />

        {/* 글라이더: 아치 둘 + 바닥 하나(빛 속으로 걸어 들어가는 걸음) */}
        <path className="gl gl1" pathLength={100} d="M140,210 A200,200 0 0 1 540,210" />
        <path className="gl gl2" pathLength={100} d="M640,210 A300,300 0 0 0 40,210" />
        <path className="gl gl3" pathLength={100} d="M80,330 L340,210" />
      </svg>
    </div>
  )
}