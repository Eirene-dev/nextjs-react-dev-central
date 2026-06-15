import type { ReactNode } from 'react'
import Link from '@/components/Link'

// 실험 서사형 내러티브 공유 파츠 — 12종이 인프라(브레드크럼·히어로·CTA·비트 라벨)는 공유하고
// 비트 안무·카피만 슬러그별로 다르게 짠다(CLAUDE.md: 인프라는 공유, 안무는 맞춤).

export function Breadcrumb() {
  return (
    <p className="mb-10 font-mono text-[11.5px] tracking-[0.04em] text-ink-3">
      <Link href="/showcases" className="hover:text-coral-2">
        Showcases <span className="mx-1.5 text-coral-2">/</span> 실험
      </Link>
    </p>
  )
}

// 히어로 — 카테고리 키커 + 헤드라인 + 도입부(children) + 상단 빠른-진입 CTA.
export function Hero({
  kicker,
  headline,
  demoHref,
  title,
  hint = '또는 아래로 — 기법을 먼저 보기 ↓',
  children,
}: {
  kicker: string
  headline: ReactNode
  demoHref: string
  title: string
  hint?: string
  children: ReactNode
}) {
  return (
    <header className="max-w-3xl">
      <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-coral-2">
        {kicker}
      </span>
      <h1 className="mt-4 text-4xl font-extrabold leading-[1.08] tracking-tight text-ink sm:text-6xl">
        {headline}
      </h1>
      {children}
      {/* 상단 빠른 진입 — 설명을 건너뛰고 데모를 바로 실행하고 싶을 때 */}
      <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
        <a
          href={demoHref}
          className="inline-flex items-center gap-2 rounded-full bg-coral-2 px-6 py-3 text-sm font-semibold text-white transition hover:bg-coral"
        >
          {title} 데모 바로 실행 →
        </a>
        <span className="text-sm text-ink-3">{hint}</span>
      </div>
    </header>
  )
}

// 비트 라벨 — 번호 + 기법 이름(가로줄).
export function BeatLabel({ n, name }: { n: string; name: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-sm font-bold text-coral-2">{n}</span>
      <span className="h-px flex-1 bg-line" />
      <span className="font-mono text-xs uppercase tracking-[0.16em] text-ink-3">{name}</span>
    </div>
  )
}

// 하단 CTA — "이 문법이 제품을 만나면?" + 데모 실행.
export function BottomCta({
  demoHref,
  title,
  heading = '이 문법이 제품을 만나면?',
  children,
}: {
  demoHref: string
  title: string
  heading?: string
  children: ReactNode
}) {
  return (
    <section className="mt-16 rounded-3xl border border-line bg-surface-2 px-7 py-16 text-center sm:mt-20 sm:py-20">
      <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">{heading}</h2>
      <p className="mx-auto mt-3 max-w-md text-ink-2">{children}</p>
      <a
        href={demoHref}
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-coral-2 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-coral"
      >
        {title} 데모 실행 →
      </a>
    </section>
  )
}
