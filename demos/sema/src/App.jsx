import { useEffect, useRef, useState } from 'react'
import KeyBar from './KeyBar.jsx'
import { ITEMS } from './items.js'
import { embedQuery, cosine } from './gemini.js'
import { SAMPLE_QUERIES, runSample } from './sample.js'
import EMB from './embeddings.json'

const byId = Object.fromEntries(ITEMS.map((it) => [it.id, it]))

// 의미 검색 팔레트 — ⌘K(모바일 버튼). 키워드 불일치-의미 일치를 시연.
export default function App() {
  const [mode, setMode] = useState('sample')
  const [apiKey, setApiKey] = useState('')
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [results, setResults] = useState(null) // [[id, score]]
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    const h = (e) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setOpen(true) }
      if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [])
  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 50) }, [open])

  const onResults = (hits) => setResults(hits)

  const search = async (text) => {
    if (busy || !text.trim()) return
    setBusy(true); setErr(''); setResults(null)
    try {
      if (mode === 'mykey' && apiKey) {
        const vecs = EMB.vectors || {}
        if (!Object.keys(vecs).length) throw new Error('문서 임베딩 미생성 — README의 embed.mjs를 먼저 실행하세요')
        const qv = await embedQuery({ apiKey, text })
        const scored = ITEMS.filter((it) => vecs[it.id]).map((it) => [it.id, cosine(qv, vecs[it.id])])
        onResults(scored.sort((a, b) => b[1] - a[1]).slice(0, 4))
      } else {
        await runSample(text, { onResults })
      }
    } catch (e) {
      setErr(`${e.message} — 샘플 모드로 시도해 보세요.`)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="app">
      <header className="hero">
        <span className="badge">Sema · AI×웹</span>
        <h1>키워드가 아니라, <span className="g">의미로 찾는다</span></h1>
        <p>임베딩 + 코사인 유사도로 검색합니다. “돈 돌려받고 싶어요”가 <b>“환불 정책”</b>을 찾습니다 — 단어가 안 겹쳐도.</p>
        <KeyBar slug="sema" mode={mode} setMode={setMode} apiKey={apiKey} setApiKey={setApiKey} />
        <button className="palette-open" onClick={() => setOpen(true)}>의미 검색 열기 <kbd>⌘K</kbd></button>
        <div className="chips">
          {SAMPLE_QUERIES.map((s) => <button key={s.q} onClick={() => { setOpen(true); setQ(s.q); search(s.q) }}>{s.q}</button>)}
        </div>
        {err && <p className="err">⚠ {err}</p>}
      </header>

      {open && (
        <div className="overlay" onClick={() => setOpen(false)}>
          <div className="palette" onClick={(e) => e.stopPropagation()}>
            <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && search(q)}
              placeholder="자연어로 물어보세요… (예: 비번 까먹었어요)" aria-label="의미 검색" />
            <div className="presults">
              {busy && <div className="pmsg">검색 중…</div>}
              {results && results.length === 0 && <div className="pmsg">관련 항목을 찾지 못했습니다.</div>}
              {results && results.map(([id, score]) => byId[id] && (
                <a className="pitem" key={id} href="#" onClick={(e) => e.preventDefault()}>
                  <div className="pt">{byId[id].title}</div>
                  <div className="pb">{byId[id].body}</div>
                  <div className="ps">{Math.round(score * 100)}% 유사</div>
                </a>
              ))}
              {!results && !busy && <div className="pmsg">질의를 입력하거나 아래 예시를 눌러보세요.</div>}
            </div>
            <div className="phint">Esc 닫기 · 의미 유사도 상위 결과</div>
          </div>
        </div>
      )}

      <main className="list">
        <h3>헬프센터 — Orbit ({ITEMS.length}개 항목)</h3>
        <div className="items">
          {ITEMS.map((it) => {
            const hit = results?.find(([id]) => id === it.id)
            return (
              <div className={`hitem ${hit ? 'on' : ''}`} key={it.id}>
                <div className="ht">{it.title} {hit && <span className="badge2">{Math.round(hit[1] * 100)}%</span>}</div>
                <div className="hb">{it.body}</div>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
