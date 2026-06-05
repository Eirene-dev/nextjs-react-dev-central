'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Halo } from '@/components/Motif'

// homepage-05-final.html 의 mock 챗 위젯을 React 로 이식. canned 응답(외부 호출 없음).
// lab 링크 없음 — 쇼케이스/에세이로 유도.
const ANS: Record<string, string> = {
  '이 사이트 소개해줘':
    'ReactNext Central은 만들고 판단한 것들을 기록하는 곳이에요. 직접 만든 웹·AI 데모(Showcases)와 개인적인 글(Essays)을 모았습니다.',
  '쇼케이스 보여줘':
    '정보형·게시판·커머스·AI 통합 등 다양한 데모를 카테고리별로 둘러볼 수 있어요. 위 Showcases 탭을 확인해보세요!',
  '에세이 추천해줘': '첫 글 「왜 나는 내 기술 블로그를 다시 생각하게 되었는가」부터 읽어보시길 추천해요.',
}
const CHIPS = ['이 사이트 소개해줘', '쇼케이스 보여줘', '에세이 추천해줘']
const FALLBACK =
  '흥미로운 질문이네요! 이건 디자인 데모라 정해진 답만 보여드려요 — 위 Showcases에서 더 둘러보세요!'

type Msg = { role: 'bot' | 'me'; text: string }

export default function DemoWidget() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: 'bot', text: '안녕하세요 👋 이 사이트가 궁금하신가요? 아래 버튼을 눌러보세요.' },
  ])
  const [typing, setTyping] = useState(false)
  const [input, setInput] = useState('')
  const msgsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = msgsRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [msgs, typing])

  const ask = (q: string) => {
    setMsgs((m) => [...m, { role: 'me', text: q }])
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMsgs((m) => [...m, { role: 'bot', text: ANS[q] ?? FALLBACK }])
    }, 850)
  }
  const send = () => {
    const v = input.trim()
    if (!v) return
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
              {m.text}
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
            <button key={c} onClick={() => ask(c)}>
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
          />
          <button aria-label="send" onClick={send}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
