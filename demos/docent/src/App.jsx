import { useState } from 'react'
import KeyBar from './KeyBar.jsx'
import { askGrounded, validateCitations } from './gemini.js'
import { runSample } from './sample.js'
import { CORPORA, getCorpus } from './corpora.js'

// 인용 색(주장 칩 ↔ 본문 구절 하이라이트 연결). 인용 인덱스로 hue 분배.
const hueOf = (i) => (i * 67 + 175) % 360
const markStyle = (i, active) => ({
  background: `hsl(${hueOf(i)} 85% ${active ? 80 : 90}%)`,
  borderBottom: `2px solid hsl(${hueOf(i)} 70% 45%)`,
  boxShadow: active ? `0 0 0 3px hsl(${hueOf(i)} 80% 80%)` : 'none',
})
const chipStyle = (i) => ({ color: `hsl(${hueOf(i)} 55% 34%)`, borderColor: `hsl(${hueOf(i)} 60% 62%)` })

// 한 문단을 인용 구절 단위로 쪼개 하이라이트(같은 문단 여러 인용·겹침 처리).
function paraNodes(text, cites, active) {
  const spans = []
  for (const { c, i } of cites) {
    const start = text.indexOf(c.source_quote)
    if (start < 0) continue
    spans.push({ start, end: start + c.source_quote.length, i })
  }
  spans.sort((a, b) => a.start - b.start)
  const nodes = []
  let cur = 0, lastEnd = -1
  for (const s of spans) {
    if (s.start < lastEnd) continue // 겹침 스킵
    if (s.start > cur) nodes.push(text.slice(cur, s.start))
    nodes.push(
      <mark key={s.i} data-cite-idx={s.i} className={`q ${active === s.i ? 'on' : ''}`} style={markStyle(s.i, active === s.i)}>
        {text.slice(s.start, s.end)}
      </mark>
    )
    cur = s.end; lastEnd = s.end
  }
  if (cur < text.length) nodes.push(text.slice(cur))
  return nodes
}

// 근거 안에서만 답하는 Q&A — 답변 + 본문 '구절' 인용(span). 인용 클릭 → 구절 스크롤·강조. 없으면 '없다'(환각 금지).
export default function App() {
  const [mode, setMode] = useState('sample')
  const [apiKey, setApiKey] = useState('')
  const [corpusId, setCorpusId] = useState(CORPORA[0].id)
  const corpus = getCorpus(corpusId)
  const DOC = corpus.doc
  const SAMPLE_QUESTIONS = Object.keys(corpus.samples)
  const [q, setQ] = useState(SAMPLE_QUESTIONS[0])
  const [result, setResult] = useState(null) // {found, answer, citations:[{source_quote, source_id}]}
  const [active, setActive] = useState(null) // 강조 중인 인용 인덱스
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  // 코퍼스 전환 — 활성 doc·답·하이라이트·질문 리셋.
  const switchCorpus = (id) => {
    if (id === corpusId || busy) return
    const next = getCorpus(id)
    setCorpusId(id)
    setQ(Object.keys(next.samples)[0])
    setResult(null); setActive(null); setErr('')
  }

  const jumpTo = (i) => {
    setActive(i)
    const el = document.querySelector(`[data-cite-idx="${i}"]`)
    el && el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const onAnswer = (raw) => {
    const res = validateCitations(raw, DOC) // span 단위 verbatim 검증 + found 강등
    setResult(res)
    setActive(null)
    if (res.found) setTimeout(() => jumpTo(0), 60) // 첫 근거 구절로 스크롤·강조
  }

  const ask = async (question) => {
    if (busy || !question.trim()) return
    setBusy(true); setErr(''); setResult(null); setActive(null)
    try {
      if (mode === 'mykey' && apiKey) onAnswer(await askGrounded({ apiKey, doc: DOC, question }))
      else await runSample(corpus.samples, question, { onAnswer })
    } catch (e) {
      setErr(`${e.message} — 샘플 모드로 시도해 보세요.`)
    } finally {
      setBusy(false)
    }
  }

  const cites = result?.citations || []

  return (
    <div className="app">
      <header className="hero">
        <span className="badge">Docent · AI×웹</span>
        <h1>근거 안에서만 답한다</h1>
        <p>AI가 답하고, 각 근거를 <b>본문의 정확한 구절</b>에 연결합니다. 인용을 누르면 그 구절로 이동해요. 본문에 없으면 “없다”(환각 금지).</p>
        <KeyBar slug="docent" mode={mode} setMode={setMode} apiKey={apiKey} setApiKey={setApiKey} />
        <div className="corpora" role="tablist" aria-label="문서 선택">
          {CORPORA.map((c) => (
            <button key={c.id} role="tab" aria-selected={c.id === corpusId}
              className={c.id === corpusId ? 'on' : ''} onClick={() => switchCorpus(c.id)} disabled={busy}>
              {c.label}
            </button>
          ))}
        </div>
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
              <div className="cites">
                <span className="cl">근거</span>
                {cites.map((c, i) => (
                  <button key={i} className={`citechip ${active === i ? 'on' : ''}`} style={chipStyle(i)} onClick={() => jumpTo(i)}>
                    [{i + 1}] {c.source_id} · “{c.source_quote.length > 16 ? c.source_quote.slice(0, 16) + '…' : c.source_quote}”
                  </button>
                ))}
              </div>
            </>
          ) : (
            <p className="atext">이 문서에는 해당 내용이 없습니다.</p>
          )}
        </section>
      )}

      <main className="doc">
        <h3>{corpus.label}</h3>
        {DOC.map((p) => {
          const pcites = cites.map((c, i) => ({ c, i })).filter((x) => x.c.source_id === p.id)
          return (
            <p key={p.id} className="para">
              <span className="pid">{p.id}</span> {pcites.length ? paraNodes(p.text, pcites, active) : p.text}
            </p>
          )
        })}
      </main>
    </div>
  )
}
