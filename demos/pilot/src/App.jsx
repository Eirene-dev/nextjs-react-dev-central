import { useRef, useState } from 'react'
import KeyBar from './KeyBar.jsx'
import { callWithTools } from './gemini.js'
import { SAMPLE_COMMANDS, runSample } from './sample.js'

const PRODUCTS = [
  { id: 1, name: '무선 이어버드', price: 89000, cat: '전자제품' },
  { id: 2, name: '머신워시 머그', price: 18000, cat: '주방' },
  { id: 3, name: '메커니컬 키보드', price: 132000, cat: '전자제품' },
  { id: 4, name: '리넨 에이프런', price: 39000, cat: '주방' },
  { id: 5, name: 'USB-C 허브', price: 54000, cat: '전자제품' },
  { id: 6, name: '핸드드립 세트', price: 47000, cat: '주방' },
]

// Gemini function calling 으로 노출할 도구 — 핸들러가 실제 상태를 바꾼다(말로 웹을 움직임).
const TOOLS = [
  { name: 'set_theme', description: '페이지 테마 변경', parameters: { type: 'object', properties: { mode: { type: 'string', enum: ['light', 'dark'] } }, required: ['mode'] } },
  { name: 'sort_by', description: '상품 정렬', parameters: { type: 'object', properties: { field: { type: 'string', enum: ['price', 'name'] }, order: { type: 'string', enum: ['asc', 'desc'] } }, required: ['field', 'order'] } },
  { name: 'filter_category', description: '카테고리 필터(없으면 전체)', parameters: { type: 'object', properties: { category: { type: 'string' } } } },
  { name: 'scroll_to', description: '특정 위치로 스크롤', parameters: { type: 'object', properties: { target: { type: 'string', enum: ['top', 'products'] } }, required: ['target'] } },
]
const SYSTEM =
  '너는 쇼핑 페이지를 조작하는 보조자다. 사용자의 한국어 명령을 제공된 함수 중 하나로 변환해 호출하라. 설명 없이 함수 호출만 한다.'

export default function App() {
  const [theme, setTheme] = useState('light')
  const [sort, setSort] = useState(null) // {field, order}
  const [cat, setCat] = useState(null)
  const [mode, setMode] = useState('sample')
  const [apiKey, setApiKey] = useState('')
  const [input, setInput] = useState('')
  const [log, setLog] = useState([]) // {kind:'cmd'|'tool'|'err', text}
  const [busy, setBusy] = useState(false)
  const productsRef = useRef(null)
  const topRef = useRef(null)

  // 샘플/실키 공유 경로: 모든 실행이 이 핸들러를 탄다.
  const onToolCall = (name, args) => {
    setLog((l) => [...l, { kind: 'tool', text: `${name}(${JSON.stringify(args)})` }])
    if (name === 'set_theme') setTheme(args.mode === 'dark' ? 'dark' : 'light')
    else if (name === 'sort_by') setSort({ field: args.field, order: args.order })
    else if (name === 'filter_category') setCat(args.category || null)
    else if (name === 'scroll_to') {
      const el = args.target === 'top' ? topRef.current : productsRef.current
      el && el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const run = async (text) => {
    if (busy || !text.trim()) return
    setBusy(true)
    setLog((l) => [...l, { kind: 'cmd', text }])
    try {
      if (mode === 'mykey' && apiKey) {
        const call = await callWithTools({ apiKey, system: SYSTEM, user: text, tools: TOOLS })
        onToolCall(call.name, call.args)
      } else {
        await runSample(text, { onToolCall, onError: (e) => setLog((l) => [...l, { kind: 'err', text: e }]) })
      }
    } catch (e) {
      setLog((l) => [...l, { kind: 'err', text: `${e.message} — 샘플 모드로 시도해 보세요.` }])
    } finally {
      setBusy(false)
    }
  }

  let view = PRODUCTS.filter((p) => !cat || p.cat === cat)
  if (sort) view = [...view].sort((a, b) => (sort.field === 'price' ? a.price - b.price : a.name.localeCompare(b.name)) * (sort.order === 'desc' ? -1 : 1))

  return (
    <div className={`app ${theme}`} ref={topRef}>
      <header className="hero">
        <span className="badge">Pilot · AI×웹</span>
        <h1>말로 움직이는 웹</h1>
        <p>아래 명령을 누르면 AI가 <b>function calling</b>으로 페이지를 실제로 바꿉니다. 테마·정렬·필터·스크롤.</p>
        <KeyBar slug="pilot" mode={mode} setMode={setMode} apiKey={apiKey} setApiKey={setApiKey} />
        <div className="cmdbar">
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (run(input), setInput(''))}
            placeholder={mode === 'mykey' ? '명령을 자유롭게 입력…' : '아래 샘플 명령을 눌러보세요'} disabled={busy} aria-label="명령 입력" />
          <button onClick={() => { run(input); setInput('') }} disabled={busy || !input.trim()}>{busy ? '실행 중…' : '실행'}</button>
        </div>
        <div className="chips">
          {SAMPLE_COMMANDS.map((c) => (
            <button key={c.label} onClick={() => run(c.label)} disabled={busy}>{c.label}</button>
          ))}
        </div>
      </header>

      <section className="board">
        <div className="state">
          <span>테마 <b>{theme}</b></span>
          <span>정렬 <b>{sort ? `${sort.field} ${sort.order}` : '없음'}</b></span>
          <span>필터 <b>{cat || '전체'}</b></span>
        </div>
        <div className="products" ref={productsRef}>
          {view.map((p) => (
            <div className="card" key={p.id}>
              <div className="cat">{p.cat}</div>
              <div className="name">{p.name}</div>
              <div className="price">₩ {p.price.toLocaleString('ko-KR')}</div>
            </div>
          ))}
        </div>
      </section>

      {log.length > 0 && (
        <section className="log">
          <h3>실행 로그</h3>
          {log.map((e, i) => (
            <div key={i} className={`logline ${e.kind}`}>{e.kind === 'cmd' ? '🗣' : e.kind === 'err' ? '⚠' : '⚙'} {e.text}</div>
          ))}
        </section>
      )}
    </div>
  )
}
