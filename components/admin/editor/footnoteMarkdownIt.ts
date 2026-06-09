import type MarkdownIt from 'markdown-it'

// 에디터 각주 ↔ 표준 마크다운 왕복의 파싱/직렬화 헬퍼(순수 함수 — 단위 테스트 가능).
//
// 파싱(로드): markdown-it 플러그인이 표준 각주를 처리한다.
//   - 인라인 [^label] → <sup data-footnote-ref data-content="정의내용"></sup>
//   - 블록 [^label]: 내용 → env 에 저장(렌더 안 함). 정의 줄은 에디터에 노출되지 않음.
//   markdown-it 은 블록 파스를 먼저 끝내고 인라인을 렌더하므로, 참조 렌더 시점에 정의가 env 에 모두 존재.
//
// 직렬화(저장): 각주 노드는 SENTINEL 한 글자만 쓰고(이스케이프 없는 state.write),
//   finalizeFootnoteMarkdown 이 문서 순서대로 [^1],[^2]… 로 치환 + 글 끝에 [^n]: 정의를 붙인다.
//   → 표준 마크다운(이스케이프 없이), 읽기 페이지(remark-gfm)가 그대로 렌더.

export const FN_SENTINEL = '' // 사용자가 입력할 일 없는 사적 영역 문자

function escAttr(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

// label 은 공백·']'·개행 불가(표준 각주 라벨 규칙)
export function footnoteMarkdownIt(md: MarkdownIt): void {
  // 인라인 참조 [^label]
  md.inline.ruler.after('emphasis', 'footnote_ref', (state, silent) => {
    const start = state.pos
    const max = state.posMax
    if (state.src.charCodeAt(start) !== 0x5b) return false // [
    if (state.src.charCodeAt(start + 1) !== 0x5e) return false // ^
    let pos = start + 2
    let label = ''
    while (pos < max) {
      const ch = state.src.charCodeAt(pos)
      if (ch === 0x5d) break // ]
      if (ch === 0x20 || ch === 0x0a) return false
      label += state.src[pos]
      pos++
    }
    if (pos >= max || !label) return false // 닫는 ] 없음
    if (!silent) {
      const token = state.push('footnote_ref', '', 0)
      token.meta = { label }
    }
    state.pos = pos + 1
    return true
  })
  md.renderer.rules.footnote_ref = (tokens, idx, _opts, env) => {
    const label = (tokens[idx].meta as { label: string }).label
    const fnEnv = env as { footnotes?: Record<string, string> }
    const content = (fnEnv.footnotes && fnEnv.footnotes[label]) || ''
    return `<sup data-footnote-ref data-content="${escAttr(content)}"></sup>`
  }

  // 블록 정의 [^label]: 내용 (단일 라인)
  md.block.ruler.before(
    'reference',
    'footnote_def',
    (state, startLine, _endLine, silent) => {
      const start = state.bMarks[startLine] + state.tShift[startLine]
      const max = state.eMarks[startLine]
      if (state.src.charCodeAt(start) !== 0x5b) return false // [
      if (state.src.charCodeAt(start + 1) !== 0x5e) return false // ^
      let pos = start + 2
      let label = ''
      while (pos < max && state.src.charCodeAt(pos) !== 0x5d) {
        const ch = state.src.charCodeAt(pos)
        if (ch === 0x20 || ch === 0x0a) return false
        label += state.src[pos]
        pos++
      }
      // ]: 확인
      if (pos + 1 >= max) return false
      if (state.src.charCodeAt(pos) !== 0x5d || state.src.charCodeAt(pos + 1) !== 0x3a) return false
      if (!label) return false
      if (silent) return true
      const content = state.src.slice(pos + 2, max).trim()
      const env = state.env as { footnotes?: Record<string, string> }
      if (!env.footnotes) env.footnotes = {}
      env.footnotes[label] = content
      state.line = startLine + 1
      return true
    },
    { alt: [] }
  )
}

// 본문(센티넬 포함) + 문서 순서 정의 목록 → 표준 각주 마크다운
export function finalizeFootnoteMarkdown(body: string, contents: string[]): string {
  let i = 0
  const numbered = body.replace(new RegExp(FN_SENTINEL, 'g'), () => `[^${++i}]`)
  if (contents.length === 0) return numbered
  const defs = contents.map((c, idx) => `[^${idx + 1}]: ${c}`.trimEnd()).join('\n')
  return numbered.replace(/\s*$/, '') + '\n\n' + defs + '\n'
}
