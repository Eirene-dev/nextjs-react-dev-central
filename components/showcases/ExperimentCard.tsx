import type { ExperimentShowcase } from '@/data/showcasesData'

// 실험(experiment) 카드 — 자체완결 정적 데모. category 는 보조 태그.
// 정직 라벨 한 줄로 "운영 제품이 아니라 mock"임을 분명히 한다.
export default function ExperimentCard({ s }: { s: ExperimentShowcase }) {
  return (
    <a
      href={s.href}
      className="group overflow-hidden rounded-2xl border border-line bg-surface-2 transition hover:-translate-y-1 hover:border-coral-soft hover:shadow-soft"
    >
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
      <div className="p-5">
        <span className="text-[11.5px] font-bold uppercase tracking-wide text-coral-2">
          {s.category}
        </span>
        <h3 className="mt-1 text-lg font-bold tracking-tight text-ink">{s.title}</h3>
        <p className="mt-1 text-sm text-ink-2">{s.blurb}</p>
        {/* 정직 라벨 */}
        <p className="mt-2 text-[11.5px] text-ink-3">Claude Code와 페어로 만든 인터랙티브 mock</p>
        <span className="mt-3 block text-sm font-semibold text-ink-3 group-hover:text-coral-2">
          데모 보기 →
        </span>
      </div>
    </a>
  )
}
