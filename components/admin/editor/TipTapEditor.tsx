'use client'

import 'css/essay-editor.css'
import { useEditor, EditorContent, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { Markdown } from 'tiptap-markdown'
import { useEffect, useRef, useState } from 'react'
import { Footnote } from './Footnote'
import { finalizeFootnoteMarkdown } from './footnoteMarkdownIt'

// 에세이 WYSIWYG — 저장 포맷은 마크다운(tiptap-markdown 직렬화/역직렬화).
// 마크다운 get/set 경로:
//   - get: getMarkdown(editor) → 본문 + 각주(센티넬을 [^k] 로 치환, 정의를 글 끝에) → onChange
//   - set: 외부 markdown prop → setContent(markdown) (현재값과 다를 때만, 커서 보존)

// tiptap-markdown 의 storage 타입 보강이 v3 에 자동 적용되지 않아 좁혀서 접근.
function rawMarkdown(editor: Editor): string {
  const md = (editor.storage as { markdown?: { getMarkdown(): string } }).markdown
  return md ? md.getMarkdown() : ''
}
// 문서 순서대로 각주 노드의 내용 수집(정의 직렬화에 사용)
function footnoteContents(editor: Editor): string[] {
  const out: string[] = []
  editor.state.doc.descendants((node) => {
    if (node.type.name === 'footnote') out.push((node.attrs.content as string) || '')
  })
  return out
}
function getMarkdown(editor: Editor): string {
  return finalizeFootnoteMarkdown(rawMarkdown(editor), footnoteContents(editor))
}

function ToolbarButton({
  onClick,
  active,
  label,
  children,
}: {
  onClick: () => void
  active?: boolean
  label: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()} // 선택 영역 유지
      onClick={onClick}
      aria-pressed={!!active}
      aria-label={label}
      title={label}
      className={`flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm transition-colors ${
        active ? 'bg-coral/12 font-bold text-coral-2' : 'text-ink-2 hover:bg-ink/5 hover:text-ink'
      }`}
    >
      {children}
    </button>
  )
}

type FnPopover = { pos: number; content: string; top: number; left: number; isNew: boolean }

function Toolbar({ editor, onAddFootnote }: { editor: Editor; onAddFootnote: () => void }) {
  const setLink = () => {
    const prev = editor.getAttributes('link').href as string | undefined
    const url = window.prompt('링크 URL', prev ?? 'https://')
    if (url === null) return // 취소
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  return (
    // 툴바 — 스크롤 영역 밖 상단 고정(본문만 내부 스크롤). bg-surface 로 본문 비침 방지.
    <div className="z-20 flex shrink-0 flex-wrap items-center gap-1 overflow-x-auto rounded-t-2xl border-b border-line bg-surface px-5 py-3">
      <ToolbarButton label="굵게" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
        <b>B</b>
      </ToolbarButton>
      <ToolbarButton label="기울임" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <i>I</i>
      </ToolbarButton>
      <ToolbarButton label="인라인 코드" active={editor.isActive('code')} onClick={() => editor.chain().focus().toggleCode().run()}>
        <span className="font-mono">{'<>'}</span>
      </ToolbarButton>
      <span className="mx-1 h-5 w-px bg-line" aria-hidden />
      <ToolbarButton label="제목(H2)" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        H2
      </ToolbarButton>
      <ToolbarButton label="인용" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        ❝
      </ToolbarButton>
      <ToolbarButton label="불릿 리스트" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        •
      </ToolbarButton>
      <ToolbarButton label="번호 리스트" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        1.
      </ToolbarButton>
      <span className="mx-1 h-5 w-px bg-line" aria-hidden />
      <ToolbarButton label="링크" active={editor.isActive('link')} onClick={setLink}>
        🔗
      </ToolbarButton>
      <ToolbarButton label="각주" active={editor.isActive('footnote')} onClick={onAddFootnote}>
        <span>
          주<sup className="text-[9px]">1</sup>
        </span>
      </ToolbarButton>
    </div>
  )
}

// 각주 내용 편집 팝오버 — 내용(텍스트, URL 포함 가능) + URL(선택) 보조 입력.
function FootnotePopoverEditor({
  init,
  onSave,
  onDelete,
  onCancel,
}: {
  init: FnPopover
  onSave: (content: string) => void
  onDelete: () => void
  onCancel: () => void
}) {
  const [text, setText] = useState(init.content)
  const [url, setUrl] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  const taRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    taRef.current?.focus()
  }, [])
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onCancel()
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [onCancel])

  const save = () => {
    let content = text.trim()
    const u = url.trim()
    if (u && !content.includes(u)) content = (content ? content + ' ' : '') + u
    if (!content) {
      onDelete() // 빈 각주는 삭제
      return
    }
    onSave(content)
  }

  const W = 320
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1024
  const left = Math.max(8, Math.min(init.left, vw - W - 8))

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label="각주 편집"
      style={{ position: 'fixed', top: init.top + 6, left, width: W, maxWidth: 'calc(100vw - 16px)' }}
      className="z-50 rounded-xl border border-line bg-surface-2 p-3 shadow-soft"
    >
      <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-ink-3">각주 내용</p>
      <textarea
        ref={taRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') save()
        }}
        rows={3}
        placeholder="각주 텍스트 (URL 을 직접 적어도 됩니다)"
        className="w-full resize-y rounded-lg border border-line bg-surface px-2.5 py-2 text-sm text-ink outline-none focus:border-coral-soft"
      />
      <p className="mb-1 mt-2 text-[11px] font-bold uppercase tracking-wide text-ink-3">URL (선택)</p>
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') save()
        }}
        placeholder="https://…"
        className="w-full rounded-lg border border-line bg-surface px-2.5 py-1.5 text-sm text-ink outline-none focus:border-coral-soft"
      />
      <div className="mt-2.5 flex items-center justify-between">
        <button
          type="button"
          onClick={onDelete}
          className="rounded-md px-2 py-1 text-[12px] font-semibold text-ink-3 hover:text-coral-2"
        >
          삭제
        </button>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-line px-2.5 py-1 text-[12px] font-semibold text-ink-2 hover:text-ink"
          >
            취소
          </button>
          <button
            type="button"
            onClick={save}
            className="rounded-md bg-coral px-2.5 py-1 text-[12px] font-semibold text-white hover:bg-coral-2"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  )
}

