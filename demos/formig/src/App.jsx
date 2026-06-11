import { useState } from 'react'
import KeyBar from './KeyBar.jsx'
import { fillForm } from './gemini.js'
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

// 자연어 한 줄 → 폼 필드 순차 채움. 한 번에 다 차지 않고 하나씩(자연어가 폼을 채우는 시각).
export default function App() {
  const [mode, setMode] = useState('sample')
  const [apiKey, setApiKey] = useState('')
  const [sentence, setSentence] = useState(SAMPLE_SENTENCES[0])
  const [form, setForm] = useState({ ...EMPTY })
  const [filled, setFilled] = useState({}) // 방금 채워진 필드 하이라이트
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const onField = (k, v) => {
    setForm((f) => ({ ...f, [k]: String(v) }))
    setFilled((s) => ({ ...s, [k]: true }))
    setTimeout(() => setFilled((s) => ({ ...s, [k]: false })), 700)
  }

  const run = async () => {
    if (busy || !sentence.trim()) return
    setBusy(true); setErr(''); setForm({ ...EMPTY }); setFilled({})
    try {
      const parsed = mode === 'mykey' && apiKey ? await fillForm({ apiKey, sentence }) : getSampleParse(sentence)
      streamFill(parsed, { onField, done: () => setBusy(false) })
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
        <p>예약 문장을 한 줄 쓰면 AI가 구조화해 <b>필드를 차례로</b> 채웁니다.</p>
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
        <form className="resform" onSubmit={(e) => e.preventDefault()}>
          {FIELDS.map((f) => (
            <label key={f.k} className={`field ${filled[f.k] ? 'just' : ''}`}>
              <span className="fl">{f.label}</span>
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
