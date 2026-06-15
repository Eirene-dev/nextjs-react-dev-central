'use client'

import { useState, type ReactNode } from 'react'
import Link from '@/components/Link'
import { cn } from '@/lib/utils'
import showcasesData, {
  type Tier,
  type ExperimentShowcase,
  type BuiltShowcase,
} from '@/data/showcasesData'
import ExperimentCard from './ExperimentCard'
import BuiltCard from './BuiltCard'
import AnatomyCard from '@/components/anatomy/AnatomyCard'
import ScrollSection from '@/components/showcases/scroll/ScrollSection'

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

// '전체' 탭 미리보기: 틀별 섹션에 최대 N개만 노출하고 "전체 보기 →"로 해당 탭 유도.
const SECTION_CAP = 6
const allExperiments = showcasesData.filter((s): s is ExperimentShowcase => s.tier === 'experiment')
const allBuilt = showcasesData.filter((s): s is BuiltShowcase => s.tier === 'built')

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

  // 실험 탭은 카테고리별 섹션으로 묶어 섹션 단위로 가볍게 리빌(카드 스태거 없음).
  // 카테고리 순서 = 배열 첫 등장 순서(= showcasesData 순서: AI×웹 → 스타일 연구 → 웹 플랫폼).
  const experimentItems =
    active === 'experiment'
      ? dataItems.filter((s): s is ExperimentShowcase => s.tier === 'experiment')
      : []
  const experimentCategories = [...new Set(experimentItems.map((s) => s.category))]

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
      ) : active === 'all' ? (
        // 전체 탭: 틀별 섹션 미리보기(각 최대 SECTION_CAP개) + "전체 보기 →". 해부 먼저(정체성) → 실험 → 실물.
        // SSR 기본 탭이라 진입 리빌 없이 정적(플래시 방지).
        <div className="space-y-14">
          {anatomyItems.length > 0 && (
            <SectionBlock label="해부" total={anatomyItems.length} onMore={() => setActive('anatomy')}>
              {anatomyItems.slice(0, SECTION_CAP).map((a) => (
                <AnatomyCard
                  key={a.slug}
                  slug={a.slug}
                  exhibit={a.exhibit}
                  category={a.category}
                  title={a.title}
                  question={a.question}
                />
              ))}
            </SectionBlock>
          )}
          {allExperiments.length > 0 && (
            <SectionBlock label="실험" total={allExperiments.length} onMore={() => setActive('experiment')}>
              {allExperiments.slice(0, SECTION_CAP).map((s) => (
                <ExperimentCard key={s.slug} s={s} />
              ))}
            </SectionBlock>
          )}
          {allBuilt.length > 0 && (
            <SectionBlock label="실물" total={allBuilt.length} onMore={() => setActive('built')}>
              {allBuilt.slice(0, SECTION_CAP).map((s) => (
                <BuiltCard key={s.slug} s={s} />
              ))}
            </SectionBlock>
          )}
        </div>
      ) : active === 'experiment' ? (
        // 실험 탭: 카테고리 섹션별로 진입 리빌(섹션 단위 페이드, 카드 스태거 없음).
        <div className="space-y-14">
          {experimentCategories.map((cat) => {
            const items = experimentItems.filter((s) => s.category === cat)
            return (
              <ScrollSection key={cat}>
                <div className="mb-5 flex items-center gap-3">
                  <h2 className="text-sm font-bold text-ink-2">{cat}</h2>
                  <span className="h-px flex-1 bg-line" />
                  <span className="font-mono text-xs text-ink-3">{items.length}</span>
                </div>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5">
                  {items.map((s) => (
                    <ExperimentCard key={s.slug} s={s} />
                  ))}
                </div>
              </ScrollSection>
            )
          })}
        </div>
      ) : (
        // 전체·해부·실물: 단일 그리드(SSR 기본 탭이라 리빌 없이 정적 — 진입 플래시 방지).
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

// '전체' 탭 틀별 섹션 — 라벨 + 가로줄 + (캡 초과 시) "전체 N 보기 →"(해당 탭으로), 그 아래 카드 그리드.
function SectionBlock({
  label,
  total,
  onMore,
  children,
}: {
  label: string
  total: number
  onMore: () => void
  children: ReactNode
}) {
  return (
    <section>
      <div className="mb-5 flex items-center gap-3">
        <h2 className="text-sm font-bold text-ink-2">{label}</h2>
        <span className="h-px flex-1 bg-line" />
        {total > SECTION_CAP ? (
          <button
            onClick={onMore}
            className="font-mono text-xs text-ink-3 transition-colors hover:text-coral-2"
          >
            전체 {total} 보기 →
          </button>
        ) : (
          <span className="font-mono text-xs text-ink-3">{total}</span>
        )}
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5">{children}</div>
    </section>
  )
}
