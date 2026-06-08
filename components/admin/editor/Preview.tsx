'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSanitize from 'rehype-sanitize'
import { sanitizeSchema } from '@/components/board/Markdown'

// 에디터 미리보기 — 보드와 동일한 XSS-safe 스택/설정 재사용:
// react-markdown + remark-gfm + rehype-sanitize(보드의 sanitizeSchema 단일 소스).
// rehype-raw·dangerouslySetInnerHTML 금지(원시 HTML 통과 안 함). 스타일은 사이트 prose.
export default function Preview({ title, body }: { title: string; body: string }) {
  return (
    <div className="prose max-w-none dark:prose-invert">
      {title.trim() && <h1>{title}</h1>}
      {body.trim() ? (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[[rehypeSanitize, sanitizeSchema]]}
          components={{
            // 보드와 동일 — 외부 링크 새 탭 + rel 강제(프로토콜은 sanitize 가 제한)
            a: ({ children, href }) => (
              <a href={href} target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            ),
          }}
        >
          {body}
        </ReactMarkdown>
      ) : (
        <p className="text-ink-3">미리볼 본문이 없습니다.</p>
      )}
    </div>
  )
}
