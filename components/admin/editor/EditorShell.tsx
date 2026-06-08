'use client'

import { useState } from 'react'
import TipTapEditor from './TipTapEditor'

// 에세이 에디터 — 레이아웃 v2: 에디터 우선, 패널은 온디맨드.
// 기본: 에디터가 메인 전체 폭(가운데 읽기 컬럼). 원칙=좌측 슬라이드 오버레이(겹침),
// 분석=우측 슬라이드 패널(데스크톱 나란히 / 모바일 전체화면 오버레이).
// 오버플로 방지: 그리드 트랙 minmax(0,…)·min-w-0, 오버레이는 overflow-hidden 래퍼로 클리핑.

type AnalysisTab = 'proof' | 'structure'

function PanelTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-[12px] font-bold uppercase tracking-wide text-ink-3">{children}</h2>
}

// 원칙 패널 내용(더미). 실제 시드·추가/수정은 5단계.
function PrinciplesBody() {
  return (
    <div className="mt-3 space-y-4">
      {['작성 원칙', '피할 것', '철학 프레임'].map((h) => (
        <section key={h}>
          <h3 className="text-sm font-bold text-ink">{h}</h3>
          <p className="mt-1 text-[13px] leading-relaxed text-ink-2">
            준비 중 — 원칙 시드는 5단계에서 채워집니다.
          </p>
        </section>
      ))}
    </div>
  )
}

// 분석 패널 내용(탭 UI만). 실제 교정·구조 분석은 6~8단계.
function AnalysisBody({ tab, onTab }: { tab: AnalysisTab; onTab: (t: AnalysisTab) => void }) {
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
      <p className="mt-4 text-sm leading-relaxed text-ink-3">분석 결과가 여기 표시됩니다.</p>
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

export default function EditorShell() {
  const [principlesOpen, setPrinciplesOpen] = useState(false)
  const [analysis, setAnalysis] = useState<AnalysisTab | null>(null) // null = 닫힘
  // 제목·본문(마크다운 소스) — 상태 보관만, 영속화(DB)는 4단계
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  const openAnalysis = (t: AnalysisTab) => setAnalysis((cur) => (cur === t ? null : t))

  return (
    <div className="relative min-w-0">
      {/* 상단 액션 바 — 좌:[원칙] 토글 / 우:[교정][구조] */}
      <div className="flex items-center justify-between gap-2">
        <ActionButton active={principlesOpen} onClick={() => setPrinciplesOpen((v) => !v)}>
          원칙
        </ActionButton>
        <div className="flex gap-1.5">
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
              <AnalysisBody tab={analysis} onTab={setAnalysis} />
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
          <PrinciplesBody />
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
          <AnalysisBody tab={analysis ?? 'proof'} onTab={setAnalysis} />
        </div>
      </div>
    </div>
  )
}
