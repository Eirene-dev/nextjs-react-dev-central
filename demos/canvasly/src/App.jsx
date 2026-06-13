import { useState } from 'react'
import KeyBar from './KeyBar.jsx'
import { generateComponents } from './gemini.js'
import { SAMPLE_PROMPTS, streamComponents, getSamplePlan } from './sample.js'
import { COMPONENTS, validateComponents } from './components.jsx'

// 스트리밍 Generative UI — AI 가 질문에 맞는 컴포넌트를 골라 components 배열로 반환,
// 앱은 레지스트리(COMPONENTS)로 점진 렌더. 같은 셸, 다른 답마다 다른 UI 조합.
export default function App() {
  const [theme, setTheme] = useState('dark') // 기본 다크(쇼케이스 미감)
  const [mode, setMode] = useState('sample')
  const [apiKey, setApiKey] = useState('')
  const [prompt, setPrompt] = useState(SAMPLE_PROMPTS[0])
  const [sections, setSections] = useState([]) // [{type, props}]
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const onReset = () => setSections([])
  const onSection = (s) => setSections((arr) => [...arr, s])

  const generate = async () => {
    if (busy || !prompt.trim()) return
    setBusy(true); setErr('')
    try {
      const raw = mode === 'mykey' && apiKey ? await generateComponents({ apiKey, prompt }) : getSamplePlan(prompt)
      const comps = validateComponents(raw.components) // 미지 타입·형식 불량 버림
      streamComponents(comps, { onReset, onSection, done: () => setBusy(false) })
    } catch (e) {
      setErr(`${e.message} — 샘플 모드로 시도해 보세요.`)
      setBusy(false)
    }
  }

  return (
    <div className={`app ${theme}`}>
      <button className="themetoggle" onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}>
        {theme === 'dark' ? '☀ 라이트' : '🌙 다크'}
      </button>
      <header className="hero">
        <span className="badge">Canvasly · AI×웹</span>
        <h1>텍스트가 아니라, <span className="g">UI로 답한다</span></h1>
        <p>AI가 질문에 맞는 <b>컴포넌트를 골라</b> 구조화된 JSON으로 내고, 웹은 그것을 레지스트리로 <b>점진 조립</b>합니다.</p>
        <KeyBar slug="canvasly" mode={mode} setMode={setMode} apiKey={apiKey} setApiKey={setApiKey} />
        <div className="cmdbar">
          <input value={prompt} onChange={(e) => setPrompt(e.target.value)} disabled={busy}
            placeholder="무엇이든 물어보세요 (질문에 따라 다른 UI가 나옵니다)" aria-label="요청" />
          <button onClick={generate} disabled={busy}>{busy ? '조립 중…' : '생성'}</button>
        </div>
        <div className="chips">
          {SAMPLE_PROMPTS.map((p) => (
            <button key={p} onClick={() => { setPrompt(p) }} disabled={busy}>{p}</button>
          ))}
        </div>
        {err && <p className="err">⚠ {err}</p>}
      </header>

      <main className="canvas">
        {sections.length === 0 && !busy && <p className="empty">“생성”을 누르면 질문에 맞는 UI가 조립됩니다.</p>}
        {sections.map((s, i) => {
          const entry = COMPONENTS[s.type]
          return entry ? <div key={i}>{entry.render(s.props)}</div> : null
        })}
        {busy && <div className="assembling">조립 중…</div>}
      </main>
    </div>
  )
}
