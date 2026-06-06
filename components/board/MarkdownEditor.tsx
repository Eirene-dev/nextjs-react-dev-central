'use client'

import { useRef, useState } from 'react'
import Markdown from './Markdown'

type Tool =
  | { key: string; label: string; title: string; kind: 'wrap' | 'block'; a: string; b: string }
  | { key: string; label: string; title: string; kind: 'line'; p: string }
  | { key: string; label: string; title: string; kind: 'link' }

const TOOLS: Tool[] = [
  { key: 'bold', label: 'B', title: '굵게', kind: 'wrap', a: '**', b: '**' },
  { key: 'italic', label: 'I', title: '기울임', kind: 'wrap', a: '_', b: '_' },
  { key: 'strike', label: 'S', title: '취소선', kind: 'wrap', a: '~~', b: '~~' },
  { key: 'code', label: '`', title: '인라인 코드', kind: 'wrap', a: '`', b: '`' },
  { key: 'codeblock', label: '{ }', title: '코드 블록', kind: 'block', a: '```\n', b: '\n```' },
  { key: 'quote', label: '❝', title: '인용', kind: 'line', p: '> ' },
  { key: 'list', label: '•', title: '목록', kind: 'line', p: '- ' },
  { key: 'link', label: '🔗', title: '링크', kind: 'link' },
]

export default function MarkdownEditor({
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  rows?: number
}) {
  const ref = useRef<HTMLTextAreaElement>(null)
  const [tab, setTab] = useState<'write' | 'preview'>('write')

  function apply(t: Tool) {
    const ta = ref.current
    if (!ta) return
    const s = ta.selectionStart
    const e = ta.selectionEnd
    const sel = value.slice(s, e)
    let next = value
    let caret = e

    if (t.kind === 'wrap' || t.kind === 'block') {
      next = value.slice(0, s) + t.a + sel + t.b + value.slice(e)
      caret = e + t.a.length + (sel ? t.b.length : 0)
    } else if (t.kind === 'line') {
      const lineStart = value.lastIndexOf('\n', Math.max(0, s - 1)) + 1
      const block = value.slice(lineStart, e)
      const prefixed = (block || '')
        .split('\n')
        .map((l) => t.p + l)
        .join('\n')
      next = value.slice(0, lineStart) + prefixed + value.slice(e)
      caret = e + (prefixed.length - block.length)
    } else if (t.kind === 'link') {
      const text = sel || '링크텍스트'
      const ins = `[${text}](https://)`
      next = value.slice(0, s) + ins + value.slice(e)
      caret = s + ins.length - 1 // 닫는 괄호 앞(=url 위치)
    }

    onChange(next)
    requestAnimationFrame(() => {
      ta.focus()
      ta.setSelectionRange(caret, caret)
    })
  }

  return (
    <div className="rounded-lg border border-line bg-surface">
      <div className="flex items-center justify-between border-b border-line px-2 py-1.5">
        <div className="flex flex-wrap gap-0.5">
          {TOOLS.map((t) => (
            <button
              key={t.key}
              type="button"
              title={t.title}
              onClick={() => apply(t)}
              className={`flex h-7 min-w-7 items-center justify-center rounded px-1.5 text-[13px] text-ink-2 hover:bg-ink/5 hover:text-ink ${
                t.key === 'bold' ? 'font-extrabold' : t.key === 'italic' ? 'italic' : ''
              } ${t.key === 'strike' ? 'line-through' : ''}`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          {(['write', 'preview'] as const).map((tb) => (
            <button
              key={tb}
              type="button"
              onClick={() => setTab(tb)}
              className={`rounded px-2 py-1 text-xs font-semibold ${
                tab === tb ? 'bg-ink/5 text-ink' : 'text-ink-3 hover:text-ink-2'
              }`}
            >
              {tb === 'write' ? '작성' : '미리보기'}
            </button>
          ))}
        </div>
      </div>

      {tab === 'write' ? (
        <textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          maxLength={4000}
          className="block w-full resize-y bg-transparent px-3 py-2.5 text-sm leading-relaxed text-ink outline-none"
        />
      ) : (
        <div className="min-h-[88px] px-3 py-2.5">
          {value.trim() ? (
            <Markdown>{value}</Markdown>
          ) : (
            <p className="text-sm text-ink-3">미리볼 내용이 없습니다.</p>
          )}
        </div>
      )}
    </div>
  )
}
