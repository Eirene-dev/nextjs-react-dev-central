import { useEffect, useRef, useState } from 'react'
import KeyBar from './KeyBar.jsx'
import { planNext, appendTurn } from './gemini.js'
import { PRODUCTS, COUPONS, SAMPLE_GOALS, SAMPLE_GOAL_LIST } from './sample.js'

const MAX_STEPS = 6
const pname = (id) => PRODUCTS.find((p) => p.id === id)?.name || id
const TOOLS = [
  { name: 'add_to_cart', description: '상품을 장바구니에 1개 추가', parameters: { type: 'object', properties: { product: { type: 'string', enum: ['laptop', 'mouse', 'kbd'] } }, required: ['product'] } },
  { name: 'set_qty', description: '장바구니 상품 수량 변경', parameters: { type: 'object', properties: { product: { type: 'string', enum: ['laptop', 'mouse', 'kbd'] }, qty: { type: 'integer' } }, required: ['product', 'qty'] } },
  { name: 'apply_coupon', description: '쿠폰 적용', parameters: { type: 'object', properties: { code: { type: 'string' } }, required: ['code'] } },
  { name: 'go_checkout', description: '결제 단계로 이동(실제 결제는 없음)', parameters: { type: 'object', properties: {} } },
]
const SYSTEM =
  '너는 미니 쇼핑몰을 조작하는 에이전트다. 사용자 목표를 함수로 한 단계씩 수행하라. 목표를 달성했으면 더 호출하지 말고 끝내라. 결제는 go_checkout 까지만(실제 결제 없음).'

