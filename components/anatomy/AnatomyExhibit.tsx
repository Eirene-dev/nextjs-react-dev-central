'use client'

import { useCallback, useEffect, useState, type ReactNode } from 'react'

// 해부 전시 투표 동선 — 질문 → 선택지 → (투표/건너뛰기) → 분포 + 공개.
// 집계는 런타임 GET(SSG 보존). 토큰=localStorage(crypto.randomUUID), 1회 투표(변경 불가).
// 근거 본문(MDX)은 서버 렌더되어 children 으로 들어오고, 공개 후에만 노출한다.

type Option = { key: string; title: string; tradeoff: string }
type Decision = { key: string; label: string; sub?: string }

const VOTER_KEY = 'anatomy-voter-id'
function getVoterId(): string {
  try {
    let id = localStorage.getItem(VOTER_KEY)
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem(VOTER_KEY, id)
    }
    return id
  } catch {
    return ''
  }
}

// result 의 [추기 예정: X] → todo 칩("X 추기 예정"). 원문은 불변, 표시 규칙만 적용.
function renderResult(result: string): ReactNode[] {
  const out: ReactNode[] = []
  const re = /\[추기 예정:\s*([^\]]+)\]/g
  let last = 0
  let m: RegExpExecArray | null
  let i = 0
  while ((m = re.exec(result))) {
    if (m.index > last) out.push(<span key={i++}>{result.slice(last, m.index)}</span>)
    out.push(
      <span key={i++} className="anatomy-todo ml-1">
        {m[1].trim()} 추기 예정
      </span>
    )
    last = m.index + m[0].length
  }
  if (last < result.length) out.push(<span key={i++}>{result.slice(last)}</span>)
  return out
}

