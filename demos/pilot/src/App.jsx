import { useState } from 'react'
import KeyBar from './KeyBar.jsx'
import { callWithTools } from './gemini.js'
import { runSample } from './sample.js'
import { SCENES } from './scenes/index.js'

const SYSTEM =
  '너는 웹 화면을 조작하는 보조자다. 사용자의 한국어 명령을 제공된 함수 호출로 변환하라. 한 명령이 여러 작업을 요구하면 함수를 여러 개 호출하라. 설명 없이 함수 호출만 한다.'

export default function App() {
  const [theme, setTheme] = useState('light')
  const [sceneId, setSceneId] = useState(SCENES[0].id)
  const scene = SCENES.find((s) => s.id === sceneId) || SCENES[0]
  const [state, setState] = useState(scene.initialState)
  const [mode, setMode] = useState('sample')
  const [apiKey, setApiKey] = useState('')
  const [input, setInput] = useState('')
  const [log, setLog] = useState([]) // {kind:'cmd'|'tool'|'err', text}
  const [busy, setBusy] = useState(false)

  // scene 전환 — tools·state·render·samples·chips 가 함께 교체. 상태·로그 초기화.
  const switchScene = (id) => {
    if (id === sceneId || busy) return
    const next = SCENES.find((s) => s.id === id)
    setSceneId(id)
    setState(next.initialState)
    setLog([])
  }

  const dispatch = (patch) => setState((s) => ({ ...s, ...patch }))

  // 샘플/실키 공유 경로: 모든 호출이 이 함수를 탄다. set_theme 은 전역, 그 외는 scene 위임.
  const onToolCall = (name, args) => {
    setLog((l) => [...l, { kind: 'tool', text: `${name}(${JSON.stringify(args)})` }])
    if (name === 'set_theme') setTheme(args.mode === 'dark' ? 'dark' : 'light')
    else scene.onToolCall(name, args, dispatch)
  }
  const onError = (e) => setLog((l) => [...l, { kind: 'err', text: e }])

  const run = async (text) => {
    if (busy || !text.trim()) return
    setBusy(true)
    setLog((l) => [...l, { kind: 'cmd', text }])
    try {
      if (mode === 'mykey' && apiKey) {
        const calls = await callWithTools({ apiKey, system: SYSTEM, user: text, tools: scene.tools })
        for (const c of calls) onToolCall(c.name, c.args) // ★ 다중 함수 호출 순차 적용
      } else {
        await runSample(scene.samples, text, { onToolCall, onError })
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
        <p>한 명령이 <b>여러 도구</b>를 부릅니다. AI가 function calling으로 화면을 실제로 바꿔요 — 장면을 골라 시도해 보세요.</p>
        <KeyBar slug="pilot" mode={mode} setMode={setMode} apiKey={apiKey} setApiKey={setApiKey} />
        <div className="scenes" role="tablist" aria-label="장면 선택">
          {SCENES.map((s) => (
            <button key={s.id} role="tab" aria-selected={s.id === sceneId} className={s.id === sceneId ? 'on' : ''} onClick={() => switchScene(s.id)} disabled={busy}>
              {s.label}
            </button>
          ))}
        </div>
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
        <div className="chips">
          {scene.chips.map((c) => (
            <button key={c} onClick={() => run(c)} disabled={busy}>{c}</button>
          ))}
        </div>
      </header>

      {scene.render(state, dispatch)}

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
