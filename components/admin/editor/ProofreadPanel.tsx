'use client'

import { useEffect, useState } from 'react'
import type { ProofChange, ProofResult } from '@/lib/essay-proofread'
import type { AiProvider } from '@/lib/ai/types'

// 교정 탭 — 본문 + 선택 provider 로 /api/essay-proofread 호출 → 변경 목록.
// v1.1: 각 변경에 적용/반려 토글(기본=적용) + 모두 선택/해제 + '선택 적용'.
//   선택 적용 = 체크된 변경만 본문에 반영(각 before 첫 일치를 after 로 치환) → setContent(dirty).
//   적용 성공분은 목록에서 제거, 반려·불일치분은 남김. 결과(result)는 상위 controlled(탭 전환 유지).
export default function ProofreadPanel({
  body,
  provider,
  onApply,
  result,
  onResult,
  basePath = '/api/essay-proofread',
}: {
  body: string
  provider: AiProvider
  onApply: (corrected: string) => void
  result: ProofResult | null
  onResult: (r: ProofResult | null) => void
  basePath?: string
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [selected, setSelected] = useState<boolean[]>([])

  // 결과가 바뀌면 선택 상태를 모두 적용(체크)으로 초기화.
  // notice 는 여기서 지우지 않음 — 선택 적용 후 result 가 바뀌어도 '불일치' 알림이 살아남도록(run() 에서만 초기화).
  useEffect(() => {
    setSelected(result ? result.changes.map(() => true) : [])
  }, [result])

  const run = async () => {
    if (!body.trim()) {
      setError('교정할 본문이 없습니다.')
      onResult(null)
      return
    }
    setLoading(true)
    setError(null)
    setNotice(null)
    onResult(null)
    try {
      const r = await fetch(basePath, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ text: body, provider }),
      })
      const data = await r.json()
      if (!r.ok) {
        setError(data?.error || '교정에 실패했습니다.')
        return
      }
      onResult(data as ProofResult)
    } catch {
      setError('교정 요청 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const selectedCount = selected.filter(Boolean).length

  const applySelected = () => {
    if (!result) return
    let working = body
    const remaining: ProofChange[] = []
    let failed = 0
    result.changes.forEach((c, i) => {
      if (!selected[i]) {
        remaining.push(c) // 반려 — 남김
        return
      }
      const idx = working.indexOf(c.before)
      if (idx === -1) {
        failed++ // 원문 불일치 — 건너뛰고 남김
        remaining.push(c)
        return
      }
      working = working.slice(0, idx) + c.after + working.slice(idx + c.before.length)
    })
    onApply(working) // setContent → dirty(즉시 저장 아님)
    setNotice(failed > 0 ? `${failed}건 적용 실패(원문 불일치)` : null)
    onResult(remaining.length ? { ...result, changes: remaining } : null)
  }

  return (
    <div className="mt-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={run}
          disabled={loading}
          className="rounded-lg bg-coral-2 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-coral disabled:opacity-50"
        >
          {loading ? '교정 중…' : '교정 실행'}
        </button>
        {result && result.changes.length > 0 && (
          <>
            <button
              type="button"
              onClick={applySelected}
              disabled={selectedCount === 0}
              className="rounded-lg border border-line px-3 py-1.5 text-sm font-semibold text-ink-2 hover:border-coral-soft hover:text-ink disabled:opacity-40"
            >
              선택 적용 ({selectedCount})
            </button>
            <button
              type="button"
              onClick={() => onResult(null)}
              className="rounded-lg px-2 py-1.5 text-sm font-medium text-ink-3 hover:text-ink-2"
            >
              초기화
            </button>
          </>
        )}
      </div>

      {error && <p className="mt-3 text-sm font-semibold text-coral-2">{error}</p>}
      {notice && <p className="mt-3 text-sm font-semibold text-amber-600 dark:text-amber-400">{notice}</p>}

      {result && !error && (
        <div className="mt-4">
          {result.changes.length === 0 ? (
            <p className="text-sm text-ink-3">고칠 부분을 찾지 못했습니다.</p>
          ) : (
            <>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-wide text-ink-3">
                  {result.changes.length}건 제안
                </p>
                <div className="flex gap-2 text-[11px] font-semibold text-coral-2">
                  <button type="button" onClick={() => setSelected(result.changes.map(() => true))}>
                    모두 선택
                  </button>
                  <span className="text-ink-3">·</span>
                  <button type="button" onClick={() => setSelected(result.changes.map(() => false))}>
                    모두 해제
                  </button>
                </div>
              </div>
              <ul className="space-y-2">
                {result.changes.map((c: ProofChange, i) => (
                  <li key={i} className="rounded-lg border border-line bg-surface p-3">
                    <label className="flex cursor-pointer items-start gap-2">
                      <input
                        type="checkbox"
                        checked={selected[i] ?? false}
                        onChange={(e) =>
                          setSelected((cur) => {
                            const next = [...cur]
                            next[i] = e.target.checked
                            return next
                          })
                        }
                        className="mt-1 shrink-0 accent-coral-2"
                        aria-label={selected[i] ? '반려' : '적용'}
                      />
                      <span className="min-w-0">
                        <span className="text-sm leading-relaxed">
                          <span className="text-ink-3 line-through">{c.before}</span>{' '}
                          <span className="font-semibold text-coral-2">{c.after}</span>
                        </span>
                        {c.reason && <span className="mt-1 block text-[12px] text-ink-3">{c.reason}</span>}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  )
}
