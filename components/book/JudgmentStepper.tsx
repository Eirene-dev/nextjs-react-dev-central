'use client'

import { useState } from 'react'

// 원본 인터랙티브 스테퍼를 선언형 React로 이식 — 동작 동일, 색은 사이트 토큰.
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

// Catmull-Rom 풍 부드러운 곡선 path (원본 sm 동일)
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
const TXT2 = 'hsl(var(--ink-2))'

export default function JudgmentStepper() {
  const [step, setStep] = useState(0)
  const go = (n: number) => setStep(Math.max(0, Math.min(S.length - 1, n)))
  const [cx, cy] = C[step]
  const gy = G[step][1]
  const s = S[step]

  return (
    <div className="jc">
      <svg width="100%" viewBox="0 0 680 280" role="img" aria-label={`판단 vs 정체 — ${step + 1}/${S.length}단계: ${s.t}`}>
        {/* legend */}
        <rect x="80" y="15" width="20" height="4" rx="2" fill={CORAL} />
        <text x="108" y="17" fontSize="12" fill={TXT2} dominantBaseline="central">
          판단을 훈련하면 — 복리로 성장
        </text>
        <rect x="80" y="35" width="20" height="4" rx="2" fill={GRAY} />
        <text x="108" y="37" fontSize="12" fill={TXT2} dominantBaseline="central">
          훈련하지 않으면 — 정체
        </text>
        {/* axes */}
        <text x="80" y="54" fontSize="12" fill={TXT2} textAnchor="middle">
          가치
        </text>
        <line x1="80" y1="60" x2="80" y2="250" stroke={LINE} strokeWidth="0.5" />
        <line x1="80" y1="250" x2="616" y2="250" stroke={LINE} strokeWidth="0.5" />
        <text x="606" y="268" fontSize="12" fill={TXT2} textAnchor="end">
          시간 · 경력 →
        </text>
        {/* curves */}
        <path d={sm(G.slice(step))} fill="none" stroke={GRAY} strokeWidth="2" strokeLinecap="round" opacity="0.3" />
        <path d={sm(C.slice(step))} fill="none" stroke={CORAL} strokeWidth="2.5" strokeLinecap="round" opacity="0.22" />
        <path d={sm(G.slice(0, step + 1))} fill="none" stroke={GRAY} strokeWidth="2.5" strokeLinecap="round" />
        <path d={sm(C.slice(0, step + 1))} fill="none" stroke={CORAL} strokeWidth="3" strokeLinecap="round" />
        {/* gap + markers */}
        <line className="jc-gap" x1={cx} y1={cy} x2={cx} y2={gy} stroke={GRAY} strokeWidth="1" strokeDasharray="3 3" opacity="0.55" />
        <circle className="jc-mk" cx={cx} cy={gy} r="6" fill={GRAY} />
        <circle className="jc-mk" cx={cx} cy={cy} r="7" fill={CORAL} />
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
          <button className="jc-btn" onClick={() => go(step - 1)} disabled={step === 0}>
            이전
          </button>
          <div className="jc-dots">
            {S.map((_, i) => (
              <button
                key={i}
                className={`jc-dot${i === step ? ' on' : ''}`}
                aria-label={`${i + 1}단계`}
                aria-current={i === step}
                onClick={() => go(i)}
              />
            ))}
          </div>
          <button className="jc-btn" onClick={() => go(step + 1)} disabled={step === S.length - 1}>
            다음
          </button>
        </div>
      </div>
    </div>
  )
}
