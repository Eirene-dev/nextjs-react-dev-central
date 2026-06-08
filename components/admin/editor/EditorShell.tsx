'use client'

import { useEffect, useState } from 'react'
import TipTapEditor from './TipTapEditor'
import { useDrafts, type SaveStatus } from './useDrafts'
import PrinciplesPanel from './PrinciplesPanel'
import ProofreadPanel from './ProofreadPanel'
import { AI_PROVIDERS, DEFAULT_PROVIDER, type AiProvider } from '@/lib/ai/types'

// 에세이 에디터 — 레이아웃 v2: 에디터 우선, 패널은 온디맨드.
// 기본: 에디터가 메인 전체 폭(가운데 읽기 컬럼). 원칙=좌측 슬라이드 오버레이(겹침),
// 분석=우측 슬라이드 패널(데스크톱 나란히 / 모바일 전체화면 오버레이).
// 오버플로 방지: 그리드 트랙 minmax(0,…)·min-w-0, 오버레이는 overflow-hidden 래퍼로 클리핑.

type AnalysisTab = 'proof' | 'structure'

function PanelTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-[12px] font-bold uppercase tracking-wide text-ink-3">{children}</h2>
}

// 분석 패널 — 교정 탭은 실제 동작(ProofreadPanel), 구조 탭은 플레이스홀더(7~8단계).
function AnalysisBody({
  tab,
  onTab,
  body,
  provider,
  onApply,
}: {
  tab: AnalysisTab
  onTab: (t: AnalysisTab) => void
  body: string
  provider: AiProvider
  onApply: (corrected: string) => void
}) {
  return (
    <>
      <div className="mt-3 flex gap-1 rounded-lg bg-ink/5 p-1" role="tablist" aria-label="분석 탭">
        {(
          [
            ['proof', '교정'],
            ['structure', '구조'],
          ] as const
        ).map(([k, label]) => (
          <button
            key={k}
            type="button"
            role="tab"
            aria-selected={tab === k}
            onClick={() => onTab(k)}
            className={`flex-1 rounded-md px-3 py-1.5 text-sm font-semibold transition-colors ${
              tab === k ? 'bg-surface-2 text-ink shadow-soft' : 'text-ink-3 hover:text-ink-2'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      {tab === 'proof' ? (
        <ProofreadPanel body={body} provider={provider} onApply={onApply} />
      ) : (
        <p className="mt-4 text-sm leading-relaxed text-ink-3">분석 결과가 여기 표시됩니다.</p>
      )}
    </>
  )
}

function ActionButton({
  active,
  onClick,
  children,
}: {
  active?: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={!!active}
      className={`rounded-lg border px-3.5 py-1.5 text-sm font-semibold transition-colors ${
        active
          ? 'border-coral-soft bg-coral/10 text-coral-2'
          : 'border-line text-ink-2 hover:border-coral-soft hover:text-ink'
      }`}
    >
      {children}
    </button>
  )
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}
function SaveIndicator({ status, savedAt }: { status: SaveStatus; savedAt: Date | null }) {
  let text = ''
  if (status === 'saving') text = '저장 중…'
  else if (status === 'saved' && savedAt) text = `저장됨 ${pad(savedAt.getHours())}:${pad(savedAt.getMinutes())}`
  else if (status === 'error') text = '저장 실패'
  return (
    <span className={`text-xs ${status === 'error' ? 'font-semibold text-coral-2' : 'text-ink-3'}`}>
      {text}
    </span>
  )
}

export default function EditorShell() {
  const [principlesOpen, setPrinciplesOpen] = useState(false)
  const [analysis, setAnalysis] = useState<AnalysisTab | null>(null) // null = 닫힘
  const [draftMenu, setDraftMenu] = useState(false)
  // AI 제공자 — 전역 1개 선택이 모든 AI 호출에 적용, localStorage 기억(기본 Anthropic)
  const [provider, setProvider] = useState<AiProvider>(DEFAULT_PROVIDER)
  useEffect(() => {
    try {
      const v = localStorage.getItem('essay:aiProvider')
      if (v === 'openai' || v === 'anthropic') setProvider(v)
    } catch {
      /* noop */
    }
  }, [])
  const chooseProvider = (p: AiProvider) => {
    setProvider(p)
    try {
      localStorage.setItem('essay:aiProvider', p)
    } catch {
      /* noop */
    }
  }
  // 제목·본문(마크다운) + 자동저장/드래프트 목록 — DB 영속화(4단계)
  const { draftId, title, setTitle, body, setBody, drafts, status, savedAt, loadDraft, newDraft, deleteDraft } =
    useDrafts()

  const openAnalysis = (t: AnalysisTab) => setAnalysis((cur) => (cur === t ? null : t))
  const fmtTime = (s: string) => {
    const d = new Date(s)
    return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
  }

  return (
    <div className="relative min-w-0">
      {/* 상단 액션 바 — 좌:[원칙]·[드래프트]·저장상태 / 우:[교정][구조] */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <ActionButton active={principlesOpen} onClick={() => setPrinciplesOpen((v) => !v)}>
            원칙
          </ActionButton>
          {/* 드래프트 목록/전환 — 가벼운 드롭다운 */}
          <div className="relative">
            <ActionButton active={draftMenu} onClick={() => setDraftMenu((v) => !v)}>
              드래프트 ▾
            </ActionButton>
            {draftMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setDraftMenu(false)} aria-hidden />
                <div className="absolute left-0 top-full z-50 mt-1 max-h-[60vh] w-[280px] overflow-y-auto rounded-xl border border-line bg-surface-2 p-1.5 shadow-soft">
                  <button
                    type="button"
                    onClick={() => {
                      newDraft()
                      setDraftMenu(false)
                    }}
                    className="block w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-coral-2 hover:bg-ink/5"
                  >
                    + 새 글
                  </button>
                  {drafts.length > 0 && <div className="my-1 border-t border-line" />}
                  {drafts.map((d) => (
                    <div
                      key={d.id}
                      className={`flex items-center gap-1 rounded-lg ${d.id === draftId ? 'bg-coral/10' : 'hover:bg-ink/5'}`}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          loadDraft(d.id)
                          setDraftMenu(false)
                        }}
                        className="min-w-0 flex-1 px-3 py-2 text-left"
                      >
                        <span className="block truncate text-sm text-ink">
                          {d.title.trim() || '(제목 없음)'}
                        </span>
                        <span className="block text-[11px] text-ink-3">{fmtTime(d.updatedAt)}</span>
                      </button>
                      <button
                        type="button"
                        aria-label="드래프트 삭제"
                        onClick={() => {
                          if (window.confirm('이 드래프트를 삭제할까요?')) deleteDraft(d.id)
                        }}
                        className="mr-1 shrink-0 rounded-md px-2 py-1 text-ink-3 hover:bg-ink/10 hover:text-coral-2"
                      >
                        🗑
                      </button>
                    </div>
                  ))}
                  {drafts.length === 0 && (
                    <p className="px-3 py-2 text-xs text-ink-3">저장된 드래프트가 없습니다.</p>
                  )}
                </div>
              </>
            )}
          </div>
          <SaveIndicator status={status} savedAt={savedAt} />
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {/* AI 제공자 선택 — 컴팩트 세그먼트, localStorage 기억. 모든 AI 호출에 적용. */}
          <div
            className="flex items-center rounded-lg border border-line p-0.5"
            role="group"
            aria-label="AI 제공자"
          >
            <span className="px-1.5 text-[11px] font-semibold text-ink-3">AI</span>
            {AI_PROVIDERS.map((p) => (
              <button
                key={p.value}
                type="button"
                aria-pressed={provider === p.value}
                onClick={() => chooseProvider(p.value)}
                className={`rounded-md px-2 py-1 text-xs font-semibold transition-colors ${
                  provider === p.value
                    ? 'bg-coral/10 text-coral-2'
                    : 'text-ink-3 hover:text-ink-2'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <ActionButton active={analysis === 'proof'} onClick={() => openAnalysis('proof')}>
            교정
          </ActionButton>
          <ActionButton active={analysis === 'structure'} onClick={() => openAnalysis('structure')}>
            구조
          </ActionButton>
        </div>
      </div>

      {/* 본문 그리드 — 분석 열림 시에만 우측 트랙 추가(데스크톱). 트랙 minmax(0,…)로 에디터가 줄어듦. */}
      <div
        className={`mt-4 grid min-w-0 gap-4 ${
          analysis
            ? 'lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]'
            : 'lg:grid-cols-[minmax(0,1fr)]'
        }`}
      >
        {/* 에디터(주 영역) — 가운데 읽기 컬럼(max-w) + 좌우 여백 */}
        <main className="min-w-0">
          <div className="mx-auto w-full min-w-0 max-w-[820px]">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목"
              aria-label="제목"
              className="block w-full min-w-0 rounded-xl border border-line bg-surface px-4 py-3 text-lg font-bold tracking-tight text-ink outline-none placeholder:font-normal placeholder:text-ink-3 focus:border-coral-soft"
            />
            {/* 본문 마크다운은 컴포넌트 상태 보관(영속화는 4단계) */}
            <TipTapEditor value={body} onChange={setBody} />
          </div>
        </main>

        {/* 분석 — 데스크톱 나란히(sticky, 세로로 길게, 내부 스크롤) */}
        {analysis && (
          <aside className="hidden min-w-0 lg:block">
            <div className="sticky top-[86px] max-h-[calc(100dvh-104px)] min-w-0 overflow-y-auto rounded-2xl border border-line bg-surface-2 p-4">
              <div className="flex items-center justify-between">
                <PanelTitle>분석</PanelTitle>
                <button
                  type="button"
                  onClick={() => setAnalysis(null)}
                  aria-label="분석 패널 닫기"
                  className="rounded-md px-2 py-0.5 text-ink-3 hover:bg-ink/5 hover:text-ink"
                >
                  ✕
                </button>
              </div>
              <AnalysisBody tab={analysis} onTab={setAnalysis} body={body} provider={provider} onApply={setBody} />
            </div>
          </aside>
        )}
      </div>

      {/* 원칙 — 좌측 슬라이드 오버레이(데스크톱·모바일 공용). overflow-hidden 래퍼로 닫힘 패널 클리핑. */}
      <div
        aria-hidden={!principlesOpen}
        className={`fixed inset-0 z-50 overflow-hidden ${principlesOpen ? '' : 'pointer-events-none'}`}
      >
        <div
          onClick={() => setPrinciplesOpen(false)}
          className={`absolute inset-0 bg-ink/25 transition-opacity duration-200 ${
            principlesOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div
          className={`absolute inset-y-0 left-0 w-[340px] max-w-[88vw] overflow-y-auto border-r border-line bg-surface-2 p-5 shadow-soft transition-transform duration-200 ${
            principlesOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between">
            <PanelTitle>원칙</PanelTitle>
            <button
              type="button"
              onClick={() => setPrinciplesOpen(false)}
              aria-label="원칙 패널 닫기"
              className="rounded-md px-2 py-0.5 text-ink-3 hover:bg-ink/5 hover:text-ink"
            >
              ✕
            </button>
          </div>
          <PrinciplesPanel />
        </div>
      </div>

      {/* 분석 — 모바일 전체화면 오버레이(lg 미만). 데스크톱은 위 aside 사용. */}
      <div
        aria-hidden={!analysis}
        className={`fixed inset-0 z-50 overflow-hidden lg:hidden ${
          analysis ? '' : 'pointer-events-none'
        }`}
      >
        <div
          onClick={() => setAnalysis(null)}
          className={`absolute inset-0 bg-ink/25 transition-opacity duration-200 ${
            analysis ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div
          className={`absolute inset-y-0 right-0 w-full max-w-[440px] overflow-y-auto border-l border-line bg-surface-2 p-5 shadow-soft transition-transform duration-200 ${
            analysis ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between">
            <PanelTitle>분석</PanelTitle>
            <button
              type="button"
              onClick={() => setAnalysis(null)}
              aria-label="분석 패널 닫기"
              className="rounded-md px-2 py-0.5 text-ink-3 hover:bg-ink/5 hover:text-ink"
            >
              ✕
            </button>
          </div>
          <AnalysisBody tab={analysis ?? 'proof'} onTab={setAnalysis} body={body} provider={provider} onApply={setBody} />
        </div>
      </div>
    </div>
  )
}
