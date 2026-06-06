'use client'

import { useEffect, useRef, useState } from 'react'

// 원본 인터랙티브 스테퍼 — 동작 동일, 색은 사이트 토큰.
// 산호 곡선(판단)은 상승, 회색(정체)은 정체 → 단계마다 격차가 벌어진다.
type Pt = [number, number]
const C: Pt[] = [
  [90, 244], [175, 238], [260, 228], [345, 208], [430, 175], [515, 125], [600, 66],
]
const G: Pt[] = [
  [90, 244], [175, 242], [260, 240], [345, 236], [430, 231], [515, 226], [600, 220],
]
const S = [
  { t: 'AI가 만든 불안', s: '개발자의 성역이 흔들린다', j: '불안을 변화의 신호로 읽는다', g: '"AI는 과장됐다, 내 일은 안전해"' },
  { t: "'코드를 잘 짠다'의 무력화", s: '코드만으로는 부족하다', j: '코드 너머의 가치를 묻기 시작한다', g: '"코드만 잘 짜면 인정받는다"' },
  { t: '성과는 결정의 궤적으로 남는다', s: '전환점 · 코드가 아니라 판단', j: '무엇을 왜 선택했는지를 남긴다', g: '"결과물(코드 양)이 곧 성과다"' },
  { t: 'AI 코드는 정답이 아니라 가설', s: '검증·판단할 사람이 필요하다', j: 'AI의 출력을 의심하고 검증한다', g: '"AI가 줬으니 맞겠지, 책임도 AI가"' },
  { t: '시니어의 가치는 기준이다', s: '기술이 아니라 판단 기준', j: '판단 기준을 세우고 공유한다', g: '"연차와 최신 기술이면 충분하다"' },
  { t: '당신은 무엇으로 기억될 것인가', s: '남는 것은 판단의 궤적', j: '판단의 궤적으로 신뢰를 쌓는다', g: '"바쁘게 쳐내면 인정받는다"' },
  { t: '판단은 훈련된다', s: '결론 · 판단은 기를 수 있다', j: '매일의 결정으로 판단을 단련한다 → 복리', g: '"재능이 없으면 안 된다" — 멈춘다' },
]
const INTERVAL = 4500

function sm(p: Pt[]): string {
  if (p.length < 2) return p.length ? `M${p[0][0]} ${p[0][1]}` : ''
  let d = `M${p[0][0]} ${p[0][1]}`
  for (let i = 0; i < p.length - 1; i++) {
    const a = p[i - 1] || p[i]
    const b = p[i]
    const c = p[i + 1]
    const e = p[i + 2] || c
    d += ` C${b[0] + (c[0] - a[0]) / 6} ${b[1] + (c[1] - a[1]) / 6} ${c[0] - (e[0] - b[0]) / 6} ${
      c[1] - (e[1] - b[1]) / 6
    } ${c[0]} ${c[1]}`
  }
  return d
}

const CORAL = 'hsl(var(--coral))'
const GRAY = 'hsl(var(--ink-3))'
const LINE = 'hsl(var(--line))'
const INK = 'hsl(var(--ink))'
const INK2 = 'hsl(var(--ink-2))'

