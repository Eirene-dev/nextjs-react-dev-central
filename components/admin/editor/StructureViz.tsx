'use client'

import type { StructureResult } from '@/lib/essay-structure'

// 구조 시각화 — 자족적(나중에 /showcases 추출 대비). 좁은 사이드 패널 폭 세로 레이아웃,
// min-w-0·줄바꿈으로 오버플로 방지. 색 의미는 저채도(좋음=emerald, 부분=amber, 약함=rose).

// 상태 색 — 라이트/다크 대비 확보. 'good' | 'partial' | 'weak'
type Tone = 'good' | 'partial' | 'weak' | 'neutral'
const TONE: Record<Tone, string> = {
  good: 'text-emerald-700 bg-emerald-500/10 dark:text-emerald-300',
  partial: 'text-amber-700 bg-amber-500/12 dark:text-amber-300',
  weak: 'text-rose-700 bg-rose-500/10 dark:text-rose-300',
  neutral: 'text-ink-2 bg-ink/5',
}

const CLARITY: Record<string, { label: string; tone: Tone }> = {
  clear: { label: '명확', tone: 'good' },
  implicit: { label: '암시적', tone: 'partial' },
  missing: { label: '없음', tone: 'weak' },
}
const FLOW: Record<string, { label: string; cls: string }> = {
  claim: { label: '주장', cls: 'text-coral-2 bg-coral/12' },
  evidence: { label: '근거', cls: 'text-ink bg-ink/8' },
  example: { label: '예시', cls: 'text-ink-2 bg-ink/5' },
  transition: { label: '전환', cls: 'text-ink-3 bg-ink/5' },
}
const PATTERN: Record<string, string> = {
  'concede-weaken': '인정 후 약화',
  'correct-misunderstanding': '오해 지적',
  none: '없음',
}
const CONC: Record<string, string> = {
  definitive: '단정',
  'open-question': '열린 질문',
  'next-inquiry': '다음 탐구',
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="min-w-0">
      <h3 className="mb-2 text-[11px] font-bold uppercase tracking-wide text-ink-3">{label}</h3>
      {children}
    </section>
  )
}
function Badge({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  return (
    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${TONE[tone]}`}>
      {children}
    </span>
  )
}
function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-line px-3 py-4 text-center text-sm text-ink-3">
      {children}
    </div>
  )
}

export default function StructureViz({ result }: { result: StructureResult }) {
  const { thesis, argument_flow, counterargument, conclusion } = result
  const flow = [...argument_flow].sort((a, b) => a.order - b.order)
  const score = Math.max(0, Math.min(1, conclusion.clarity_score || 0))
  // 점수 구간별 색: <50% rose · 50–79% amber · ≥80% green
  const barColor = score >= 0.8 ? 'bg-emerald-500' : score >= 0.5 ? 'bg-amber-500' : 'bg-rose-500'

  return (
    <div className="mt-4 min-w-0 space-y-5">
      {/* 명제 */}
      <Section label="명제">
        {thesis.found ? (
          <div className="min-w-0 rounded-xl border border-line bg-surface p-3">
            <div className="flex items-start justify-between gap-2">
              <p className="min-w-0 break-words font-semibold leading-relaxed text-ink">
                {thesis.text || '(요약 없음)'}
              </p>
              <Badge tone={CLARITY[thesis.clarity]?.tone ?? 'neutral'}>
                {CLARITY[thesis.clarity]?.label ?? thesis.clarity}
              </Badge>
            </div>
            {thesis.location && (
              <p className="mt-1.5 font-mono text-[11px] text-ink-3">{thesis.location}</p>
            )}
          </div>
        ) : (
          <Empty>주제문을 찾지 못함</Empty>
        )}
      </Section>

      {/* 논증 흐름 — 세로 타임라인 */}
      <Section label={`논증 흐름 (${flow.length})`}>
        {flow.length === 0 ? (
          <Empty>논증 단계를 찾지 못함</Empty>
        ) : (
          <ol className="relative ml-3 min-w-0 border-l border-line">
            {flow.map((s, i) => {
              const f = FLOW[s.type] ?? { label: s.type, cls: 'text-ink-2 bg-ink/5' }
              return (
                <li key={i} className="relative min-w-0 py-2 pl-5">
                  <span className="absolute -left-[5px] top-3 h-2.5 w-2.5 rounded-full border-2 border-surface bg-coral" />
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-ink-3">{s.order}</span>
                    <span className={`rounded px-1.5 py-0.5 text-[11px] font-semibold ${f.cls}`}>
                      {f.label}
                    </span>
                  </div>
                  <p className="mt-1 min-w-0 break-words text-sm leading-relaxed text-ink-2">
                    {s.summary}
                  </p>
                </li>
              )
            })}
          </ol>
        )}
      </Section>

      {/* 반론 */}
      <Section label="반론">
        {counterargument.addressed ? (
          <div className="min-w-0 rounded-xl border border-line bg-surface p-3">
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
              {PATTERN[counterargument.pattern] ?? counterargument.pattern}
            </span>
            {counterargument.summary && (
              <p className="mt-2 min-w-0 break-words text-sm leading-relaxed text-ink-2">
                {counterargument.summary}
              </p>
            )}
          </div>
        ) : (
          <div className="flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/8 p-3">
            <span aria-hidden className="text-amber-600 dark:text-amber-400">
              ⚠
            </span>
            <p className="min-w-0 text-sm leading-relaxed text-amber-800 dark:text-amber-200">
              반론 미처리 — 반대 관점을 다루면 논증이 강해집니다.
            </p>
          </div>
        )}
      </Section>

      {/* 결론 — 명확도 게이지 */}
      <Section label="결론">
        {conclusion.found ? (
          <div className="min-w-0 rounded-xl border border-line bg-surface p-3">
            <div className="flex items-center gap-2">
              <span className="rounded px-1.5 py-0.5 text-[11px] font-semibold text-ink bg-ink/8">
                {CONC[conclusion.type] ?? conclusion.type}
              </span>
              <span
                className={`text-[11px] font-semibold ${
                  conclusion.follows
                    ? 'text-emerald-700 dark:text-emerald-300'
                    : 'text-rose-700 dark:text-rose-300'
                }`}
              >
                {conclusion.follows ? '논증에서 따라 나옴 ✓' : '논증과 연결 약함 ⚠'}
              </span>
            </div>
            <div className="mt-3">
              <div className="mb-1 flex items-center justify-between text-[11px] text-ink-3">
                <span>명확도</span>
                <span className="font-mono">{Math.round(score * 100)}%</span>
              </div>
              <div
                className="h-2 w-full overflow-hidden rounded-full bg-ink/8"
                role="progressbar"
                aria-valuenow={Math.round(score * 100)}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className={`h-full rounded-full ${barColor}`}
                  style={{ width: `${Math.round(score * 100)}%` }}
                />
              </div>
            </div>
          </div>
        ) : (
          <Empty>결론을 찾지 못함</Empty>
        )}
      </Section>
    </div>
  )
}
