'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

const CATEGORIES = ['전체', '정보형', '게시판', '커머스', 'AI 통합', '대시보드'] as const

type Showcase = { title: string; category: string; href: string }
// Phase 3 에서 standalone 데모를 채운다. 지금은 빈/준비 중 상태.
const SHOWCASES: Showcase[] = []

export default function ShowcaseGallery() {
  const [active, setActive] = useState<string>('전체')
  const filtered = active === '전체' ? SHOWCASES : SHOWCASES.filter((s) => s.category === active)

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
          <p className="text-ink-2">쇼케이스를 준비 중입니다.</p>
          <p className="mt-2 text-sm text-ink-3">
            Claude Code로 만든 standalone 데모가 곧 공개됩니다.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(255px,1fr))] gap-5">
          {filtered.map((s) => (
            <a
              key={s.title}
              href={s.href}
              className="overflow-hidden rounded-2xl border border-line bg-surface-2 transition hover:-translate-y-1 hover:border-coral-soft hover:shadow-soft"
            >
              <div className="p-5">
                <span className="text-[11.5px] font-bold uppercase tracking-wide text-coral-2">
                  {s.category}
                </span>
                <h3 className="mt-1 text-lg font-bold tracking-tight text-ink">{s.title}</h3>
                <span className="mt-1 block text-sm font-semibold text-ink-3">데모 보기 →</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
