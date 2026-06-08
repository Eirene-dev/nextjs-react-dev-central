'use client'

import { useState } from 'react'

// 에세이 에디터 v1 — 2단계: 레이아웃 셸(3분할 + 모바일). 기능 없음, 구조·플레이스홀더만.
// 데스크톱: [원칙(접이식) | 에디터 | 분석]. 모바일: 에디터 주(전체 폭) + 하단 탭 → 드로어.
// 오버플로 방지: 모든 grid 트랙 minmax(0,…), 입력 요소 min-w-0 (한 칼럼도 min-content 로 못 벌리게).

type Tab = 'write' | 'preview'
type AnalysisTab = 'proof' | 'structure'
type MobilePanel = null | 'principles' | 'analysis'

function PanelCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-w-0 rounded-2xl border border-line bg-surface-2 p-4">{children}</div>
  )
}

function PanelTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[12px] font-bold uppercase tracking-wide text-ink-3">{children}</h2>
  )
}

// 좌 — 원칙 패널 내용(더미). 실제 시드·추가/수정은 5단계.
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

// 우 — 분석 패널 내용(탭 UI만). 실제 교정·구조 분석은 6~8단계.
function AnalysisBody({
  tab,
  onTab,
}: {
  tab: AnalysisTab
  onTab: (t: AnalysisTab) => void
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
      <p className="mt-4 text-sm leading-relaxed text-ink-3">분석 결과가 여기 표시됩니다.</p>
    </>
  )
}

export default function EditorShell() {
  const [leftOpen, setLeftOpen] = useState(true) // 데스크톱 원칙 패널 접기/펴기
  const [tab, setTab] = useState<Tab>('write') // 작성/미리보기(미리보기는 3단계)
  const [analysisTab, setAnalysisTab] = useState<AnalysisTab>('proof')
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>(null) // 모바일 드로어

  return (
    <div className="min-w-0">
      {/* 데스크톱 3분할 — 트랙 전부 minmax(0,…): 어떤 칼럼도 min-content 로 컨테이너를 못 벌림 */}
      <div
        className={`grid min-w-0 gap-4 ${
          leftOpen
            ? 'lg:grid-cols-[minmax(0,240px)_minmax(0,1fr)_minmax(0,300px)]'
            : 'lg:grid-cols-[minmax(0,44px)_minmax(0,1fr)_minmax(0,300px)]'
        }`}
      >
        {/* 좌 — 원칙(접이식, 데스크톱 전용) */}
        <aside className="hidden min-w-0 lg:block">
          {leftOpen ? (
            <PanelCard>
              <div className="flex items-center justify-between">
                <PanelTitle>원칙</PanelTitle>
                <button
                  type="button"
                  onClick={() => setLeftOpen(false)}
                  aria-label="원칙 패널 접기"
                  aria-expanded={leftOpen}
                  className="rounded-md px-1.5 py-0.5 text-ink-3 hover:bg-ink/5 hover:text-ink"
                >
                  «
                </button>
              </div>
              <PrinciplesBody />
            </PanelCard>
          ) : (
            <button
              type="button"
              onClick={() => setLeftOpen(true)}
              aria-label="원칙 패널 펴기"
              aria-expanded={leftOpen}
              className="flex h-full min-h-[120px] w-full items-start justify-center rounded-2xl border border-line bg-surface-2 pt-3 text-ink-3 hover:text-ink"
            >
              »
            </button>
          )}
        </aside>

        {/* 중 — 에디터(주 영역). 저장·마크다운 렌더 없음(3단계) */}
        <main className="min-w-0">
          <div className="min-w-0 rounded-2xl border border-line bg-surface-2 p-4">
            <div className="flex items-center justify-between gap-2">
              <PanelTitle>에디터</PanelTitle>
              <div className="flex gap-1 rounded-lg bg-ink/5 p-1" role="tablist" aria-label="작성/미리보기">
                {(
                  [
                    ['write', '작성'],
                    ['preview', '미리보기'],
                  ] as const
                ).map(([k, label]) => (
                  <button
                    key={k}
                    type="button"
                    role="tab"
                    aria-selected={tab === k}
                    onClick={() => setTab(k)}
                    className={`rounded-md px-3 py-1 text-sm font-semibold transition-colors ${
                      tab === k ? 'bg-surface-2 text-ink shadow-soft' : 'text-ink-3 hover:text-ink-2'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            {tab === 'write' ? (
              <textarea
                placeholder="에세이를 쓰세요 — 저장·렌더는 다음 단계에서."
                aria-label="에세이 본문"
                className="mt-3 block min-h-[420px] w-full min-w-0 resize-y rounded-xl border border-line bg-surface px-4 py-3 font-mono text-sm leading-relaxed text-ink outline-none focus:border-coral-soft"
              />
            ) : (
              <div className="mt-3 flex min-h-[420px] items-center justify-center rounded-xl border border-dashed border-line text-sm text-ink-3">
                미리보기는 다음 단계에서 제공됩니다.
              </div>
            )}
          </div>
        </main>

        {/* 우 — 분석(데스크톱 전용) */}
        <aside className="hidden min-w-0 lg:block">
          <PanelCard>
            <PanelTitle>분석</PanelTitle>
            <AnalysisBody tab={analysisTab} onTab={setAnalysisTab} />
          </PanelCard>
        </aside>
      </div>

      {/* 모바일 — 하단 탭 바(원칙/분석) + 드로어. 작성 중 원칙을 쉽게 열어볼 수 있게. */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface-2 lg:hidden">
        <div className="mx-auto flex max-w-[760px]">
          {(
            [
              ['principles', '원칙'],
              ['analysis', '분석'],
            ] as const
          ).map(([k, label]) => (
            <button
              key={k}
              type="button"
              aria-expanded={mobilePanel === k}
              onClick={() => setMobilePanel((cur) => (cur === k ? null : k))}
              className={`flex-1 py-3 text-sm font-bold transition-colors ${
                mobilePanel === k ? 'text-coral-2' : 'text-ink-2'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      {mobilePanel && (
        <div className="fixed inset-x-0 bottom-[45px] z-40 max-h-[60vh] overflow-y-auto rounded-t-2xl border-t border-line bg-surface-2 p-4 shadow-soft lg:hidden">
          <div className="flex items-center justify-between">
            <PanelTitle>{mobilePanel === 'principles' ? '원칙' : '분석'}</PanelTitle>
            <button
              type="button"
              onClick={() => setMobilePanel(null)}
              aria-label="패널 닫기"
              className="rounded-md px-2 py-0.5 text-ink-3 hover:bg-ink/5 hover:text-ink"
            >
              ✕
            </button>
          </div>
          {mobilePanel === 'principles' ? (
            <PrinciplesBody />
          ) : (
            <AnalysisBody tab={analysisTab} onTab={setAnalysisTab} />
          )}
        </div>
      )}
      {/* 하단 탭 바에 가리지 않게 여백(모바일만) */}
      <div className="h-14 lg:hidden" />
    </div>
  )
}
