'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import showcasesData, { type Tier } from '@/data/showcasesData'
import ExperimentCard from './ExperimentCard'
import BuiltCard from './BuiltCard'

// 3개 틀로 둘러본다 — 카테고리(도메인)는 카드의 보조 태그로 강등.
type TierFilter = 'all' | Tier
const TIERS: { key: TierFilter; label: string; desc: string }[] = [
  { key: 'all', label: '전체', desc: '' },
  { key: 'built', label: '실물', desc: '직접 만들어 운영 중인 것' },
  { key: 'anatomy', label: '해부', desc: '만들며 내린 결정의 기록' },
  { key: 'experiment', label: '실험', desc: '웹과 AI를 재해석하는 실험' },
]

// 틀별 빈 상태 카피(저자 확정).
const EMPTY: Record<Tier, { title: string; sub?: string }> = {
  built: { title: '직접 만들어 운영 중인 제품들 — 하나씩 채워집니다.' },
  anatomy: { title: '이 사이트를 만들며 부딪힌 결정의 기록 — 준비 중.' },
  experiment: { title: '아직 준비 중입니다.', sub: '곧 더 많은 실험이 추가됩니다.' },
}

export default function ShowcaseGallery() {
  const [active, setActive] = useState<TierFilter>('all')
  const filtered = active === 'all' ? showcasesData : showcasesData.filter((s) => s.tier === active)

  return (
    <div className="py-12">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-ink">Showcases</h1>
        <p className="mt-3 text-ink-2">세 가지 틀로 둘러보세요.</p>
        {/* 3틀 한 줄 소개(저자 확정 카피) */}
        <div className="mx-auto mt-4 flex max-w-2xl flex-col items-center justify-center gap-1.5 text-sm text-ink-3 sm:flex-row sm:gap-5">
          {TIERS.filter((t) => t.desc).map((t) => (
            <span key={t.key}>
              <span className="font-semibold text-ink-2">{t.label}</span> · {t.desc}
            </span>
          ))}
        </div>
      </header>

      <div className="mb-10 flex flex-wrap justify-center gap-2">
        {TIERS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            aria-pressed={active === t.key}
            className={cn(
              'rounded-full border px-4 py-2 text-sm font-semibold transition-colors',
              active === t.key
                ? 'border-coral-2 bg-coral-2 text-white'
                : 'border-line bg-surface-2 text-ink-2 hover:border-coral-soft hover:text-coral-2'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-surface-2 py-20 text-center">
          <p className="text-ink-2">{EMPTY[active as Tier].title}</p>
          {EMPTY[active as Tier].sub && (
            <p className="mt-2 text-sm text-ink-3">{EMPTY[active as Tier].sub}</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5">
          {filtered.map((s) =>
            s.tier === 'experiment' ? (
              <ExperimentCard key={s.slug} s={s} />
            ) : (
              <BuiltCard key={s.slug} s={s} />
            )
          )}
        </div>
      )}
    </div>
  )
}
