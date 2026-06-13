import { useMemo, useState } from 'react'
import KeyBar from './KeyBar.jsx'
import { fillForm, validateExtractions } from './gemini.js'
import { streamFill, getSampleParse } from './sample.js'
import { DOMAINS, getDomain } from './domains.js'

// 필드별 색(근거 하이라이트 ↔ 배지 연결). 도메인 fields 인덱스로 hue 분배.
const hueAt = (idx) => (idx * 36 + 200) % 360
const markStyle = (hue) => ({ background: `hsl(${hue} 80% 92%)`, borderBottom: `2px solid hsl(${hue} 65% 45%)` })
const badgeStyle = (hue) => ({ color: `hsl(${hue} 60% 38%)` })

// 입력 문장 위에 현재까지 채워진 필드의 source 구절을 하이라이트(겹치면 먼저 온 것 우선).
function HighlightedSentence({ sentence, sources, active, hueByField }) {
  const spans = []
  for (const [field, source] of Object.entries(sources)) {
    if (!source) continue
    const start = sentence.indexOf(source)
    if (start < 0) continue
    spans.push({ field, source, start, end: start + source.length })
  }
  spans.sort((a, b) => a.start - b.start)
  const nodes = []
  let cursor = 0
  let lastEnd = -1
  for (const s of spans) {
    if (s.start < lastEnd) continue
    if (s.start > cursor) nodes.push(sentence.slice(cursor, s.start))
    nodes.push(
      <mark key={s.field} className={`srcmark ${active === s.field ? 'active' : ''}`} style={markStyle(hueByField[s.field])}>
        {sentence.slice(s.start, s.end)}
      </mark>
    )
    cursor = s.end
    lastEnd = s.end
  }
  if (cursor < sentence.length) nodes.push(sentence.slice(cursor))
  return <p className="srcsentence">{nodes}</p>
}

// 자연어 한 줄 → 폼 필드 순차 채움 + 근거 구절 문장 하이라이트(동기). 도메인 전환 지원.
export default function App() {
  const [mode, setMode] = useState('sample')
  const [apiKey, setApiKey] = useState('')
  const [domainId, setDomainId] = useState(DOMAINS[0].id)
  const domain = getDomain(domainId)
  const fields = domain.fields
  const empty = useMemo(() => Object.fromEntries(fields.map((f) => [f.key, ''])), [domainId])
  const hueByField = useMemo(() => Object.fromEntries(fields.map((f, i) => [f.key, hueAt(i)])), [domainId])

  const [sentence, setSentence] = useState(DOMAINS[0].samples[0].sentence)
  const [form, setForm] = useState(empty)
  const [filled, setFilled] = useState({})
  const [sources, setSources] = useState({}) // field → 검증 통과 source(또는 null)
  const [runSentence, setRunSentence] = useState('')
  const [active, setActive] = useState(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  // 도메인 전환 — fields/프롬프트/샘플 교체 + 폼·문장·하이라이트 리셋.
  const switchDomain = (id) => {
    if (id === domainId || busy) return
    const d = getDomain(id)
    setDomainId(id)
    setSentence(d.samples[0].sentence)
    setForm(Object.fromEntries(d.fields.map((f) => [f.key, ''])))
    setFilled({}); setSources({}); setRunSentence(''); setActive(''); setErr('')
  }

  const onField = (k, v, source) => {
    setForm((f) => ({ ...f, [k]: String(v) }))
    setFilled((s) => ({ ...s, [k]: true }))
    setSources((s) => ({ ...s, [k]: source || null }))
    setActive(k)
    setTimeout(() => setFilled((s) => ({ ...s, [k]: false })), 700)
  }

  const run = async () => {
    if (busy || !sentence.trim()) return
    setBusy(true); setErr(''); setForm(empty); setFilled({}); setSources({}); setActive(null)
    setRunSentence(sentence)
    try {
      const raw = mode === 'mykey' && apiKey
        ? await fillForm({ apiKey, sentence, fields, systemPrompt: domain.systemPrompt })
        : getSampleParse(domain, sentence)
      const items = validateExtractions(raw, sentence, fields)
      streamFill(items, { onField, done: () => { setBusy(false); setActive(null) } })
    } catch (e) {
      setErr(`${e.message} — 샘플 모드로 시도해 보세요.`)
      setBusy(false)
    }
  }

  return (
    <div className="app">
      <header className="hero">
        <span className="badge">Formig · AI×웹</span>
        <h1>한 줄이면, 폼이 채워진다</h1>
        <p>문장을 쓰면 AI가 구조화해 <b>필드를 차례로</b> 채우고, <b>어느 구절에서 왔는지</b>를 문장 위에 보여줍니다.</p>
        <KeyBar slug="formig" mode={mode} setMode={setMode} apiKey={apiKey} setApiKey={setApiKey} />
        <div className="domains" role="tablist" aria-label="도메인 선택">
          {DOMAINS.map((d) => (
            <button key={d.id} role="tab" aria-selected={d.id === domainId}
              className={d.id === domainId ? 'on' : ''} onClick={() => switchDomain(d.id)} disabled={busy}>
              {d.label}
            </button>
          ))}
        </div>
        <div className="cmdbar">
          <input value={sentence} onChange={(e) => setSentence(e.target.value)} disabled={busy}
            placeholder="자연어 한 줄을 입력하세요" aria-label="입력 문장" />
          <button onClick={run} disabled={busy}>{busy ? '채우는 중…' : '채우기'}</button>
        </div>
        <div className="chips">
          {domain.samples.map((s) => (
            <button key={s.sentence} onClick={() => setSentence(s.sentence)} disabled={busy} title={s.sentence}>
              {s.sentence.length > 22 ? s.sentence.slice(0, 22) + '…' : s.sentence}
            </button>
          ))}
        </div>
        {err && <p className="err">⚠ {err}</p>}
      </header>

      <main className="formwrap">
        {runSentence && (
          <div className="srcbox">
            <span className="srclabel">입력 문장 · 색칠된 구절이 아래 필드의 근거입니다</span>
            <HighlightedSentence sentence={runSentence} sources={sources} active={active} hueByField={hueByField} />
          </div>
        )}
        <form className="resform" onSubmit={(e) => e.preventDefault()}>
          {fields.map((f) => (
            <label key={f.key} className={`field ${filled[f.key] ? 'just' : ''}`}>
              <span className="fl">
                {f.label}
                {sources[f.key] && <span className="srcbadge" style={badgeStyle(hueByField[f.key])}>← ‘{sources[f.key]}’</span>}
              </span>
              {f.type === 'select' ? (
                <select value={form[f.key]} onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}>
                  {f.opts.map((o) => <option key={o} value={o}>{o || '선택'}</option>)}
                </select>
              ) : (
                <input type={f.type} value={form[f.key]} placeholder={f.ph || ''}
                  onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))} />
              )}
            </label>
          ))}
          <button className="submit" type="submit">제출</button>
        </form>
      </main>
    </div>
  )
}