export default function App() {
  const [mode, setMode] = useState('sample')
  const [apiKey, setApiKey] = useState('')
  const [auto, setAuto] = useState(false)
  const [goal, setGoal] = useState(SAMPLE_GOAL_LIST[0])
  const [cart, setCart] = useState({})
  const [coupon, setCoupon] = useState(null)
  const [stage, setStage] = useState('shopping')
  const [steps, setSteps] = useState([]) // {name,args,result}
  const [pending, setPending] = useState(null)
  const [running, setRunning] = useState(false)
  const [finished, setFinished] = useState(null)
  const [err, setErr] = useState('')
  const sess = useRef({ contents: [], queue: [], idx: 0, count: 0, lastKey: '' })

  const execute = (call) => {
    const a = call.args || {}
    if (call.name === 'add_to_cart') { setCart((c) => ({ ...c, [a.product]: (c[a.product] || 0) + 1 })); return `${pname(a.product)} 장바구니 추가` }
    if (call.name === 'set_qty') { setCart((c) => ({ ...c, [a.product]: a.qty })); return `${pname(a.product)} 수량 ${a.qty}` }
    if (call.name === 'apply_coupon') { const r = COUPONS[a.code]; if (r) { setCoupon(a.code); return `쿠폰 ${a.code} 적용 (${r * 100}% 할인)` } return `쿠폰 ${a.code} 무효` }
    if (call.name === 'go_checkout') { setStage('checkout'); return '결제 단계로 이동 (실제 결제 없음 — 직전까지)' }
    return '알 수 없는 동작'
  }

  const finish = (text) => { setFinished(text); setRunning(false); setPending(null) }

  const advance = async () => {
    const s = sess.current
    if (s.count >= MAX_STEPS) return finish('최대 6단계 도달 — 안전 중단')
    if (mode === 'mykey' && apiKey) {
      let res
      try { res = await planNext({ apiKey, system: SYSTEM, contents: s.contents, tools: TOOLS }) }
      catch (e) { setErr(`${e.message} — 샘플 모드로 시도해 보세요.`); return finish('오류로 중단') }
      if (res.done) return finish(res.text || '목표 완료')
      const key = res.functionCall.name + JSON.stringify(res.functionCall.args)
      if (key === s.lastKey) return finish('같은 동작 반복 감지 — 중단')
      setPending(res.functionCall)
    } else {
      const next = s.queue[s.idx]
      if (!next) return finish('목표 완료')
      setPending(next)
    }
  }

  const approve = () => {
    const call = pending
    if (!call) return
    const result = execute(call)
    const s = sess.current
    s.count += 1
    s.lastKey = call.name + JSON.stringify(call.args)
    setSteps((st) => [...st, { ...call, result }])
    if (mode === 'mykey' && apiKey) s.contents = appendTurn(s.contents, call, result)
    else s.idx += 1
    setPending(null)
    advance()
  }
  const reject = () => { setPending(null); finish('사용자가 중단함') }

  // 자동 모드: 승인을 자동으로(데모 — 사람 판단 vs 자동 비교). 기본은 OFF(승인 필수).
  useEffect(() => {
    if (auto && pending && running) { const t = setTimeout(() => approve(), 850); return () => clearTimeout(t) }
  }, [auto, pending, running]) // eslint-disable-line

  const start = (g) => {
    if (running) return
    setCart({}); setCoupon(null); setStage('shopping'); setSteps([]); setFinished(null); setErr('')
    sess.current = { contents: [{ role: 'user', parts: [{ text: g }] }], queue: SAMPLE_GOALS[g] || [], idx: 0, count: 0, lastKey: '' }
    setRunning(true)
    setTimeout(advance, 50)
  }

  const items = Object.entries(cart).filter(([, q]) => q > 0)
  const subtotal = items.reduce((s, [id, q]) => s + (PRODUCTS.find((p) => p.id === id)?.price || 0) * q, 0)
  const total = coupon ? Math.round(subtotal * (1 - COUPONS[coupon])) : subtotal

  return (
    <div className="app">
      <header className="hero">
        <span className="badge">Relay · AI×웹</span>
        <h1>AI가 실행하고, <span className="g">사람이 승인한다</span></h1>
        <p>에이전트가 목표를 단계로 쪼개 제안하면, 각 단계를 <b>당신이 승인</b>해야 진행됩니다.</p>
        <KeyBar slug="relay" mode={mode} setMode={setMode} apiKey={apiKey} setApiKey={setApiKey} />
        <div className="cmdbar">
          <input value={goal} onChange={(e) => setGoal(e.target.value)} disabled={running} placeholder="목표를 입력…" aria-label="목표" />
          <button onClick={() => start(goal)} disabled={running}>{running ? '진행 중…' : '시작'}</button>
        </div>
        <div className="chips">
          {SAMPLE_GOAL_LIST.map((g) => <button key={g} onClick={() => { setGoal(g); start(g) }} disabled={running}>{g}</button>)}
          <label className="auto"><input type="checkbox" checked={auto} onChange={(e) => setAuto(e.target.checked)} /> 자동 진행</label>
        </div>
        {err && <p className="err">⚠ {err}</p>}
      </header>

      <main className="grid2">
        <section className="agent">
          <h3>에이전트 ({steps.length}/{MAX_STEPS} 단계)</h3>
          {steps.map((s, i) => (
            <div className="step done" key={i}><b>{s.name}</b><code>{JSON.stringify(s.args)}</code><span className="res">✓ {s.result}</span></div>
          ))}
          {pending && (
            <div className="step pending">
              <div className="pq">다음 단계 제안: <b>{pending.name}</b> <code>{JSON.stringify(pending.args)}</code></div>
              {!auto && <div className="approve"><button className="ok" onClick={approve}>실행</button><button className="no" onClick={reject}>중단</button></div>}
              {auto && <div className="autohint">자동 진행 중…</div>}
            </div>
          )}
          {finished && <div className="finished">🏁 {finished}</div>}
          {!running && !steps.length && <p className="empty">목표를 입력하고 “시작”을 누르세요.</p>}
        </section>

        <aside className="cart">
          <h3>장바구니 {stage === 'checkout' && <span className="ck">· 결제 직전</span>}</h3>
          {items.length === 0 ? <p className="empty">비어 있음</p> : items.map(([id, q]) => (
            <div className="ci" key={id}><span>{pname(id)} × {q}</span><span>₩ {((PRODUCTS.find((p) => p.id === id)?.price || 0) * q).toLocaleString('ko-KR')}</span></div>
          ))}
          {coupon && <div className="ci coup"><span>쿠폰 {coupon}</span><span>−{COUPONS[coupon] * 100}%</span></div>}
          <div className="ci total"><span>합계</span><b>₩ {total.toLocaleString('ko-KR')}</b></div>
          {stage === 'checkout' && <div className="ckbox">결제 직전 단계 (실제 결제 없음 — 데모)</div>}
        </aside>
      </main>
    </div>
  )
}
