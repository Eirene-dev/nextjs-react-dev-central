'use client'

import { useEffect, useRef, useState } from 'react'
import { SEED, type PrinciplesData } from '@/lib/essay-principles'

// 원칙 패널 — 3개 섹션 고정, 항목 추가/수정/삭제 + 디바운스 PUT(크로스 디바이스).
// basePath 주입 가능(테스트용). 첫 진입(커스텀 없음)엔 시드 표시.
const DEBOUNCE = 1200

function clone(d: PrinciplesData): PrinciplesData {
  return { sections: d.sections.map((s) => ({ ...s, items: [...s.items] })) }
}

export default function PrinciplesPanel({ basePath = '/api/essay-principles' }: { basePath?: string }) {
  const [data, setData] = useState<PrinciplesData>(() => clone(SEED))
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [editing, setEditing] = useState<{ s: number; i: number } | null>(null)
  const [adding, setAdding] = useState<number | null>(null)
  const [addText, setAddText] = useState('')
  const skipSave = useRef(true)
  const saving = useRef(false)
  const dirty = useRef(false)

  // 로드
  useEffect(() => {
    ;(async () => {
      try {
        const r = await fetch(basePath)
        if (r.ok) {
          const d = await r.json()
          if (d?.sections) {
            skipSave.current = true
            setData(d)
          }
        }
      } catch {
        /* noop — 시드 유지 */
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 디바운스 저장
  useEffect(() => {
    if (skipSave.current) {
      skipSave.current = false
      return
    }
    const t = setTimeout(() => save(data), DEBOUNCE)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  async function save(d: PrinciplesData) {
    if (saving.current) {
      dirty.current = true
      return
    }
    saving.current = true
    setStatus('saving')
    try {
      const r = await fetch(basePath, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(d),
      })
      if (!r.ok) throw new Error()
      setStatus('saved')
    } catch {
      setStatus('error')
    } finally {
      saving.current = false
      if (dirty.current) {
        dirty.current = false
        save(d)
      }
    }
  }

  const mutate = (fn: (d: PrinciplesData) => void) =>
    setData((cur) => {
      const next = clone(cur)
      fn(next)
      return next
    })

  const addItem = (s: number) => {
    const v = addText.trim()
    if (!v) {
      setAdding(null)
      return
    }
    mutate((d) => d.sections[s].items.push(v))
    setAddText('')
    setAdding(null)
  }
  const editItem = (s: number, i: number, v: string) =>
    mutate((d) => {
      const t = v.trim()
      if (t) d.sections[s].items[i] = t
      else d.sections[s].items.splice(i, 1) // 빈 값이면 삭제
    })
  const removeItem = (s: number, i: number) => mutate((d) => d.sections[s].items.splice(i, 1))
  const restore = () => {
    if (!window.confirm('원칙을 기본값으로 되돌릴까요? 현재 편집은 사라집니다.')) return
    setData(clone(SEED)) // skipSave 안 함 → 저장됨
  }

  return (
    <div className="mt-3">
      <div className="mb-2 flex items-center justify-between">
        <span
          className={`text-[11px] ${status === 'error' ? 'font-semibold text-coral-2' : 'text-ink-3'}`}
        >
          {status === 'saving' ? '저장 중…' : status === 'saved' ? '저장됨' : status === 'error' ? '저장 실패' : ''}
        </span>
        <button
          type="button"
          onClick={restore}
          className="text-[11px] font-semibold text-ink-3 underline underline-offset-2 hover:text-ink"
        >
          기본값 복원
        </button>
      </div>

      <div className="space-y-5">
        {data.sections.map((sec, s) => (
          <section key={sec.key}>
            <h3 className="text-sm font-bold text-ink">{sec.label}</h3>
            <ul className="mt-1.5 space-y-1">
              {sec.items.map((item, i) => (
                <li key={i} className="group flex items-start gap-1.5">
                  {editing && editing.s === s && editing.i === i ? (
                    <input
                      autoFocus
                      defaultValue={item}
                      onBlur={(e) => {
                        editItem(s, i, e.target.value)
                        setEditing(null)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') (e.target as HTMLInputElement).blur()
                        if (e.key === 'Escape') setEditing(null)
                      }}
                      className="min-w-0 flex-1 rounded border border-coral-soft bg-surface px-2 py-1 text-[13px] text-ink outline-none"
                    />
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => setEditing({ s, i })}
                        className="min-w-0 flex-1 text-left text-[13px] leading-relaxed text-ink-2 hover:text-ink"
                      >
                        • {item}
                      </button>
                      <button
                        type="button"
                        aria-label="항목 삭제"
                        onClick={() => removeItem(s, i)}
                        className="shrink-0 rounded px-1 text-ink-3 opacity-0 transition-opacity hover:text-coral-2 group-hover:opacity-100"
                      >
                        ✕
                      </button>
                    </>
                  )}
                </li>
              ))}
            </ul>
            {adding === s ? (
              <input
                autoFocus
                value={addText}
                onChange={(e) => setAddText(e.target.value)}
                onBlur={() => addItem(s)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') addItem(s)
                  if (e.key === 'Escape') {
                    setAddText('')
                    setAdding(null)
                  }
                }}
                placeholder="새 항목"
                className="mt-1.5 block w-full min-w-0 rounded border border-coral-soft bg-surface px-2 py-1 text-[13px] text-ink outline-none"
              />
            ) : (
              <button
                type="button"
                onClick={() => {
                  setAddText('')
                  setAdding(s)
                }}
                className="mt-1.5 text-[12px] font-semibold text-coral-2 hover:text-coral"
              >
                + 추가
              </button>
            )}
          </section>
        ))}
      </div>
    </div>
  )
}
