'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import showcasesData from '@/data/showcasesData'

const CATEGORIES = ['전체', '정보형', '게시판', '커머스', 'AI 통합', '대시보드'] as const

export default function ShowcaseGallery() {
  const [active, setActive] = useState<string>('전체')
  const filtered =
    active === '전체' ? showcasesData : showcasesData.filter((s) => s.category === active)

  return (
    <div className="py-12">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-ink">Showcases</h1>
        <p className="mt-3 text-ink-2">직접 만든 웹·AI 데모 — 카테고리로 둘러보세요.</p>
      </header>

      <div className="mb-10 flex flex-wrap justify-center gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            aria-pressed={active === c}
            className={cn(
              'rounded-full border px-4 py-2 text-sm font-semibold transition-colors',
              active === c
                ? 'border-coral-2 bg-coral-2 text-white'
                : 'border-line bg-surface-2 text-ink-2 hover:border-coral-soft hover:text-coral-2'
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-surface-2 py-20 text-center">
          <p className="text-ink-2">이 카테고리는 준비 중입니다.</p>
          <p className="mt-2 text-sm text-ink-3">곧 더 많은 데모가 추가됩니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5">
          {filtered.map((s) => (
            <a
              key={s.slug}
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
                <span className="mt-3 block text-sm font-semibold text-ink-3 group-hover:text-coral-2">
                  데모 보기 →
                </span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
