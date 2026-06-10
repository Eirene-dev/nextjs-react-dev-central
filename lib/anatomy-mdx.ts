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
