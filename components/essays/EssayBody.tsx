import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSanitize from 'rehype-sanitize'
import { sanitizeSchema } from '@/components/board/Markdown'

// 에세이 본문 — 보드와 동일한 XSS-safe 스택(react-markdown + remark-gfm + rehype-sanitize).
// rehype-raw·dangerouslySetInnerHTML 미사용. 서버 렌더(인터랙션 없음 — 팝오버는 별도 클라이언트).
//
// clobberPrefix:'' — 기본 sanitize 는 id 에 'user-content-' 를 한 번 더 붙여(remark-gfm 이 이미 붙임)
// 각주 마커 href(#user-content-fn-1) 와 항목 id(→user-content-user-content-fn-1) 가 어긋나 점프가 깨진다.
// ''로 두면 remark-gfm 의 접두사만 남아 href↔id 가 일치(네이티브 앵커 점프 동작). 에세이는 관리자 작성물.
const essaySchema = { ...sanitizeSchema, clobberPrefix: '' }

export default function EssayBody({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[[rehypeSanitize, essaySchema]]}
      components={{
        // 내부 앵커(#각주 점프/되돌아가기)는 같은 탭·스무스, 외부 링크만 새 탭.
        a: ({ children, href, ...props }) => {
          const internal = typeof href === 'string' && href.startsWith('#')
          return internal ? (
            <a href={href} {...props}>
              {children}
            </a>
          ) : (
            <a href={href} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          )
        },
        // remark-gfm 의 각주 제목(<h2 class="sr-only">Footnotes</h2>)을 보이는 「주」로 교체.
        // 일반 본문 ## 제목은 그대로 통과.
        h2: ({ children, node, ...props }) => {
          const isFootnoteLabel = node?.properties?.id === 'footnote-label'
          return isFootnoteLabel ? (
            <h2 className="essay-fn-title">주</h2>
          ) : (
            <h2 {...props}>{children}</h2>
          )
        },
      }}
    >
      {children}
    </ReactMarkdown>
  )
}
