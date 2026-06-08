'use client'

import { useState } from 'react'
import type { StructureResult } from '@/lib/essay-structure'
import type { AiProvider } from '@/lib/ai/types'
import StructureViz from './StructureViz'

// 구조 탭 — 현재 본문 + 선택 provider 로 /api/essay-structure 호출 → StructureViz 렌더(8단계).
// 결과(result)는 상위(EditorShell)에서 controlled — 탭 전환에도 유지, '초기화'로만 비움.
// 호출/로딩/오류/빈 본문 처리는 유지. basePath 주입 가능(테스트용).
export default function StructurePanel({
  body,
  provider,
  result,
  onResult,
  basePath = '/api/essay-structure',
}: {
  body: string
  provider: AiProvider
  result: StructureResult | null
  onResult: (r: StructureResult | null) => void
  basePath?: string
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const run = async () => {
    if (!body.trim()) {
      setError('분석할 본문이 없습니다.')
      onResult(null)
      return
    }
    setLoading(true)
    setError(null)
    onResult(null)
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
      onResult(data as StructureResult)
    } catch {
      setError('구조 분석 요청 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-4 min-w-0">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={run}
          disabled={loading}
          className="rounded-lg bg-coral-2 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-coral disabled:opacity-50"
        >
          {loading ? '분석 중…' : '구조 분석 실행'}
        </button>
        {result && (
          <button
            type="button"
            onClick={() => onResult(null)}
            className="rounded-lg px-2 py-1.5 text-sm font-medium text-ink-3 hover:text-ink-2"
          >
            초기화
          </button>
        )}
      </div>

      {error && <p className="mt-3 text-sm font-semibold text-coral-2">{error}</p>}

      {result && !error && <StructureViz result={result} />}
    </div>
  )
}
