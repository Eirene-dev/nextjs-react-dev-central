import { useEffect, useState } from 'react'

// BYOA 키 입력 — 샘플/내 키 토글. 키는 localStorage(브라우저 전용)에만, 어떤 서버로도 전송 안 함.
// 가벼운 형식 검증 + 지우기 버튼. slug 별 localStorage 키.
export default function KeyBar({ slug, mode, setMode, apiKey, setApiKey }) {
  const storageKey = `${slug}:gemini-key`
  const [draft, setDraft] = useState('')
  useEffect(() => {
    try {
      const v = localStorage.getItem(storageKey)
      if (v) {
        setApiKey(v)
        setDraft(v)
      }
    } catch {}
  }, [storageKey, setApiKey])

  const looksValid = draft.trim().length >= 20 // AIza... 형태(가벼운 검증, 실패는 호출 시 graceful)
  const save = () => {
    const k = draft.trim()
    if (!k) return
    try { localStorage.setItem(storageKey, k) } catch {}
    setApiKey(k)
    setMode('mykey')
  }
  const clear = () => {
    try { localStorage.removeItem(storageKey) } catch {}
    setApiKey('')
    setDraft('')
    setMode('sample')
  }

  return (
    <div className="keybar">
      <div className="seg">
        <button className={mode === 'sample' ? 'on' : ''} onClick={() => setMode('sample')}>샘플 보기</button>
        <button className={mode === 'mykey' ? 'on' : ''} onClick={() => setMode('mykey')} disabled={!apiKey}>
          내 키로 실행
        </button>
      </div>
      {mode === 'mykey' || draft ? (
        <div className="keyrow">
          <input
            type="password"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Gemini API 키 (AIza...)"
            aria-label="Gemini API 키"
            autoComplete="off"
            spellCheck="false"
          />
          <button className="kbtn" onClick={save} disabled={!looksValid}>저장</button>
          {apiKey && <button className="kbtn ghost" onClick={clear}>지우기</button>}
        </div>
      ) : (
        <button className="link" onClick={() => setMode('mykey')}>내 Gemini 키로 실행하기 →</button>
      )}
      <p className="note">
        🔒 키는 <b>이 브라우저(localStorage)에만</b> 저장되며, 어떤 서버로도 전송되지 않습니다. 호출은 브라우저 →
        Google 직접. (모델: gemini-3.1-flash-lite · OpenAI 는 브라우저 CORS 불가)
      </p>
    </div>
  )
}
