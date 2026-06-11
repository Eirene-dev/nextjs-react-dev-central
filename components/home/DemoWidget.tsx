'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import Image from 'next/image'
import Link from '@/components/Link'
import { Halo } from '@/components/Motif'

// 홈 챗 위젯 — /api/chat(OpenAI Responses + function calling)에 연결. canned 제거, 멀티턴 유지.
// reply 의 가벼운 마크다운은 안전 토크나이저로 렌더(dangerouslySetInnerHTML 없음). links 는 하단 칩.
const CHIPS = [
  '이 사이트 소개해줘',
  '쇼케이스 보여줘',
  '에세이 추천해줘',
  '어떤 결정들을 기록했어?',
  '책 소개해줘',
]
const GREETING = '안녕하세요 👋 이 사이트가 궁금하신가요? 아래 버튼을 눌러보세요.'
const ERR = '지금은 답변을 드릴 수 없어요. 잠시 후 다시 시도해 주세요.'
const MAX_TURNS = 12
const MAX_LEN = 2000

type ChatLink = { title: string; path: string }
type Msg = { role: 'bot' | 'me'; text: string; links?: ChatLink[] }

// 한 줄 인라인: **굵게** → <strong>, `code` → <code>. (정규식 토크나이즈, 중첩 미지원 — 충분.)
function renderInline(text: string, keyBase: string): ReactNode[] {
  const nodes: ReactNode[] = []
  const re = /\*\*([^*]+)\*\*|`([^`]+)`/g
  let last = 0
  let m: RegExpExecArray | null
  let i = 0
  while ((m = re.exec(text))) {
    if (m.index > last) nodes.push(text.slice(last, m.index))
    if (m[1] !== undefined) nodes.push(<strong key={`${keyBase}-b${i}`}>{m[1]}</strong>)
    else nodes.push(<code key={`${keyBase}-c${i}`}>{m[2]}</code>)
    last = m.index + m[0].length
    i++
  }
  if (last < text.length) nodes.push(text.slice(last))
  return nodes
}

// 줄바꿈(\n) → <br/>. dangerouslySetInnerHTML 없이 React 노드만.
function renderRich(text: string): ReactNode {
  const lines = text.split('\n')
  return lines.map((ln, i) => (
    <span key={i}>
      {renderInline(ln, `l${i}`)}
      {i < lines.length - 1 && <br />}
    </span>
  ))
}

export default function DemoWidget() {
  const [msgs, setMsgs] = useState<Msg[]>([{ role: 'bot', text: GREETING }])
  const [typing, setTyping] = useState(false)
  const [sending, setSending] = useState(false)
  const [input, setInput] = useState('')
  const msgsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = msgsRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [msgs, typing])

  const ask = async (q: string) => {
    const text = q.trim()
    if (!text || sending) return
    const next: Msg[] = [...msgs, { role: 'me', text }]
    setMsgs(next)
    setTyping(true)
    setSending(true)
    // 멀티턴: 최근 12턴, 각 2000자 컷. me→user, bot→assistant.
    const messages = next.slice(-MAX_TURNS).map((m) => ({
      role: m.role === 'me' ? ('user' as const) : ('assistant' as const),
      content: m.text.slice(0, MAX_LEN),
    }))
    try {
      const r = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages }),
      })
      if (!r.ok) throw new Error(`http ${r.status}`)
      const d = await r.json()
      const reply = typeof d?.reply === 'string' && d.reply.trim() ? d.reply : ERR
      const links: ChatLink[] = Array.isArray(d?.links)
        ? d.links.filter((l: ChatLink) => l?.title && l?.path)
        : []
      setMsgs((m) => [...m, { role: 'bot', text: reply, links }])
    } catch {
      setMsgs((m) => [...m, { role: 'bot', text: ERR }])
    } finally {
      setTyping(false)
      setSending(false)
    }
  }

  const send = () => {
    const v = input.trim()
    if (!v || sending) return
    ask(v)
    setInput('')
  }

  return (
    <div className="demo">
      <Halo className="-inset-6" />
      <div className="win">
        <div className="top">
          <Image
            src="/static/Logo_RNC.png"
            alt=""
            width={24}
            height={24}
            className="logo"
            aria-hidden
          />
          <b>RNC Assistant</b>
          <span className="st">
            <i />
            online
          </span>
        </div>
        <div className="msgs" ref={msgsRef}>
          {msgs.map((m, i) => (
            <div key={i} className={`msg ${m.role}`}>
              {renderRich(m.text)}
              {m.role === 'bot' && m.links && m.links.length > 0 && (
                <span className="lnks">
                  {m.links.map((l, j) =>
                    l.path.startsWith('http') ? (
                      <a key={j} href={l.path} target="_blank" rel="noopener noreferrer">
                        {l.title}
                      </a>
                    ) : (
                      <Link key={j} href={`/${l.path}`}>
                        {l.title}
                      </Link>
                    )
                  )}
                </span>
              )}
            </div>
          ))}
          {typing && (
            <div className="typing" aria-label="입력 중">
              <i />
              <i />
              <i />
            </div>
          )}
        </div>
        <div className="chips">
          {CHIPS.map((c) => (
            <button key={c} onClick={() => ask(c)} disabled={sending}>
              {c}
            </button>
          ))}
        </div>
        <div className="inbar">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="무엇이든 물어보세요…"
            aria-label="메시지 입력"
            maxLength={MAX_LEN}
            disabled={sending}
          />
          <button aria-label="send" onClick={send} disabled={sending}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
