import { useState } from 'react'
import KeyBar from './KeyBar.jsx'
import { fillForm, validateExtractions, FIELD_KEYS } from './gemini.js'
import { SAMPLE_SENTENCES, streamFill, getSampleParse } from './sample.js'

const FIELDS = [
  { k: 'date', label: '날짜', type: 'text', ph: 'YYYY-MM-DD / 요일' },
  { k: 'time', label: '시간', type: 'text', ph: 'HH:MM' },
  { k: 'adults', label: '성인', type: 'number' },
  { k: 'children', label: '아동', type: 'number' },
  { k: 'seat', label: '좌석', type: 'select', opts: ['', '창가', '룸', '일반', '바'] },
  { k: 'course', label: '코스', type: 'select', opts: ['', '런치', '디너 A', '디너 B', '미정'] },
  { k: 'allergy', label: '알레르기', type: 'text', ph: '예: 땅콩' },
  { k: 'name', label: '예약자', type: 'text' },
  { k: 'phone', label: '연락처', type: 'text' },
  { k: 'request', label: '요청사항', type: 'text' },
]
const EMPTY = Object.fromEntries(FIELDS.map((f) => [f.k, '']))

// 필드별 색(근거 하이라이트 ↔ 배지 연결). FIELD_KEYS 인덱스로 hue 분배.
const hueOf = (field) => (FIELD_KEYS.indexOf(field) * 36 + 200) % 360
const markStyle = (field) => ({ background: `hsl(${hueOf(field)} 80% 92%)`, borderBottom: `2px solid hsl(${hueOf(field)} 65% 45%)` })
const badgeStyle = (field) => ({ color: `hsl(${hueOf(field)} 60% 38%)` })

// 입력 문장 위에 현재까지 채워진 필드의 source 구절을 하이라이트(겹치면 먼저 온 것 우선).
function HighlightedSentence({ sentence, sources, active }) {
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
    if (s.start < lastEnd) continue // 겹침 스킵
    if (s.start > cursor) nodes.push(sentence.slice(cursor, s.start))
    nodes.push(
      <mark key={s.field} className={`srcmark ${active === s.field ? 'active' : ''}`} style={markStyle(s.field)}>
        {sentence.slice(s.start, s.end)}
      </mark>
    )
    cursor = s.end
    lastEnd = s.end
  }
  if (cursor < sentence.length) nodes.push(sentence.slice(cursor))
  return <p className="srcsentence">{nodes}</p>
}

// 자연어 한 줄 → 폼 필드 순차 채움 + 근거 구절을 문장 위에 하이라이트(동기).
export default function App() {
  const [mode, setMode] = useState('sample')
  const [apiKey, setApiKey] = useState('')
  const [sentence, setSentence] = useState(SAMPLE_SENTENCES[0])
  const [form, setForm] = useState({ ...EMPTY })
  const [filled, setFilled] = useState({}) // 방금 채워진 필드 하이라이트
  const [sources, setSources] = useState({}) // field → source 구절(검증 통과분만, null=근거없음)
  const [runSentence, setRunSentence] = useState('') // 채움에 사용된 문장(고정 표시)
  const [active, setActive] = useState(null) // 방금 채워진 필드(문장 하이라이트 강조)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const onField = (k, v, source) => {
    setForm((f) => ({ ...f, [k]: String(v) }))
    setFilled((s) => ({ ...s, [k]: true }))
    setSources((s) => ({ ...s, [k]: source || null }))
    setActive(k)
    setTimeout(() => setFilled((s) => ({ ...s, [k]: false })), 700)
  }

  const run = async () => {
    if (busy || !sentence.trim()) return
    setBusy(true); setErr(''); setForm({ ...EMPTY }); setFilled({}); setSources({}); setActive(null)
    setRunSentence(sentence)
    try {
      const raw = mode === 'mykey' && apiKey ? await fillForm({ apiKey, sentence }) : getSampleParse(sentence)
      const items = validateExtractions(raw, sentence)
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
        <p>예약 문장을 쓰면 AI가 구조화해 <b>필드를 차례로</b> 채우고, <b>어느 구절에서 왔는지</b>를 문장 위에 보여줍니다.</p>
        <KeyBar slug="formig" mode={mode} setMode={setMode} apiKey={apiKey} setApiKey={setApiKey} />
        <div className="cmdbar">
          <input value={sentence} onChange={(e) => setSentence(e.target.value)} disabled={busy}
            placeholder="예: 금요일 저녁 7시, 어른 둘 아이 하나, 창가, 땅콩 알레르기" aria-label="예약 문장" />
          <button onClick={run} disabled={busy}>{busy ? '채우는 중…' : '채우기'}</button>
        </div>
        <div className="chips">
          {SAMPLE_SENTENCES.map((s) => (
            <button key={s} onClick={() => setSentence(s)} disabled={busy} title={s}>{s.length > 22 ? s.slice(0, 22) + '…' : s}</button>
          ))}
        </div>
        {err && <p className="err">⚠ {err}</p>}
      </header>

      <main className="formwrap">
        {runSentence && (
          <div className="srcbox">
            <span className="srclabel">입력 문장 · 색칠된 구절이 아래 필드의 근거입니다</span>
            <HighlightedSentence sentence={runSentence} sources={sources} active={active} />
          </div>
        )}
        <form className="resform" onSubmit={(e) => e.preventDefault()}>
          {FIELDS.map((f) => (
            <label key={f.k} className={`field ${filled[f.k] ? 'just' : ''}`}>
              <span className="fl">
                {f.label}
                {sources[f.k] && <span className="srcbadge" style={badgeStyle(f.k)}>← ‘{sources[f.k]}’</span>}
              </span>
              {f.type === 'select' ? (
                <select value={form[f.k]} onChange={(e) => setForm((s) => ({ ...s, [f.k]: e.target.value }))}>
                  {f.opts.map((o) => <option key={o} value={o}>{o || '선택'}</option>)}
                </select>
              ) : (
                <input type={f.type} value={form[f.k]} placeholder={f.ph || ''}
                  onChange={(e) => setForm((s) => ({ ...s, [f.k]: e.target.value }))} />
              )}
            </label>
          ))}
          <button className="submit" type="submit">예약 확정</button>
        </form>
      </main>
    </div>
  )
}
