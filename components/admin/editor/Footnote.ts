import { Node, mergeAttributes } from '@tiptap/core'
import { FN_SENTINEL, footnoteMarkdownIt } from './footnoteMarkdownIt'

// 에디터 각주 노드 — 인라인 atom(위첨자 마커). 내용(content)은 노드 attr 에 보관하고
// 원시 정의 줄([^N]: …)은 에디터에 노출하지 않는다. 번호는 CSS 카운터로 문서 순서 자동 부여
// → 삽입·삭제·순서변경 시 즉시 재번호(JS 불필요).
//
// 저장: markdown.serialize 가 센티넬 한 글자만 출력(이스케이프 없는 state.write).
//   래퍼(TipTapEditor)가 문서 순서로 [^k] 치환 + 정의를 글 끝에 붙임.
// 로드: markdown.parse.setup 이 footnoteMarkdownIt 플러그인 등록 → [^N]/[^N]: 를 노드로 복원.

export type FootnoteActivate = (info: { pos: number; content: string; dom: HTMLElement }) => void

export interface FootnoteOptions {
  onActivate: FootnoteActivate | null
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    footnote: {
      insertFootnote: (content?: string) => ReturnType
    }
  }
}

export const Footnote = Node.create<FootnoteOptions>({
  name: 'footnote',
  group: 'inline',
  inline: true,
  atom: true,
  selectable: true,
  draggable: false,

  addOptions() {
    return { onActivate: null }
  },

  addAttributes() {
    return {
      content: {
        default: '',
        parseHTML: (el) => el.getAttribute('data-content') || '',
        renderHTML: (attrs) => ({ 'data-content': attrs.content }),
      },
    }
  },

  parseHTML() {
    return [{ tag: 'sup[data-footnote-ref]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'sup',
      mergeAttributes(HTMLAttributes, { 'data-footnote-ref': '', class: 'essay-editor-fnref' }),
    ]
  },

  addNodeView() {
    const options = this.options
    return ({ node, getPos }) => {
      const dom = document.createElement('sup')
      dom.className = 'essay-editor-fnref'
      dom.setAttribute('data-footnote-ref', '')
      dom.setAttribute('contenteditable', 'false')
      dom.setAttribute('role', 'button')
      dom.setAttribute('tabindex', '0')
      dom.setAttribute('aria-label', '각주 편집')
      const open = () => {
        if (typeof getPos !== 'function' || !options.onActivate) return
        const pos = getPos()
        if (pos == null) return
        options.onActivate({ pos, content: node.attrs.content || '', dom })
      }
      dom.addEventListener('mousedown', (e) => e.preventDefault())
      dom.addEventListener('click', (e) => {
        e.preventDefault()
        open()
      })
      dom.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          open()
        }
      })
      return { dom }
    }
  },

  addCommands() {
    return {
      insertFootnote:
        (content = '') =>
        ({ chain }) =>
          chain().insertContent({ type: this.name, attrs: { content } }).run(),
    }
  },

  addStorage() {
    return {
      markdown: {
        serialize(state: { write: (s: string) => void }) {
          state.write(FN_SENTINEL)
        },
        parse: {
          setup(md: Parameters<typeof footnoteMarkdownIt>[0]) {
            footnoteMarkdownIt(md)
          },
        },
      },
    }
  },
})

export default Footnote
