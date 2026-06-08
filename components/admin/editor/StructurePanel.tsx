'use client'

import { useState } from 'react'
import type { StructureResult } from '@/lib/essay-structure'
import type { AiProvider } from '@/lib/ai/types'
import StructureViz from './StructureViz'

// 구조 탭 — 현재 본문 + 선택 provider 로 /api/essay-structure 호출 → StructureViz 렌더(8단계).
// 호출/로딩/오류/빈 본문 처리는 유지. basePath 주입 가능(테스트용).
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
    <div className="mt-4 min-w-0">
      <button
        type="button"
        onClick={run}
        disabled={loading}
        className="rounded-lg bg-coral-2 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-coral disabled:opacity-50"
      >
        {loading ? '분석 중…' : '구조 분석 실행'}
      </button>

      {error && <p className="mt-3 text-sm font-semibold text-coral-2">{error}</p>}

      {result && !error && <StructureViz result={result} />}
    </div>
  )
}
