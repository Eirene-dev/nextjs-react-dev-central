'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

// 본문 각주 마커(¹) 탭 → 작은 팝오버로 해당 주 미리보기(읽던 위치 유지). 커밋 2/2.
// 「주」 섹션은 글 끝에 그대로 둔다 — 팝오버는 보조. "주에서 보기"로 네이티브 점프 가능.
//
// 내용은 이미 서버에서 sanitize 된 <li> DOM 노드를 cloneNode 로 복제해 넣는다
// (HTML 문자열 주입이 아니므로 dangerouslySetInnerHTML 금지 원칙 유지). URL 링크도 그대로 보존.

type PopState = { id: string; top: number; left: number; placeAbove: boolean }

const W = 300 // 팝오버 폭(px)

export default function FootnotePopover() {
  const [pop, setPop] = useState<PopState | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)

  const close = useCallback((restoreFocus = false) => {
    setPop(null)
    if (restoreFocus && triggerRef.current) triggerRef.current.focus()
    triggerRef.current = null
  }, [])

  // 마커에 핸들러 부착(서버 렌더된 각주에 위임)
  useEffect(() => {
    const body = document.querySelector('.essay-body')
    if (!body) return
    const markers = Array.from(
      body.querySelectorAll<HTMLAnchorElement>('sup a[data-footnote-ref]')
    )
    if (!markers.length) return

    const onActivate = (e: Event) => {
      const a = e.currentTarget as HTMLAnchorElement
      e.preventDefault() // 네이티브 점프 억제 → 읽던 위치 유지
      const id = (a.getAttribute('href') || '').slice(1)
      if (!id) return
      const r = a.getBoundingClientRect()
      const vw = window.innerWidth
      const left = Math.max(8, Math.min(r.left, vw - W - 8))
      const placeAbove = r.bottom > window.innerHeight - 200
      triggerRef.current = a
      setPop({ id, top: placeAbove ? r.top : r.bottom, left, placeAbove })
    }
    // 키보드 활성(Enter/Space) — 스크린리더/키보드 사용자
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') onActivate(e)
    }

    markers.forEach((m) => {
      m.setAttribute('aria-haspopup', 'dialog')
      m.addEventListener('click', onActivate)
      m.addEventListener('keydown', onKey)
    })
    return () =>
      markers.forEach((m) => {
        m.removeEventListener('click', onActivate)
        m.removeEventListener('keydown', onKey)
      })
  }, [])

  // 팝오버 내용 채우기 — <li> 복제(되돌아가기 ↩ 제거)
  useEffect(() => {
    const el = contentRef.current
    if (!pop || !el) return
    el.replaceChildren()
    const li = document.getElementById(pop.id)
    if (!li) return
    const clone = li.cloneNode(true) as HTMLElement
    clone.querySelectorAll('[data-footnote-backref]').forEach((n) => n.remove())
    while (clone.firstChild) el.appendChild(clone.firstChild)
    // 포커스 이동(접근성)
    panelRef.current?.focus()
  }, [pop])

  // 바깥 탭 / Esc / 스크롤 / 리사이즈 닫기
  useEffect(() => {
    if (!pop) return
    const onDown = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) close()
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close(true)
    }
    const onScroll = () => close()
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [pop, close])

  const jumpToNote = () => {
    const li = pop && document.getElementById(pop.id)
    close()
    li?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  if (!pop) return null

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-label="각주 미리보기"
      tabIndex={-1}
      style={{
        position: 'fixed',
        top: pop.top,
        left: pop.left,
        width: W,
        maxWidth: 'calc(100vw - 16px)',
        transform: pop.placeAbove ? 'translateY(calc(-100% - 8px))' : 'translateY(8px)',
      }}
      className="z-50 rounded-xl border border-line bg-surface-2 p-3.5 text-[14px] leading-relaxed text-ink-2 shadow-soft outline-none [&_a]:text-coral-2 [&_a]:underline [&_a]:underline-offset-2 [&_p]:m-0 [&_p+p]:mt-2"
    >
      <div ref={contentRef} className="min-w-0 break-words" />
      <div className="mt-2.5 flex justify-end border-t border-line pt-2">
        <button
          type="button"
          onClick={jumpToNote}
          className="text-[12px] font-semibold text-coral-2 hover:text-coral"
        >
          주에서 보기 ↓
        </button>
      </div>
    </div>
  )
}