export default function TipTapEditor({
  value,
  onChange,
}: {
  value: string
  onChange: (markdown: string) => void
}) {
  const [fn, setFn] = useState<FnPopover | null>(null)
  const editorRef = useRef<Editor | null>(null) // onActivate 클로저에서 최신 editor 참조

  const editor = useEditor({
    immediatelyRender: false, // app router SSR 하이드레이션 불일치 방지
    extensions: [
      StarterKit.configure({ link: false }), // Link 는 아래 standalone 으로(openOnClick 제어)
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
      }),
      Placeholder.configure({ placeholder: '에세이를 쓰세요 — 서식은 바로 보입니다.' }),
      Footnote.configure({
        onActivate: ({ pos, content }) => {
          // 마커 클릭 → 해당 위치 좌표로 팝오버(재편집)
          const coords = editorRef.current?.view.coordsAtPos(pos)
          setFn({
            pos,
            content,
            top: coords?.bottom ?? 120,
            left: coords?.left ?? 120,
            isNew: false,
          })
        },
      }),
      Markdown.configure({ html: false }), // 마크다운 속 생짜 HTML 비렌더(XSS 방어)
    ],
    content: value,
    editorProps: {
      attributes: {
        // 본문 영역. essay-editor-body: 각주 번호 CSS 카운터 스코프.
        class:
          'essay-editor-body prose max-w-none dark:prose-invert min-h-full focus:outline-none leading-[1.9]',
        'aria-label': '에세이 본문',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(getMarkdown(editor))
    },
  })

  useEffect(() => {
    editorRef.current = editor
  }, [editor])

  // 외부에서 markdown 교체(DB 로드)할 때만 setContent — 현재값과 같으면 무시(커서 보존)
  useEffect(() => {
    if (!editor) return
    if (value !== getMarkdown(editor)) {
      editor.commands.setContent(value)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editor])

  const addFootnote = () => {
    if (!editor) return
    editor.chain().focus().insertFootnote('').run()
    const pos = editor.state.selection.from - 1 // 방금 삽입된 인라인 atom(크기 1)
    const coords = editor.view.coordsAtPos(pos)
    setFn({ pos, content: '', top: coords.bottom, left: coords.left, isNew: true })
  }

  const closeFn = () => setFn(null)
  const saveFn = (content: string) => {
    if (!editor || !fn) return
    editor
      .chain()
      .command(({ tr }) => {
        tr.setNodeMarkup(fn.pos, undefined, { content })
        return true
      })
      .focus()
      .run()
    setFn(null)
  }
  const deleteFn = () => {
    if (!editor || !fn) return
    editor.chain().deleteRange({ from: fn.pos, to: fn.pos + 1 }).focus().run()
    setFn(null)
  }

  if (!editor) {
    return (
      <div className="mt-3 min-h-0 flex-1 rounded-2xl border border-line bg-surface" aria-hidden />
    )
  }

  return (
    // 세로 플렉스: [툴바 고정][본문 flex-1 내부 스크롤]. 부모(컬럼)의 남는 높이를 채움.
    <div className="mt-3 flex min-h-0 min-w-0 flex-1 flex-col rounded-2xl border border-line bg-surface">
      <Toolbar editor={editor} onAddFootnote={addFootnote} />
      <EditorContent editor={editor} className="min-h-0 min-w-0 flex-1 overflow-y-auto px-5 py-5" />
      {fn && (
        <FootnotePopoverEditor
          key={fn.pos}
          init={fn}
          onSave={saveFn}
          onDelete={deleteFn}
          onCancel={closeFn}
        />
      )}
    </div>
  )
}
