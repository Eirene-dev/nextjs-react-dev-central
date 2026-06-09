import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSanitize from 'rehype-sanitize'
import { sanitizeSchema } from '@/components/board/Markdown'

// 에세이 본문 — 보드와 동일한 XSS-safe 스택(react-markdown + remark-gfm + rehype-sanitize,
// 공유 sanitizeSchema). rehype-raw·dangerouslySetInnerHTML 미사용. 서버 렌더(인터랙션 없음).
export default function EssayBody({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[[rehypeSanitize, sanitizeSchema]]}
      components={{
        a: ({ children, href }) => (
          <a href={href} target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  )
}
