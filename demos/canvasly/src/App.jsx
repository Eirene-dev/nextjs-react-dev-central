import { useState } from 'react'
import KeyBar from './KeyBar.jsx'
import { planTrip } from './gemini.js'
import { SAMPLE_PROMPTS, streamPlan, getSamplePlan } from './sample.js'

// 스트리밍 Generative UI — 응답을 섹션 단위로 점진 조립(텍스트 벽이 아니라 카드·타임라인·체크리스트).
export default function App() {
  const [mode, setMode] = useState('sample')
  const [apiKey, setApiKey] = useState('')
  const [prompt, setPrompt] = useState(SAMPLE_PROMPTS[0])
  const [sections, setSections] = useState([])
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const onReset = () => setSections([])
  const onSection = (s) => setSections((arr) => [...arr, s])

  const generate = async () => {
    if (busy || !prompt.trim()) return
    setBusy(true); setErr('')
    try {
      const plan =
        mode === 'mykey' && apiKey ? await planTrip({ apiKey, prompt }) : getSamplePlan(prompt)
      streamPlan(plan, { onReset, onSection, done: () => setBusy(false) })
    } catch (e) {
      setErr(`${e.message} — 샘플 모드로 시도해 보세요.`)
      setBusy(false)
    }
  }

  return (
    <div className="app">
      <header className="hero">
        <span className="badge">Canvasly · AI×웹</span>
        <h1>텍스트가 아니라, <span className="g">UI로 답한다</span></h1>
        <p>AI가 구조화된 JSON을 내고, 웹은 그것을 <b>카드·타임라인·체크리스트</b>로 점진 조립합니다.</p>
        <KeyBar slug="canvasly" mode={mode} setMode={setMode} apiKey={apiKey} setApiKey={setApiKey} />
        <div className="cmdbar">
          <input value={prompt} onChange={(e) => setPrompt(e.target.value)} disabled={busy}
            placeholder="무엇을 계획할까요?" aria-label="요청" />
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
        {sections.length === 0 && !busy && <p className="empty">“생성”을 누르면 여기에 UI가 조립됩니다.</p>}
        {sections.map((s, i) => {
          if (s.kind === 'head') return (
            <div className="sec head pop" key={i}><h2>{s.title}</h2>{s.summary && <p>{s.summary}</p>}</div>
          )
          if (s.kind === 'day') return (
            <div className="sec day pop" key={i}>
              <h3>{s.day}</h3>
              <ul className="timeline">
                {s.items.map((it, j) => (
                  <li key={j}><span className="t">{it.time}</span><span className="p"><b>{it.place}</b>{it.note ? ` · ${it.note}` : ''}</span></li>
                ))}
              </ul>
            </div>
          )
          return (
            <div className="sec check pop" key={i}>
              <h3>준비물</h3>
              <div className="checks">{s.items.map((c, j) => <label key={j}><input type="checkbox" /> {c}</label>)}</div>
            </div>
          )
        })}
        {busy && <div className="assembling">조립 중…</div>}
      </main>
    </div>
  )
}