export default function AnatomyExhibit({
  slug,
  exhibit,
  category,
  title,
  readingMinutes,
  question,
  options,
  decision,
  result,
  aiLedger,
  children,
}: {
  slug: string
  exhibit: number
  category: string
  title: string
  readingMinutes: number
  question: string
  options: Option[]
  decision: Decision
  result: string
  aiLedger: { claude: string; me: string }
  children: ReactNode
}) {
  const authorKey = decision.key
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [total, setTotal] = useState(0)
  const [mine, setMine] = useState<string | null>(null) // 'A'|… | 'skip' | null
  const [pending, setPending] = useState(false)
  const voteKey = `anatomy-vote:${slug}`
  const revealed = mine != null

  const loadCounts = useCallback(async () => {
    try {
      const r = await fetch(`/api/anatomy/${encodeURIComponent(slug)}/votes`, { cache: 'no-store' })
      if (!r.ok) return
      const d = await r.json()
      if (d && typeof d === 'object') {
        setCounts(d.counts || {})
        setTotal(typeof d.total === 'number' ? d.total : 0)
      }
    } catch {
      /* noop — 집계 실패는 조용히 */
    }
  }, [slug])

  // 마운트: 저장된 내 선택 복원 + 집계 로드
  useEffect(() => {
    try {
      const saved = localStorage.getItem(voteKey)
      if (saved) setMine(saved)
    } catch {
      /* noop */
    }
    loadCounts()
  }, [voteKey, loadCounts])

  const persist = (v: string) => {
    try {
      localStorage.setItem(voteKey, v)
    } catch {
      /* noop */
    }
  }

  const vote = async (option: string) => {
    if (revealed || pending) return
    const token = getVoterId()
    if (!token) return
    setPending(true)
    setMine(option) // 낙관적 공개
    persist(option)
    try {
      const r = await fetch(`/api/anatomy/${encodeURIComponent(slug)}/votes`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ option, token }),
      })
      if (r.ok) {
        const d = await r.json()
        setCounts(d.counts || {})
        setTotal(typeof d.total === 'number' ? d.total : 0)
      } else {
        await loadCounts()
      }
    } catch {
      await loadCounts()
    } finally {
      setPending(false)
    }
  }

  const skip = () => {
    if (revealed) return
    setMine('skip')
    persist('skip')
    loadCounts()
  }

  const pct = (key: string) => (total > 0 ? Math.round(((counts[key] || 0) / total) * 100) : 0)

  return (
    <article className="anatomy-reveal-root">
      {/* eyebrow */}
      <p className="anatomy-mono mb-3.5 flex items-center gap-2.5 text-[11px] uppercase tracking-[0.16em] text-coral-2">
        <span className="anatomy-ringdot" aria-hidden />
        해부 · EXHIBIT {String(exhibit).padStart(2, '0')}
        <span className="ml-auto rounded-full border border-line px-2.5 py-[3px] text-[10.5px] normal-case tracking-[0.06em] text-ink-2">
          {category}
        </span>
      </p>

      <h1 className="anatomy-h1 mb-2.5 text-[24px] sm:text-[29px]">{title}</h1>
      <p className="anatomy-mono mb-10 text-[11.5px] tracking-[0.03em] text-ink-3">
        읽기 {readingMinutes}분 · 선택하면 저자의 판단이 공개됩니다
      </p>

      {/* 질문 */}
      <div className="anatomy-seclabel mb-3.5">질문</div>
      <p className="anatomy-question">{question}</p>

      {/* 선택지 */}
      <div className="anatomy-seclabel mb-3.5 mt-9">선택지</div>
      <div className="flex flex-col gap-2.5">
        {options.map((o) => {
          const isAuthor = revealed && o.key === authorKey
          const isPicked = revealed && o.key === mine
          const isDim = revealed && mine !== 'skip' && o.key !== mine && o.key !== authorKey
          return (
            <button
              key={o.key}
              type="button"
              onClick={() => vote(o.key)}
              disabled={revealed || pending}
              aria-pressed={isPicked}
              className={[
                'anatomy-opt w-full rounded-[13px] border bg-surface-2 px-[17px] py-[15px] text-left transition',
                revealed ? 'cursor-default' : 'hover:-translate-y-0.5 hover:border-coral',
                isPicked || isAuthor ? 'border-coral' : 'border-line',
                isPicked ? 'bg-coral/10 shadow-[0_0_0_1px_hsl(var(--coral))]' : '',
                isDim ? 'opacity-[.66]' : '',
              ].join(' ')}
            >
              <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
                <span className="anatomy-letter">{o.key}</span>
                <span className="text-[15.5px] font-bold tracking-[-0.01em] text-ink">{o.title}</span>
                {isAuthor && <span className="anatomy-author-tag">저자의 선택</span>}
                {revealed && (
                  <span className="anatomy-mono ml-auto text-[12px] text-ink-2">{pct(o.key)}%</span>
                )}
              </span>
              <span className="mt-2 block text-[14px] leading-[1.7] text-ink-2">{o.tradeoff}</span>
              {revealed && (
                <span
                  className="anatomy-bar mt-3 block"
                  style={{ ['--w' as string]: `${pct(o.key)}%` }}
                >
                  <i />
                </span>
              )}
            </button>
          )
        })}
      </div>

      {!revealed ? (
        <p className="mt-3.5 text-[13px] text-ink-2">
          어느 쪽이든 고르면 저자의 결정과 근거가 열립니다 ·{' '}
          <button
            type="button"
            onClick={skip}
            className="text-coral-2 underline underline-offset-[3px] hover:text-coral"
          >
            건너뛰고 보기
          </button>
        </p>
      ) : (
        <p className="anatomy-mono mt-3.5 text-[11.5px] tracking-[0.03em] text-ink-2">
          {total > 0
            ? `독자 ${total.toLocaleString('ko-KR')}명의 선택과 비교해 보세요`
            : '아직 집계된 선택이 없습니다 — 첫 기록이 됩니다'}
        </p>
      )}

      {/* 공개 블록 — 투표/건너뛰기 후에만 */}
      {revealed && (
        <div className="anatomy-reveal">
          <p className="my-10 text-center text-[19px] text-coral" aria-hidden>
            ❦
          </p>

          <div className="anatomy-seclabel mb-3.5">내 결정</div>
          <p className="anatomy-decision">
            <span className="dl">{decision.key}.</span> {decision.label}
            {decision.sub && <span className="dsub"> — {decision.sub}</span>}
          </p>

          <div className="anatomy-seclabel mb-3.5 mt-9">근거</div>
          <div className="anatomy-body">{children}</div>

          <div className="anatomy-seclabel mb-3.5 mt-9">결과</div>
          <p className="anatomy-resline">{renderResult(result)}</p>

          <div className="anatomy-seclabel mb-3.5 mt-9">AI 분업</div>
          <div className="overflow-hidden rounded-[13px] border border-line bg-surface-2">
            <div className="flex gap-4 px-[17px] py-3.5">
              <b className="anatomy-mono w-24 flex-none pt-0.5 text-[11.5px] font-semibold tracking-[0.05em] text-ink-2">
                Claude Code
              </b>
              <span className="text-[14.5px] leading-[1.75] text-ink-2">{aiLedger.claude}</span>
            </div>
            <div className="flex gap-4 border-t border-line px-[17px] py-3.5">
              <b className="anatomy-mono w-24 flex-none pt-0.5 text-[11.5px] font-semibold tracking-[0.05em] text-coral-2">
                나
              </b>
              <span className="text-[14.5px] leading-[1.75] text-ink-2">{aiLedger.me}</span>
            </div>
          </div>
        </div>
      )}
    </article>
  )
}