export default function JudgmentStepper() {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false) // 마운트 후 motion 허용 시 true
  const [reduced, setReduced] = useState(true) // SSR 안전: 확인 전엔 자동재생 안 함
  const [paused, setPaused] = useState(false) // hover/focus 임시 정지

  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(m.matches)
    setPlaying(!m.matches)
  }, [])

  // 자동 진행 — reduced-motion·일시정지·탭 비활성 시 멈춤, 마지막 후 처음으로 순환
  useEffect(() => {
    if (reduced || !playing || paused) return
    const id = setInterval(() => {
      if (document.hidden) return
      setStep((s) => (s + 1) % S.length)
    }, INTERVAL)
    return () => clearInterval(id)
  }, [reduced, playing, paused])

  // 수동 조작 → 자동재생 중지(토글로만 재개)
  const goManual = (n: number) => {
    setPlaying(false)
    setStep(Math.max(0, Math.min(S.length - 1, n)))
  }
  const goDot = (i: number) => {
    setPlaying(false)
    setStep(i)
  }

  const [cx, cy] = C[step]
  const gy = G[step][1]
  const s = S[step]

  return (
    <div
      className="jc"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <svg width="100%" viewBox="0 0 680 280" role="img" aria-label={`판단 vs 정체 — ${step + 1}/${S.length}단계: ${s.t}`}>
        {/* legend — 강조(굵게·크게) */}
        <rect x="80" y="13" width="22" height="5" rx="2.5" fill={CORAL} />
        <text x="110" y="16" fontSize="13.5" fontWeight="700" fill={INK} dominantBaseline="central">
          판단을 훈련하면 — 복리로 성장
        </text>
        <rect x="80" y="34" width="22" height="5" rx="2.5" fill={GRAY} />
        <text x="110" y="37" fontSize="13.5" fontWeight="500" fill={INK2} dominantBaseline="central">
          훈련하지 않으면 — 정체
        </text>
        {/* axes — 라벨 강조 */}
        <text x="80" y="55" fontSize="13" fontWeight="700" fill={INK} textAnchor="middle">
          가치
        </text>
        <line x1="80" y1="62" x2="80" y2="250" stroke={LINE} strokeWidth="0.75" />
        <line x1="80" y1="250" x2="616" y2="250" stroke={LINE} strokeWidth="0.75" />
        <text x="606" y="269" fontSize="13" fontWeight="600" fill={INK2} textAnchor="end">
          시간 · 경력 →
        </text>
        {/* curves */}
        <path d={sm(G.slice(step))} fill="none" stroke={GRAY} strokeWidth="2" strokeLinecap="round" opacity="0.3" />
        <path d={sm(C.slice(step))} fill="none" stroke={CORAL} strokeWidth="2.5" strokeLinecap="round" opacity="0.22" />
        <path d={sm(G.slice(0, step + 1))} fill="none" stroke={GRAY} strokeWidth="2.5" strokeLinecap="round" />
        <path d={sm(C.slice(0, step + 1))} fill="none" stroke={CORAL} strokeWidth="3.2" strokeLinecap="round" />
        {/* gap + markers */}
        <line className="jc-gap" x1={cx} y1={cy} x2={cx} y2={gy} stroke={GRAY} strokeWidth="1" strokeDasharray="3 3" opacity="0.55" />
        <circle className="jc-mk" cx={cx} cy={gy} r="6" fill={GRAY} />
        <circle className="jc-mk" cx={cx} cy={cy} r="7.5" fill={CORAL} />
      </svg>

      <div className="jc-panel">
        <div className="jc-t">{s.t}</div>
        <div className="jc-s">{s.s}</div>
        <div className="jc-row jc-j">
          <span className="jc-tag">판단</span>
          <span>{s.j}</span>
        </div>
        <div className="jc-row jc-g">
          <span className="jc-tag">정체</span>
          <span>{s.g}</span>
        </div>
        <div className="jc-ctl">
          <div className="jc-left">
            {!reduced && (
              <button
                className="jc-btn jc-toggle"
                style={{ padding: '6px 8px' }}
                onClick={() => setPlaying((p) => !p)}
                aria-label={playing ? '자동재생 일시정지' : '자동재생'}
                aria-pressed={playing}
              >
                {playing ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="5" width="4" height="14" rx="1" />
                    <rect x="14" y="5" width="4" height="14" rx="1" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 4l13 8-13 8z" />
                  </svg>
                )}
              </button>
            )}
            <button className="jc-btn" onClick={() => goManual(step - 1)} disabled={step === 0}>
              이전
            </button>
          </div>
          <div className="jc-dots">
            {S.map((_, i) => (
              <button
                key={i}
                className={`jc-dot${i === step ? ' on' : ''}`}
                aria-label={`${i + 1}단계`}
                aria-current={i === step}
                onClick={() => goDot(i)}
              />
            ))}
          </div>
          <button className="jc-btn" onClick={() => goManual(step + 1)} disabled={step === S.length - 1}>
            다음
          </button>
        </div>
      </div>
    </div>
  )
}
