'use client'

import { useEffect, useRef, useState } from 'react'
import { useTheme } from 'next-themes'

// 읽기 컨트롤(Aa) — 글씨체·크기·테마. /essays/[slug] 전용.
// 글씨체/크기는 :root 의 CSS 변수(--reading-font/--reading-fs)로 .essay-prose 에 반영 + localStorage 유지.
// 테마는 사이트 전역 next-themes 재사용(별도 상태 없음). FOUC 는 page 의 인라인 스크립트가 선반영.

type FontKey = 'gowun-batang' | 'nanum-myeongjo' | 'pretendard' | 'gowun-dodum'
const FONTS: Record<FontKey, { label: string; group: '명조' | '고딕'; stack: string; href?: string }> = {
  'gowun-batang': { label: '고운바탕', group: '명조', stack: "'Gowun Batang', serif" }, // page 에서 로드
  'nanum-myeongjo': {
    label: '나눔명조',
    group: '명조',
    stack: "'Nanum Myeongjo', serif",
    href: 'https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700&display=swap',
  },
  pretendard: { label: 'Pretendard', group: '고딕', stack: 'Pretendard, sans-serif' }, // 전역 로드
  'gowun-dodum': {
    label: '고운돋움',
    group: '고딕',
    stack: "'Gowun Dodum', sans-serif",
    href: 'https://fonts.googleapis.com/css2?family=Gowun+Dodum&display=swap',
  },
}
const SIZES = [15.5, 17.5, 19.5, 21.5, 24]
const SIZE_LABELS = ['작게', '보통', '크게', '더 크게', '아주 크게']
const FONT_LS = 'essay:readingFont'
const SIZE_LS = 'essay:readingSize'

// 선택 시 비기본 글꼴 <link> 동적 로드(중복 방지)
const loaded = new Set<string>()
function ensureFont(font: FontKey) {
  const href = FONTS[font].href
  if (!href || loaded.has(href) || typeof document === 'undefined') return
  if (document.querySelector(`link[href="${href}"]`)) {
    loaded.add(href)
    return
  }
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = href
  document.head.appendChild(link)
  loaded.add(href)
}

function applyVars(font: FontKey, sizeIdx: number) {
  const d = document.documentElement
  d.style.setProperty('--reading-font', FONTS[font].stack)
  d.style.setProperty('--reading-fs', `${SIZES[sizeIdx]}px`)
}

export default function ReadingControls() {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [font, setFont] = useState<FontKey>('gowun-batang')
  const [sizeIdx, setSizeIdx] = useState(1)
  const { resolvedTheme, setTheme } = useTheme()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    try {
      const f = localStorage.getItem(FONT_LS)
      if (f && f in FONTS) {
        setFont(f as FontKey)
        ensureFont(f as FontKey)
      }
      const s = parseInt(localStorage.getItem(SIZE_LS) || '', 10)
      if (!Number.isNaN(s) && SIZES[s]) setSizeIdx(s)
    } catch {
      /* noop */
    }
  }, [])

  // 바깥 클릭 닫기
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  const chooseFont = (f: FontKey) => {
    ensureFont(f)
    setFont(f)
    applyVars(f, sizeIdx)
    try {
      localStorage.setItem(FONT_LS, f)
    } catch {
      /* noop */
    }
  }
  const changeSize = (next: number) => {
    const idx = Math.max(0, Math.min(SIZES.length - 1, next))
    setSizeIdx(idx)
    applyVars(font, idx)
    try {
      localStorage.setItem(SIZE_LS, String(idx))
    } catch {
      /* noop */
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="읽기 설정"
        aria-expanded={open}
        className="flex h-9 items-center gap-1 rounded-lg border border-line px-3 text-ink-2 transition-colors hover:border-coral-soft hover:text-ink"
      >
        <span className="text-[15px] font-bold">A</span>
        <span className="text-[11px] font-bold">a</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[260px] rounded-xl border border-line bg-surface-2 p-3 shadow-soft">
          {/* 글씨체 */}
          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-ink-3">글씨체</p>
          {(['명조', '고딕'] as const).map((group) => (
            <div key={group} className="mb-2">
              <p className="mb-1 text-[10px] font-semibold text-ink-3">{group}</p>
              <div className="flex gap-1.5">
                {(Object.keys(FONTS) as FontKey[])
                  .filter((k) => FONTS[k].group === group)
                  .map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => chooseFont(k)}
                      aria-pressed={font === k}
                      style={{ fontFamily: FONTS[k].stack }}
                      className={`flex-1 rounded-lg border px-2 py-1.5 text-sm transition-colors ${
                        font === k
                          ? 'border-coral-soft bg-coral/10 text-coral-2'
                          : 'border-line text-ink-2 hover:text-ink'
                      }`}
                    >
                      {FONTS[k].label}
                    </button>
                  ))}
              </div>
            </div>
          ))}

          {/* 크기 */}
          <p className="mb-1.5 mt-3 text-[11px] font-bold uppercase tracking-wide text-ink-3">크기</p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => changeSize(sizeIdx - 1)}
              disabled={sizeIdx === 0}
              aria-label="작게"
              className="h-8 w-9 rounded-lg border border-line text-sm font-bold text-ink-2 hover:text-ink disabled:opacity-40"
            >
              가−
            </button>
            <span className="flex-1 text-center text-[13px] font-semibold text-ink">
              {SIZE_LABELS[sizeIdx]}
            </span>
            <button
              type="button"
              onClick={() => changeSize(sizeIdx + 1)}
              disabled={sizeIdx === SIZES.length - 1}
              aria-label="크게"
              className="h-8 w-9 rounded-lg border border-line text-base font-bold text-ink-2 hover:text-ink disabled:opacity-40"
            >
              가＋
            </button>
          </div>

          {/* 테마 — 사이트 전역 next-themes 재사용 */}
          {mounted && (
            <>
              <p className="mb-1.5 mt-3 text-[11px] font-bold uppercase tracking-wide text-ink-3">
                테마
              </p>
              <div className="flex gap-1.5">
                {(
                  [
                    ['light', '라이트'],
                    ['dark', '다크'],
                  ] as const
                ).map(([val, label]) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setTheme(val)}
                    aria-pressed={resolvedTheme === val}
                    className={`flex-1 rounded-lg border px-2 py-1.5 text-sm font-semibold transition-colors ${
                      resolvedTheme === val
                        ? 'border-coral-soft bg-coral/10 text-coral-2'
                        : 'border-line text-ink-2 hover:text-ink'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
