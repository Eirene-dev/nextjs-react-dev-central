// 해부 컴포저 — 폼 입력을 data/anatomy/<slug>.mdx (Velite frontmatter + 근거 본문) 와
// canonical JSON(가이드 5장)으로 변환하는 순수 함수. DB 없음. 이 도구의 존재 이유는 YAML 안전:
// 스칼라는 필요 시 더블쿼트+이스케이프, question·result 는 7장대로 블록 스칼라(>-/|-).

export type ComposerOption = { title: string; tradeoff: string }

export type ComposerForm = {
  title: string
  slug: string
  exhibit: number
  category: string
  question: string
  options: ComposerOption[] // 2~4, key 는 순서대로 A/B/C/D
  decisionIndex: number // options 인덱스(라디오) → decision.key (불일치 원천 차단)
  decisionLabel: string
  decisionSub: string // '' 이면 출력 생략
  result: string
  ledgerClaude: string
  ledgerMe: string
  date: string // '' 이면 출력 생략
  rationale: string // 근거 본문(문단 = 빈 줄 구분)
}

export const LETTERS = ['A', 'B', 'C', 'D']
export function letterFor(i: number): string {
  return LETTERS[i] ?? String.fromCharCode(65 + i)
}

// ── YAML 안전 직렬화 ─────────────────────────────────────────
// plain 스칼라로 두면 깨질 수 있는 경우 더블쿼트로 감싼다.
function needsQuote(s: string): boolean {
  if (s === '') return true
  if (/^[\s\-?:,>|@`"'#%&*![\]{}]/.test(s)) return true // 위험한 시작 문자
  if (/:\s/.test(s) || /:$/.test(s)) return true // "key: val" 매핑 오인
  if (/\s#/.test(s)) return true // 인라인 주석 오인
  if (/["'[\]{}]/.test(s)) return true // 따옴표·플로우 문자
  if (/^\s|\s$/.test(s)) return true // 앞뒤 공백
  return false
}
function yamlQuote(s: string): string {
  return '"' + s.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"'
}
function yamlScalar(s: string): string {
  return needsQuote(s) ? yamlQuote(s) : s
}
// 멀티라인 안전: 한 줄이면 >-(폴디드), 여러 줄이면 |-(리터럴, 줄바꿈 보존). 이스케이프 불요.
function yamlBlock(key: string, value: string): string {
  const v = value.replace(/[ \t]+$/gm, '').replace(/\s+$/, '')
  if (v.includes('\n')) {
    return `${key}: |-\n` + v.split('\n').map((l) => '  ' + l).join('\n')
  }
  return `${key}: >-\n  ${v}`
}

// canonical 객체(가이드 5장). MDX body 는 JSON 에서 rationale_md.
export function toCanonical(form: ComposerForm): Record<string, unknown> {
  const obj: Record<string, unknown> = {
    slug: form.slug,
    exhibit: form.exhibit,
    category: form.category,
    title: form.title,
    question: form.question,
    options: form.options.map((o, i) => ({ key: letterFor(i), title: o.title, tradeoff: o.tradeoff })),
    decision: {
      key: letterFor(form.decisionIndex),
      label: form.decisionLabel,
      ...(form.decisionSub.trim() ? { sub: form.decisionSub } : {}),
    },
    rationale_md: form.rationale.trim(),
    result: form.result,
    aiLedger: { claude: form.ledgerClaude, me: form.ledgerMe },
    ...(form.date.trim() ? { date: form.date.trim() } : {}),
  }
  return obj
}

export function toJson(form: ComposerForm): string {
  return JSON.stringify(toCanonical(form), null, 2)
}

export function toMdx(form: ComposerForm): string {
  const L: string[] = ['---']
  L.push(`title: ${yamlScalar(form.title)}`)
  L.push(`exhibit: ${form.exhibit}`)
  L.push(`category: ${yamlScalar(form.category)}`)
  L.push(yamlBlock('question', form.question))
  L.push('options:')
  form.options.forEach((o, i) => {
    L.push(`  - key: ${letterFor(i)}`)
    L.push(`    title: ${yamlScalar(o.title)}`)
    L.push(`    tradeoff: ${yamlScalar(o.tradeoff)}`)
  })
  L.push('decision:')
  L.push(`  key: ${letterFor(form.decisionIndex)}`)
  L.push(`  label: ${yamlScalar(form.decisionLabel)}`)
  if (form.decisionSub.trim()) L.push(`  sub: ${yamlScalar(form.decisionSub)}`)
  L.push(yamlBlock('result', form.result))
  L.push('aiLedger:')
  L.push(`  claude: ${yamlScalar(form.ledgerClaude)}`)
  L.push(`  me: ${yamlScalar(form.ledgerMe)}`)
  if (form.date.trim()) L.push(`date: ${yamlQuote(form.date.trim())}`) // isodate 는 항상 쿼트(타임스탬프 오인 방지)
  L.push('---')
  return L.join('\n') + '\n\n' + form.rationale.trim() + '\n'
}

// ── 검증(출력 게이팅) ───────────────────────────────────────
export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export function validate(form: ComposerForm): string[] {
  const errors: string[] = []
  if (!form.title.trim()) errors.push('제목(title)이 비어 있습니다.')
  if (!form.slug.trim()) errors.push('slug 가 비어 있습니다.')
  else if (!SLUG_RE.test(form.slug)) errors.push('slug 는 영문 kebab-case(소문자·숫자·하이픈)여야 합니다.')
  if (!Number.isInteger(form.exhibit) || form.exhibit < 1)
    errors.push('exhibit 는 1 이상의 정수여야 합니다.')
  if (!form.category.trim()) errors.push('category 가 비어 있습니다.')
  if (!form.question.trim()) errors.push('질문(question)이 비어 있습니다.')
  if (form.options.length < 2 || form.options.length > 4)
    errors.push('선택지는 2~4개여야 합니다.')
  form.options.forEach((o, i) => {
    if (!o.title.trim()) errors.push(`선택지 ${letterFor(i)} 의 제목이 비어 있습니다.`)
    if (!o.tradeoff.trim()) errors.push(`선택지 ${letterFor(i)} 의 트레이드오프가 비어 있습니다.`)
  })
  if (form.decisionIndex < 0 || form.decisionIndex >= form.options.length)
    errors.push('decision 은 현재 선택지 중 하나여야 합니다(무결성).')
  if (!form.decisionLabel.trim()) errors.push('내 결정(decision.label)이 비어 있습니다.')
  if (!form.result.trim()) errors.push('결과(result)가 비어 있습니다.')
  if (!form.ledgerClaude.trim()) errors.push('AI 분업(claude)이 비어 있습니다.')
  if (!form.ledgerMe.trim()) errors.push('AI 분업(me)이 비어 있습니다.')
  if (!form.rationale.trim()) errors.push('근거 본문이 비어 있습니다.')
  return errors
}

// ── BYOAI: 프롬프트 빌더 ─────────────────────────────────────
// 사용자가 자기 AI(claude.ai 등)에 붙여넣어 canonical JSON 을 돌려받기 위한 프롬프트.
// ★ 스키마 본문(아래 SKELETON)은 가이드 5장(docs/anatomy-guide.md)과 동기화 의무 — 5장 필드가
//   바뀌면 여기도 갱신한다. AI 역할은 '구조화만'(6장): 판단·선택지·근거를 생성하지 않는다.
const BYOAI_SKELETON = `{
  "slug": "",
  "exhibit": "",
  "category": "아키텍처 | 데이터 설계 | 운영·수익 | 제품 설계 | 콘텐츠 전략 | 브랜드·디자인 | ...",
  "title": "선언형 한 문장 (~했다 / ~인가)",
  "question": "배경 2~3문장 + 당신이라면 어떻게 하겠는가?",
  "options": [
    { "key": "A", "title": "...", "tradeoff": "장점과 대가를 한 문장에" },
    { "key": "B", "title": "...", "tradeoff": "..." },
    { "key": "C", "title": "...", "tradeoff": "..." }
  ],
  "decision": { "key": "C", "label": "...", "sub": "" },
  "rationale_md": "",
  "result": "",
  "aiLedger": { "claude": "", "me": "" }
}`

// 채워진 미니 예시 — 형식 준수율을 올린다. rationale_md 는 한 문장(짧게 — '구조화만' 가드와 충돌 방지).
const BYOAI_EXAMPLE = `{
  "slug": "",
  "exhibit": "",
  "category": "데이터 설계",
  "title": "답글이 달린 댓글을 지우면, 답글은 누구의 것인가",
  "question": "에세이에 댓글과 답글을 붙였다. 누군가 답글이 달린 자기 댓글을 지운다. 화면에는 무엇이 남아야 하는가?",
  "options": [
    { "key": "A", "title": "연쇄 삭제", "tradeoff": "화면은 깔끔하지만 답글 작성자의 글이 동의 없이 사라진다." },
    { "key": "B", "title": "부모만 삭제", "tradeoff": "답글은 남지만 무엇에 대한 답인지 알 수 없는 고아가 된다." },
    { "key": "C", "title": "묘비", "tradeoff": "부모 자리에 삭제 표시를 세우고 답글은 보존하되 빈 자리가 남는다." }
  ],
  "decision": { "key": "C", "label": "묘비", "sub": "단, 답글이 없으면 완전 삭제" },
  "rationale_md": "삭제권은 자기 글에만 미친다고 봤다.",
  "result": "",
  "aiLedger": { "claude": "스키마와 분기를 구현했다.", "me": "묘비와 완전삭제 분기를 결정했다." }
}`

export function buildByoaiPrompt(context?: string): string {
  const ctxLine = context && context.trim() ? `\n이번 결정의 주제: ${context.trim()}\n` : ''
  return `당신은 이미 내려진 기술적 결정을 정해진 JSON 구조로 '정리·번역'하는 보조자입니다.

[역할 경계 — 반드시 지킬 것]
- 선택지·판단·근거를 새로 지어내지 마세요.
- 사용자가 말하지 않은 선택지를 발명하지 마세요.
- 사용자가 제공하지 않은 근거(rationale_md)는 빈 문자열("")로 두세요.
- 결과(result)도 사용자가 언급하지 않았으면 빈 문자열("")로 두세요.
- 당신의 일은 사용자의 실제 경험을 구조에 담는 것이지 이야기를 만드는 것이 아닙니다.
${ctxLine}
[작성 규칙]
- question: 배경 2~3문장 + 2인칭 질문("당신이라면 어떻게 하겠는가?").
- options: 사용자가 실제로 검토한 갈림길만. 각 title + tradeoff(장점과 대가를 한 문장에).
- decision.key: 반드시 options[].key 중 하나.
- rationale_md: 사용자의 표현을 보존(윤색 최소). 제공되지 않았으면 "".
- "[추기 예정: X]" 표기는 그대로 보존.

[출력 형식]
아래 구조의 canonical JSON "만" 출력하세요. 코드펜스(\`\`\`)·설명·머리말 없이 순수 JSON만.
slug·exhibit·date 는 모르면 비우세요(빈 문자열) — 폼에서 채웁니다.

${BYOAI_SKELETON}

[예시] — 형식 참고용. rationale_md 는 한 문장으로 짧게(길게 지어내지 마세요).
${BYOAI_EXAMPLE}`
}

// ── BYOAI: JSON → form 파서 (toCanonical 의 역함수) ──────────
function stripFences(t: string): string {
  const s = t.trim()
  const m = s.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i)
  return (m ? m[1] : s).trim()
}
const asStr = (v: unknown): string => (typeof v === 'string' ? v : v == null ? '' : String(v))

export function parseCanonical(
  text: string,
  fallbackExhibit: number
): { ok: boolean; form?: ComposerForm; errors: string[] } {
  const errors: string[] = []
  const cleaned = stripFences(text)
  if (!cleaned) return { ok: false, errors: ['붙여넣은 내용이 비어 있습니다.'] }

  let data: any
  try {
    data = JSON.parse(cleaned)
  } catch {
    return { ok: false, errors: ['유효한 JSON이 아닙니다 — 받은 텍스트를 다시 확인하세요.'] }
  }
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    return { ok: false, errors: ['JSON 객체 형태가 아닙니다 — { … } 구조여야 합니다.'] }
  }

  // options — toCanonical 의 역(키는 인덱스에서 재생성하므로 매핑엔 title/tradeoff 만 보관)
  if (!Array.isArray(data.options)) errors.push('options 가 배열이 아닙니다 — 선택지를 직접 입력하세요.')
  const rawOpts = Array.isArray(data.options) ? data.options : []
  const options: ComposerOption[] = []
  const keys: string[] = []
  rawOpts.forEach((o: any, i: number) => {
    if (!o || typeof o !== 'object') {
      errors.push(`선택지 ${i + 1} 형식 오류 — 건너뜀.`)
      return
    }
    const title = asStr(o.title)
    const tradeoff = asStr(o.tradeoff)
    const key = asStr(o.key) || letterFor(options.length)
    if (!title) errors.push(`선택지 ${key} 의 제목이 비어 있습니다.`)
    if (!tradeoff) errors.push(`선택지 ${key} 의 트레이드오프가 비어 있습니다.`)
    keys.push(key)
    options.push({ title, tradeoff })
  })

  // decision.key ∈ options[].key — 불일치/누락은 경고 후 미선택(-1)으로 두고 나머지는 채운다
  const dec = data.decision && typeof data.decision === 'object' ? data.decision : {}
  const decKey = asStr(dec.key)
  const decisionIndex = keys.findIndex((k) => k === decKey)
  if (!decKey) errors.push('decision 이 비어 있습니다 — 결정을 직접 선택하세요.')
  else if (decisionIndex === -1)
    errors.push(`decision.key "${decKey}" 가 선택지에 없습니다 — 결정을 직접 선택하세요.`)

  // exhibit: 유효 정수면 사용, 아니면 폼 기본값(nextExhibit)
  const exNum = Number(data.exhibit)
  const exhibit = Number.isInteger(exNum) && exNum > 0 ? exNum : fallbackExhibit

  // slug: 형식 위반은 경고하되 값은 주입(사용자가 수정)
  const slug = asStr(data.slug)
  if (slug && !SLUG_RE.test(slug))
    errors.push('slug 형식 경고 — 영문 kebab-case 로 수정하세요(값은 채웠습니다).')

  const rationale = asStr(data.rationale_md)
  if (!rationale.trim())
    errors.push('★ 근거(rationale_md)가 비어 있습니다 — 이 코너의 핵심이니 직접 작성하세요.')
  const result = asStr(data.result)
  if (!result.trim())
    errors.push('결과(result)가 비어 있습니다 — 직접 작성하거나 [추기 예정: …] 로 두세요.')

  const ledger = data.aiLedger && typeof data.aiLedger === 'object' ? data.aiLedger : {}

  const form: ComposerForm = {
    title: asStr(data.title),
    slug,
    exhibit,
    category: asStr(data.category),
    question: asStr(data.question),
    options: options.length ? options : [
      { title: '', tradeoff: '' },
      { title: '', tradeoff: '' },
    ],
    decisionIndex,
    decisionLabel: asStr(dec.label),
    decisionSub: asStr(dec.sub),
    result,
    ledgerClaude: asStr(ledger.claude),
    ledgerMe: asStr(ledger.me),
    date: asStr(data.date),
    rationale,
  }

  // 보강 1: 라운드트립 자기검증 — form→toCanonical 이 구조적으로 온전한지 가벼운 점검(파서·직렬화
  // 드리프트 그물). 값 불일치는 throw 가 아니라 [debug] 항목으로 errors 에 남긴다.
  try {
    const rt: any = toCanonical(form)
    if (!Array.isArray(rt.options) || rt.options.length !== options.length)
      errors.push('[debug] 라운드트립: options 매핑 드리프트')
    if (typeof rt.rationale_md !== 'string')
      errors.push('[debug] 라운드트립: rationale_md 필드 누락(직렬화 드리프트)')
    if (!rt.aiLedger || typeof rt.aiLedger.claude !== 'string')
      errors.push('[debug] 라운드트립: aiLedger 드리프트')
    if (decisionIndex >= 0 && rt.decision?.key !== keys[decisionIndex])
      errors.push('[debug] 라운드트립: decision.key 매핑 드리프트')
  } catch {
    errors.push('[debug] 라운드트립 검증 예외 — 파서/직렬화 드리프트 가능성')
  }

  return { ok: true, form, errors }
}
