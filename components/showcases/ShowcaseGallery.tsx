'use client'

import { useState } from 'react'
import Link from '@/components/Link'
import { cn } from '@/lib/utils'
import showcasesData, { type Tier } from '@/data/showcasesData'
import ExperimentCard from './ExperimentCard'
import BuiltCard from './BuiltCard'
import AnatomyCard from '@/components/anatomy/AnatomyCard'

// 해부 카드 데이터(빌드 타임 anatomy 컬렉션에서 서버 페이지가 전달 — 클라이언트엔 평문 prop).
export type AnatomyCardData = {
  slug: string
  exhibit: number
  category: string
  title: string
  question: string
}

// 3개 틀로 둘러본다 — 카테고리(도메인)는 카드의 보조 태그로 강등.
type TierFilter = 'all' | Tier
// 노출 순서: 해부 우선(이 사이트 정체성 = 판단의 기록) → 실험 → 실물.
const TIERS: { key: TierFilter; label: string; desc: string }[] = [
  { key: 'all', label: '전체', desc: '' },
  { key: 'anatomy', label: '해부', desc: '만들며 내린 결정의 기록' },
  { key: 'experiment', label: '실험', desc: '웹과 AI를 재해석하는 실험' },
  { key: 'built', label: '실물', desc: '직접 만들어 운영 중인 것' },
]

// '전체' 탭 tier 우선순위(해부는 anatomyItems 로 먼저 렌더 — 실험 > 실물).
const TIER_RANK: Record<Tier, number> = { anatomy: 0, experiment: 1, built: 2 }

// 틀별 빈 상태 카피(저자 확정).
const EMPTY: Record<Tier, { title: string; sub?: string }> = {
  built: { title: '직접 만들어 운영 중인 제품들 — 하나씩 채워집니다.' },
  anatomy: { title: '이 사이트를 만들며 부딪힌 결정의 기록 — 준비 중.' },
  experiment: { title: '아직 준비 중입니다.', sub: '곧 더 많은 실험이 추가됩니다.' },
}

export default function ShowcaseGallery({ anatomy = [] }: { anatomy?: AnatomyCardData[] }) {
  const [active, setActive] = useState<TierFilter>('all')

  // built/experiment 데이터(showcasesData) + anatomy(컬렉션) 를 틀 기준으로 합친다.
  // '전체'에선 tier 우선순위(실험 > 실물)로 정렬 — 해부는 anatomyItems 로 먼저 렌더.
  const dataItems =
    active === 'all'
      ? [...showcasesData].sort((a, b) => TIER_RANK[a.tier] - TIER_RANK[b.tier])
      : active === 'anatomy'
        ? []
        : showcasesData.filter((s) => s.tier === active)
  const anatomyItems = active === 'all' || active === 'anatomy' ? anatomy : []
  const empty = dataItems.length + anatomyItems.length === 0
  const showCrossLink = active === 'experiment' && anatomy.some((a) => a.slug === 'demo-isolation')

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

      {empty ? (
        <div className="rounded-2xl border border-dashed border-line bg-surface-2 py-20 text-center">
          <p className="text-ink-2">{EMPTY[active as Tier].title}</p>
          {EMPTY[active as Tier].sub && (
            <p className="mt-2 text-sm text-ink-3">{EMPTY[active as Tier].sub}</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5">
          {/* 해부 우선 노출(정체성) → 실험 → 실물 */}
          {anatomyItems.map((a) => (
            <AnatomyCard
              key={a.slug}
              slug={a.slug}
              exhibit={a.exhibit}
              category={a.category}
              title={a.title}
              question={a.question}
            />
          ))}
          {dataItems.map((s) =>
            s.tier === 'experiment' ? (
              <ExperimentCard key={s.slug} s={s} />
            ) : (
              <BuiltCard key={s.slug} s={s} />
            )
          )}
        </div>
      )}

      {/* 실험 → 해부 크로스링크(1줄) */}
      {showCrossLink && (
        <p className="mt-8 text-center text-sm text-ink-3">
          이 데모들의 격리 결정 →{' '}
          <Link
            href="/showcases/anatomy/demo-isolation"
            className="font-semibold text-coral-2 underline underline-offset-[3px] hover:text-coral"
          >
            해부 01
          </Link>
        </p>
      )}
    </div>
  )
}
