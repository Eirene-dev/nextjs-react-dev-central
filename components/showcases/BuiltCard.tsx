import type { BuiltShowcase } from '@/data/showcasesData'

// 실물(built) 카드 — 직접 만들어 운영 중인 제품.
// 이름 · 한 줄 설명 · 외부 링크(새 탭) · 스크린샷 자리 · 핵심 판단 3줄.
export default function BuiltCard({ s }: { s: BuiltShowcase }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface-2 transition hover:-translate-y-1 hover:border-coral-soft hover:shadow-soft">
      <div className="aspect-[16/10] overflow-hidden border-b border-line bg-ink/5">
        {s.thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={s.thumb}
            alt={s.title}
            loading="lazy"
            className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          // 스크린샷 자리표시자
          <div className="flex h-full w-full items-center justify-center text-sm text-ink-3">
            스크린샷 준비 중
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className="text-[11.5px] font-bold uppercase tracking-wide text-coral-2">
          {s.category}
        </span>
        <h3 className="mt-1 text-lg font-bold tracking-tight text-ink">{s.title}</h3>
        <p className="mt-1 text-sm text-ink-2">{s.blurb}</p>
        {/* 핵심 판단 3줄 */}
        <ul className="mt-3 space-y-1 text-sm text-ink-2">
          {s.judgments.map((j, i) => (
            <li key={i} className="flex gap-1.5">
              <span aria-hidden className="text-coral-2">
                ·
              </span>
              <span>{j}</span>
            </li>
          ))}
        </ul>
        <a
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1 self-start text-sm font-semibold text-ink-3 transition-colors hover:text-coral-2"
        >
          바로가기 <span aria-hidden>↗</span>
        </a>
      </div>
    </div>
  )
}
