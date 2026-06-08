'use client'

import { useEditor, EditorContent, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { Markdown } from 'tiptap-markdown'
import { useEffect } from 'react'

// 에세이 WYSIWYG — 저장 포맷은 마크다운(tiptap-markdown 직렬화/역직렬화).
// 마크다운 get/set 경로를 명확히 분리(4단계 DB 연동에서 그대로 사용):
//   - get: getMarkdown(editor)  → onChange(markdown)
//   - set: 외부 markdown prop → editor.commands.setContent(markdown)  (현재값과 다를 때만)

// tiptap-markdown 의 storage 타입 보강이 v3 에 자동 적용되지 않아 좁혀서 접근.
function getMarkdown(editor: Editor): string {
  const md = (editor.storage as { markdown?: { getMarkdown(): string } }).markdown
  return md ? md.getMarkdown() : ''
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

function Toolbar({ editor }: { editor: Editor }) {
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
    <div className="flex flex-wrap items-center gap-1 overflow-x-auto border-b border-line pb-3">
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
  const editor = useEditor({
    immediatelyRender: false, // app router SSR 하이드레이션 불일치 방지
    extensions: [
      StarterKit.configure({ link: false }), // Link 는 아래 standalone 으로(openOnClick 제어)
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
      }),
      Placeholder.configure({ placeholder: '에세이를 쓰세요 — 서식은 바로 보입니다.' }),
      Markdown.configure({ html: false }), // 마크다운 속 생짜 HTML 비렌더(XSS 방어)
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          'prose max-w-none dark:prose-invert min-h-[420px] focus:outline-none leading-[1.9]',
        'aria-label': '에세이 본문',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(getMarkdown(editor))
    },
  })

  // 외부에서 markdown 을 교체(예: 4단계 DB 로드)할 때만 setContent — 현재값과 같으면 무시(커서 보존)
  useEffect(() => {
    if (!editor) return
    if (value !== getMarkdown(editor)) {
      editor.commands.setContent(value)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editor])

  if (!editor) {
    return <div className="min-h-[470px] rounded-xl border border-line bg-surface" aria-hidden />
  }

  return (
    <div className="mt-3 min-w-0 rounded-xl border border-line bg-surface px-5 py-4">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} className="mt-3 min-w-0" />
    </div>
  )
}
