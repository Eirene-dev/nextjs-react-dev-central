import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'

// 방어적 sanitize 허용목록 — defaultSchema(script·iframe·style·이벤트핸들러 차단) 기반.
// 링크 프로토콜은 http/https/mailto 만(javascript:·data: 차단). rehype-raw 미사용(원시 HTML 통과 안 함).
const schema = {
  ...defaultSchema,
  protocols: {
    ...defaultSchema.protocols,
    href: ['http', 'https', 'mailto'],
  },
}

export default function Markdown({ children }: { children: string }) {
  return (
    <div className="board-md">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeSanitize, schema]]}
        components={{
          // 외부 링크는 새 탭 + rel 강제(sanitize 가 href 프로토콜은 이미 제한)
          a: ({ children, href }) => (
            <a href={href} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}
