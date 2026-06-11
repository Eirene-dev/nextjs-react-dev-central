'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  KBarProvider,
  KBarPortal,
  KBarPositioner,
  KBarAnimator,
  KBarSearch,
  KBarResults,
  useMatches,
  useRegisterActions,
  type Action,
} from 'kbar'

// 사이트 검색 — 헤더 돋보기. 대상 = 에세이(DB) + 해부(velite), 런타임 인덱스(/api/search-index).
// pliny KBarSearchProvider 를 대체(핑크·영문 플레이스홀더가 node_modules 라 커스텀). 사이트 토큰·한글.
// SearchButton(pliny KBarButton)은 kbar 컨텍스트 토글이라 그대로 재사용.

type SearchRecord = {
  type: 'essay' | 'anatomy'
  title: string
  path: string
  date: string
  summary: string
}
type LoadState = 'loading' | 'ready' | 'error'

const SECTION = { essay: '에세이', anatomy: '해부' } as const

// 레코드 → kbar 액션 등록(라우팅은 router.push 로 SPA). KBarProvider 안에서 실행.
function ActionRegistrar({ records }: { records: SearchRecord[] }) {
  const router = useRouter()
  const actions = useMemo<Action[]>(
    () =>
      records.map((r, i) => ({
        id: r.path || `rec-${i}`,
        name: r.title || '(제목 없음)',
        keywords: `${r.summary} ${SECTION[r.type]}`,
        section: SECTION[r.type],
        subtitle: r.summary || '',
        perform: () => router.push('/' + r.path),
      })),
    [records, router]
  )
  useRegisterActions(actions, [actions])
  return null
}

function Results() {
  const { results } = useMatches()
  if (!results.length) {
    return (
      <div className="border-t border-line px-4 py-10 text-center text-sm text-ink-3">
        결과 없음
      </div>
    )
  }
  return (
    <KBarResults
      items={results}
      onRender={({ item, active }) =>
        typeof item === 'string' ? (
          <div className="bg-surface px-4 pb-1.5 pt-4 text-[11px] font-bold uppercase tracking-wider text-coral-2">
            {item}
          </div>
        ) : (
          <div
            className={`flex cursor-pointer flex-col gap-0.5 px-4 py-2.5 ${
              active ? 'bg-coral text-white' : 'bg-transparent text-ink'
            }`}
          >
            <span className="text-sm font-semibold">{item.name}</span>
            {item.subtitle && (
              <span
                className={`line-clamp-1 text-xs ${active ? 'text-white/80' : 'text-ink-3'}`}
              >
                {item.subtitle}
              </span>
            )}
          </div>
        )
      }
    />
  )
}

function SearchModal({ state }: { state: LoadState }) {
  return (
    <KBarPortal>
      <KBarPositioner className="z-50 bg-ink/40 p-4 backdrop-blur-sm">
        <KBarAnimator className="w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-surface-2 shadow-soft">
          <div className="flex items-center gap-3 border-b border-line px-4 py-3.5">
            <svg
              className="h-5 w-5 shrink-0 text-ink-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.2-5.2m0 0a7.5 7.5 0 10-10.6 0 7.5 7.5 0 0010.6 0z" />
            </svg>
            <KBarSearch
              defaultPlaceholder="에세이·해부 검색…"
              className="h-8 w-full bg-transparent text-ink caret-coral outline-none placeholder:text-ink-3"
            />
            <kbd className="hidden rounded border border-line px-1.5 text-[11px] font-medium leading-5 text-ink-3 sm:inline-block">
              ESC
            </kbd>
          </div>
          {state === 'error' ? (
            <div className="px-4 py-10 text-center text-sm text-coral-2">
              검색을 불러오지 못했습니다.
            </div>
          ) : state === 'loading' ? (
            <div className="px-4 py-10 text-center text-sm text-ink-3">불러오는 중…</div>
          ) : (
            <Results />
          )}
        </KBarAnimator>
      </KBarPositioner>
    </KBarPortal>
  )
}

export default function SearchProvider({ children }: { children: React.ReactNode }) {
  const [records, setRecords] = useState<SearchRecord[]>([])
  const [state, setState] = useState<LoadState>('loading')

  useEffect(() => {
    let alive = true
    fetch('/api/search-index', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('http'))))
      .then((d) => {
        if (!alive) return
        setRecords(Array.isArray(d?.records) ? d.records : [])
        setState('ready')
      })
      .catch(() => alive && setState('error'))
    return () => {
      alive = false
    }
  }, [])

  return (
    <KBarProvider>
      <ActionRegistrar records={records} />
      <SearchModal state={state} />
      {children}
    </KBarProvider>
  )
}
