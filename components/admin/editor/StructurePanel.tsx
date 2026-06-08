'use client'

import { useState } from 'react'
import type { StructureResult } from '@/lib/essay-structure'
import type { AiProvider } from '@/lib/ai/types'

// 구조 탭 — 현재 본문 + 선택 provider 로 /api/essay-structure 호출 → 기본 가독 표시.
// 화려한 시각화는 8단계. basePath 주입 가능(테스트용).
const CLARITY: Record<string, string> = { clear: '명확', implicit: '암시적', missing: '없음' }
const PATTERN: Record<string, string> = {
  'concede-weaken': '인정-약화',
  'correct-misunderstanding': '오해-지적',
  none: '없음',
}
const CONC_TYPE: Record<string, string> = {
  definitive: '단정적',
  'open-question': '열린 질문',
  'next-inquiry': '다음 탐구',
}
const FLOW_TYPE: Record<string, string> = {
  claim: '주장',
  evidence: '근거',
  example: '예시',
  transition: '전환',
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-wide text-ink-3">{label}</p>
      <div className="mt-1 text-sm leading-relaxed text-ink-2">{children}</div>
    </div>
  )
}

export default function StructurePanel({
  body,
  provider,
  basePath = '/api/essay-structure',
}: {
  body: string
  provider: AiProvider
  basePath?: string
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<StructureResult | null>(null)

  const run = async () => {
    if (!body.trim()) {
      setError('분석할 본문이 없습니다.')
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
        setError(data?.error || '구조 분석에 실패했습니다.')
        return
      }
      setResult(data as StructureResult)
    } catch {
      setError('구조 분석 요청 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={run}
        disabled={loading}
        className="rounded-lg bg-coral-2 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-coral disabled:opacity-50"
      >
        {loading ? '분석 중…' : '구조 분석 실행'}
      </button>

      {error && <p className="mt-3 text-sm font-semibold text-coral-2">{error}</p>}

      {result && !error && (
        <div className="mt-4 space-y-4">
          <Field label="주제문">
            {result.thesis.found ? (
              <>
                <p className="text-ink">{result.thesis.text || '(요약 없음)'}</p>
                <p className="mt-0.5 text-[12px] text-ink-3">
                  위치: {result.thesis.location || '—'} · 명확도:{' '}
                  {CLARITY[result.thesis.clarity] ?? result.thesis.clarity}
                </p>
              </>
            ) : (
              <span className="text-ink-3">주제문을 찾지 못했습니다.</span>
            )}
          </Field>

          <Field label={`논증 흐름 (${result.argument_flow.length})`}>
            {result.argument_flow.length === 0 ? (
              <span className="text-ink-3">단계를 찾지 못했습니다.</span>
            ) : (
              <ol className="space-y-1">
                {result.argument_flow.map((s, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="shrink-0 font-mono text-[11px] text-ink-3">{s.order}.</span>
                    <span>
                      <span className="mr-1 rounded bg-ink/5 px-1.5 py-0.5 text-[11px] font-semibold text-ink-2">
                        {FLOW_TYPE[s.type] ?? s.type}
                      </span>
                      {s.summary}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </Field>

          <Field label="반론">
            {result.counterargument.addressed ? (
              <>
                <p className="text-ink">
                  패턴: {PATTERN[result.counterargument.pattern] ?? result.counterargument.pattern}
                </p>
                {result.counterargument.summary && (
                  <p className="mt-0.5">{result.counterargument.summary}</p>
                )}
              </>
            ) : (
              <span className="text-ink-3">반론을 다루지 않았습니다.</span>
            )}
          </Field>

          <Field label="결론">
            {result.conclusion.found ? (
              <p>
                {CONC_TYPE[result.conclusion.type] ?? result.conclusion.type} ·{' '}
                {result.conclusion.follows ? '논증에서 따라 나옴' : '논증과 연결 약함'} · 명확도{' '}
                {Math.round(result.conclusion.clarity_score * 100)}%
              </p>
            ) : (
              <span className="text-ink-3">결론을 찾지 못했습니다.</span>
            )}
          </Field>
        </div>
      )}
    </div>
  )
}
