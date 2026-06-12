import { useState } from 'react'
import KeyBar from './KeyBar.jsx'
import { callWithTools } from './gemini.js'
import { runSample } from './sample.js'
import { SCENES, ALL_TOOLS, TOOL_OWNER, SAMPLES, CROSS_CHIPS } from './scenes/index.js'

const SYSTEM =
  '너는 웹 화면을 조작하는 보조자다. 화면에는 여러 패널(상품 카탈로그·대시보드)이 동시에 있다. ' +
  '사용자의 한국어 명령을 제공된 함수 호출로 변환하라. 한 명령이 여러 패널/작업을 요구하면 함수를 여러 개 호출하라. 설명 없이 함수 호출만 한다.'

const initStates = () => Object.fromEntries(SCENES.map((s) => [s.id, s.initialState]))

export default function App() {
  const [theme, setTheme] = useState('light')
  const [states, setStates] = useState(initStates) // { [sceneId]: stateSlice }
  const [flash, setFlash] = useState({}) // { [sceneId]: count>0 → 강조 }
  const [mode, setMode] = useState('sample')
  const [apiKey, setApiKey] = useState('')
  const [input, setInput] = useState('')
  const [log, setLog] = useState([]) // {kind:'cmd'|'tool'|'err', text}
  const [busy, setBusy] = useState(false)

  const makeDispatch = (id) => (patch) => setStates((st) => ({ ...st, [id]: { ...st[id], ...patch } }))

  // 변화 피드백 — 해당 패널 플래시 + (화면 밖이면) 스크롤. 카운터로 연속 플래시 안전.
  const flashPanel = (id) => {
    setFlash((f) => ({ ...f, [id]: (f[id] || 0) + 1 }))
    const el = document.getElementById(`panel-${id}`)
    el && el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    setTimeout(() => setFlash((f) => ({ ...f, [id]: Math.max(0, (f[id] || 1) - 1) })), 750)
  }

  const onError = (e) => setLog((l) => [...l, { kind: 'err', text: e }])

  // 전역 라우팅: 도구 이름 → 소유 패널. set_theme 은 전역. 미지의 이름은 무시(graceful).
  const onToolCall = (name, args) => {
    setLog((l) => [...l, { kind: 'tool', text: `${name}(${JSON.stringify(args)})` }])
    if (name === 'set_theme') {
      setTheme(args.mode === 'dark' ? 'dark' : 'light')
      return
    }
    const owner = TOOL_OWNER[name]
    if (!owner) return onError(`알 수 없는 도구: ${name}`)
    const scene = SCENES.find((s) => s.id === owner)
    scene.onToolCall(name, args, makeDispatch(owner))
    flashPanel(owner)
  }

  const run = async (text) => {
    if (busy || !text.trim()) return
    setBusy(true)
    setLog((l) => [...l, { kind: 'cmd', text }])
    try {
      if (mode === 'mykey' && apiKey) {
        const calls = await callWithTools({ apiKey, system: SYSTEM, user: text, tools: ALL_TOOLS })
        for (const c of calls) onToolCall(c.name, c.args) // ★ 다중 호출 → 여러 패널에 순차 적용
      } else {
        await runSample(SAMPLES, text, { onToolCall, onError })
      }
    } catch (e) {
      onError(`${e.message} — 샘플 모드로 시도해 보세요.`)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className={`app ${theme}`} id="pilot-top">
      <header className="hero">
        <span className="badge">Pilot · AI×웹</span>
        <h1>말로 움직이는 웹</h1>
        <p>패널 여러 개가 한 화면에 있습니다. <b>한 문장</b>이 여러 패널을 동시에 움직여요 — AI가 도구를 골라 적용합니다.</p>
        <KeyBar slug="pilot" mode={mode} setMode={setMode} apiKey={apiKey} setApiKey={setApiKey} />
      </header>

      <div className="cmdsticky">
        <div className="cmdbar">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (run(input), setInput(''))}
            placeholder={mode === 'mykey' ? '명령을 자유롭게 입력…' : '아래 샘플 명령을 눌러보세요'}
            disabled={busy}
            aria-label="명령 입력"
          />
          <button onClick={() => { run(input); setInput('') }} disabled={busy || !input.trim()}>{busy ? '실행 중…' : '실행'}</button>
        </div>
        <div className="crosswrap">
          <span className="crosslabel">전체 · 한 문장이 여러 패널을 움직입니다</span>
          <div className="chips">
            {CROSS_CHIPS.map((c) => (
              <button key={c} onClick={() => run(c)} disabled={busy}>{c}</button>
            ))}
          </div>
        </div>
      </div>

      <main className="canvas">
        {SCENES.map((s) => (
          <section className={`panel ${flash[s.id] ? 'flash' : ''}`} id={`panel-${s.id}`} key={s.id}>
            <div className="phead">{s.label}</div>
            {s.chips?.length > 0 && (
              <div className="chips pchips">
                {s.chips.map((c) => (
                  <button key={c} onClick={() => run(c)} disabled={busy}>{c}</button>
                ))}
              </div>
            )}
            {s.render(states[s.id], makeDispatch(s.id))}
          </section>
        ))}
      </main>

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
