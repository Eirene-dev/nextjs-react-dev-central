import { useRef, useState } from 'react'
import KeyBar from './KeyBar.jsx'
import { askGrounded } from './gemini.js'
import { DOC, SAMPLE_QUESTIONS, runSample } from './sample.js'

// 근거 안에서만 답하는 Q&A — 답변 + 근거 문단 하이라이트/스크롤. 없으면 '없다'(환각 금지).
export default function App() {
  const [mode, setMode] = useState('sample')
  const [apiKey, setApiKey] = useState('')
  const [q, setQ] = useState(SAMPLE_QUESTIONS[0])
  const [result, setResult] = useState(null) // {found, answer, source_ids}
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const refs = useRef({})
  const validIds = DOC.map((p) => p.id)

  const onAnswer = (r) => {
    // 환각 id 방지: 실제 존재하는 문단 id 만 채택
    const ids = (r.source_ids || []).filter((id) => validIds.includes(id))
    const res = { found: !!r.found && ids.length > 0, answer: r.answer || '', source_ids: ids }
    setResult(res)
    if (res.found && refs.current[ids[0]]) refs.current[ids[0]].scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const ask = async (question) => {
    if (busy || !question.trim()) return
    setBusy(true); setErr(''); setResult(null)
    try {
      if (mode === 'mykey' && apiKey) onAnswer(await askGrounded({ apiKey, doc: DOC, question }))
      else await runSample(question, { onAnswer })
    } catch (e) {
      setErr(`${e.message} — 샘플 모드로 시도해 보세요.`)
    } finally {
      setBusy(false)
    }
  }

  const hi = result?.source_ids || []

  return (
    <div className="app">
      <header className="hero">
        <span className="badge">Docent · AI×웹</span>
        <h1>근거 안에서만 답한다</h1>
        <p>AI가 문서 본문을 근거로만 답하고 <b>근거 문단을 인용</b>합니다. 본문에 없으면 “없다”고 말합니다(환각 금지).</p>
        <KeyBar slug="docent" mode={mode} setMode={setMode} apiKey={apiKey} setApiKey={setApiKey} />
        <div className="cmdbar">
          <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && ask(q)}
            placeholder="문서에 대해 물어보세요" disabled={busy} aria-label="질문" />
          <button onClick={() => ask(q)} disabled={busy}>{busy ? '찾는 중…' : '질문'}</button>
        </div>
        <div className="chips">
          {SAMPLE_QUESTIONS.map((s) => <button key={s} onClick={() => { setQ(s); ask(s) }} disabled={busy}>{s}</button>)}
        </div>
        {err && <p className="err">⚠ {err}</p>}
      </header>

      {result && (
        <section className={`answer ${result.found ? '' : 'none'}`}>
          {result.found ? (
            <>
              <p className="atext">{result.answer}</p>
              <p className="cite">근거: {result.source_ids.join(', ')}</p>
            </>
          ) : (
            <p className="atext">이 문서에는 해당 내용이 없습니다.</p>
          )}
        </section>
      )}

      <main className="doc">
        <h3>제품 문서 — Nimbus 7</h3>
        {DOC.map((p) => (
          <p key={p.id} ref={(el) => (refs.current[p.id] = el)} className={`para ${hi.includes(p.id) ? 'hit' : ''}`}>
            <span className="pid">{p.id}</span> {p.text}
          </p>
        ))}
      </main>
    </div>
  )
}
