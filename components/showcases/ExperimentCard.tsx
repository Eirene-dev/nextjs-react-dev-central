import type { ExperimentShowcase } from '@/data/showcasesData'

// 실험(experiment) 카드 — 자체완결 정적 데모. category 는 보조 태그.
// stretched-link: 카드 전체 = 데모 링크(절대 오버레이). source 있으면 "소스 보기"는 그 위(z)의 독립 링크.
export default function ExperimentCard({ s }: { s: ExperimentShowcase }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-line bg-surface-2 transition hover:-translate-y-1 hover:border-coral-soft hover:shadow-soft">
      {/* 데모로 가는 stretched 링크(카드 전체 클릭) */}
      <a href={s.href} aria-label={`${s.title} 데모 보기`} className="absolute inset-0 z-10" />
      <div className="aspect-[16/10] overflow-hidden border-b border-line bg-ink/5">
        {/* 정적 데모 썸네일 (self-contained 데모 스크린샷) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={s.thumb}
          alt={s.title}
          loading="lazy"
          className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>
      <div className="relative p-5">
        <span className="text-[11.5px] font-bold uppercase tracking-wide text-coral-2">
          {s.category}
        </span>
        <h3 className="mt-1 text-lg font-bold tracking-tight text-ink">{s.title}</h3>
        <p className="mt-1 text-sm text-ink-2">{s.blurb}</p>
        <div className="mt-3 flex items-center gap-4">
          <span className="text-sm font-semibold text-ink-3 group-hover:text-coral-2">데모 보기 →</span>
          {s.source && (
            <a
              href={s.source}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-20 text-sm font-semibold text-ink-3 hover:text-coral-2"
            >
              소스 보기 ↗
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
