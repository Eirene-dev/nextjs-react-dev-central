'use client'

import { useState } from 'react'
import type { ProofChange, ProofResult } from '@/lib/essay-proofread'
import type { AiProvider } from '@/lib/ai/types'

// 교정 탭 — 현재 본문 + 선택 provider 를 /api/essay-proofread 로 보내 changes 렌더 + 전체 적용.
// 개별 accept/reject 는 v1.1(이번 제외). basePath 주입 가능(테스트용).
export default function ProofreadPanel({
  body,
  provider,
  onApply,
  basePath = '/api/essay-proofread',
}: {
  body: string
  provider: AiProvider
  onApply: (corrected: string) => void
  basePath?: string
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ProofResult | null>(null)

  const run = async () => {
    if (!body.trim()) {
      setError('교정할 본문이 없습니다.')
      setResult(null)
      return
    }
    setLoading(true)
    setError(null)
    setResult(null)
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
      setResult(data as ProofResult)
    } catch {
      setError('교정 요청 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const apply = () => {
    if (result) onApply(result.corrected)
  }

  return (
    <div className="mt-4">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={run}
          disabled={loading}
          className="rounded-lg bg-coral-2 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-coral disabled:opacity-50"
        >
          {loading ? '교정 중…' : '교정 실행'}
        </button>
        {result && (
          <button
            type="button"
            onClick={apply}
            className="rounded-lg border border-line px-3 py-1.5 text-sm font-semibold text-ink-2 hover:border-coral-soft hover:text-ink"
          >
            전체 적용
          </button>
        )}
      </div>

      {error && <p className="mt-3 text-sm font-semibold text-coral-2">{error}</p>}

      {result && !error && (
        <div className="mt-4">
          {result.changes.length === 0 ? (
            <p className="text-sm text-ink-3">고칠 부분을 찾지 못했습니다.</p>
          ) : (
            <>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-ink-3">
                {result.changes.length}건 제안
              </p>
              <ul className="space-y-3">
                {result.changes.map((c: ProofChange, i) => (
                  <li key={i} className="rounded-lg border border-line bg-surface p-3">
                    <p className="text-sm leading-relaxed">
                      <span className="text-ink-3 line-through">{c.before}</span>{' '}
                      <span className="font-semibold text-coral-2">{c.after}</span>
                    </p>
                    {c.reason && <p className="mt-1 text-[12px] text-ink-3">{c.reason}</p>}
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
