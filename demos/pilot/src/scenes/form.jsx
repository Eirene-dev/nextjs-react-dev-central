// 장면 C — 가입 폼. 도구 이름은 전역 유일(form_ 접두사).
// 상태는 평면 키(App 의 shallow-merge dispatch 와 호환). 검증은 render 에서 파생(상태 접근 불필요).
const FIELDS = [
  { k: 'name', label: '이름', ph: '예: 홍길동' },
  { k: 'email', label: '이메일', ph: '예: hong@site.com' },
  { k: 'phone', label: '전화', ph: '예: 010-0000-0000' },
]
const REQ_KEY = { name: 'reqName', email: 'reqEmail', phone: 'reqPhone' }
const PLANS = [
  { id: 'free', label: '무료' },
  { id: 'pro', label: '프로' },
  { id: 'team', label: '팀' },
]
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

export const form = {
  id: 'form',
  label: '가입 폼',
  chips: ['프로 요금제 선택하고 검증'],
  tools: [
    { name: 'form_fill_field', description: '폼 필드 채우기', parameters: { type: 'object', properties: { field: { type: 'string', enum: ['name', 'email', 'phone'] }, value: { type: 'string' } }, required: ['field', 'value'] } },
    { name: 'form_clear_field', description: '폼 필드 비우기', parameters: { type: 'object', properties: { field: { type: 'string', enum: ['name', 'email', 'phone'] } }, required: ['field'] } },
    { name: 'form_select_plan', description: '요금제 선택', parameters: { type: 'object', properties: { plan: { type: 'string', enum: ['free', 'pro', 'team'] } }, required: ['plan'] } },
    { name: 'form_set_required', description: '필드 필수 여부 설정', parameters: { type: 'object', properties: { field: { type: 'string', enum: ['name', 'email', 'phone'] }, required: { type: 'boolean' } }, required: ['field', 'required'] } },
    { name: 'form_validate', description: '폼 검증(필수 누락·이메일 형식)', parameters: { type: 'object', properties: {} } },
  ],
  initialState: { name: '', email: '', phone: '', plan: 'free', reqName: true, reqEmail: true, reqPhone: false, showValidation: false },
  onToolCall(name, args, dispatch) {
    if (name === 'form_fill_field') dispatch({ [args.field]: args.value ?? '', showValidation: false })
    else if (name === 'form_clear_field') dispatch({ [args.field]: '', showValidation: false })
    else if (name === 'form_select_plan') dispatch({ plan: args.plan })
    else if (name === 'form_set_required') dispatch({ [REQ_KEY[args.field]]: !!args.required, showValidation: false })
    else if (name === 'form_validate') dispatch({ showValidation: true })
  },
  render(state) {
    const req = { name: state.reqName, email: state.reqEmail, phone: state.reqPhone }
    let result = null
    if (state.showValidation) {
      const errors = []
      for (const f of FIELDS) {
        if (req[f.k] && !String(state[f.k]).trim()) errors.push(`${f.label}은(는) 필수입니다`)
      }
      if (String(state.email).trim() && !EMAIL_RE.test(state.email)) errors.push('이메일 형식이 올바르지 않습니다')
      result = errors.length ? { ok: false, errors } : { ok: true }
    }
    return (
      <>
        <div className="formfields">
          {FIELDS.map((f) => (
            <label className="ff" key={f.k}>
              <span className="fl">{f.label}{req[f.k] && <i className="req">*</i>}</span>
              <input readOnly value={state[f.k]} placeholder={f.ph} aria-label={f.label} />
            </label>
          ))}
        </div>
        <div className="plans" role="group" aria-label="요금제">
          {PLANS.map((p) => (
            <div className={`plan ${state.plan === p.id ? 'on' : ''}`} key={p.id}>{p.label}</div>
          ))}
        </div>
        <div className="vmsg">
          {result == null && <span className="muted">검증 전 — “검증” 명령으로 확인</span>}
          {result?.ok && <span className="ok">✓ 유효합니다</span>}
          {result && !result.ok && (
            <ul className="errs">{result.errors.map((e, i) => <li key={i}>⚠ {e}</li>)}</ul>
          )}
        </div>
      </>
    )
  },
}
