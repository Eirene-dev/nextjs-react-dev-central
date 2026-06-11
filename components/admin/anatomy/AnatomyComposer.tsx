'use client'

import { useMemo, useState } from 'react'
import {
  type ComposerForm,
  letterFor,
  toMdx,
  toJson,
  validate,
  SLUG_RE,
  buildByoaiPrompt,
  parseCanonical,
} from '@/lib/anatomy-mdx'

// 해부 컴포저 — 폼 → 완성 MDX/JSON 변환 도구. 저장은 그대로 git(MDX). DB 없음.
// 절차: 복사 → data/anatomy/<slug>.mdx 생성 → 사실 검증 → 커밋 → 머지(=게시).

// 가이드 4장 승격 체크리스트(표시용 — 차단하지 않음).
const CHECKLIST = [
  '실제 선택지가 2개 이상 존재했다 (사후 재구성이면 명시)',
  '무엇을 버렸는지 한 문장으로 말할 수 있다',
  '결과를 관찰할 수 있다 (또는 [추기 예정]으로 추적 가능)',
  '질문이 독자에게도 성립한다 (그 프로젝트를 몰라도 투표 가능)',
  '사실관계 검증 목록을 만들었다 (수치·문구·시점 — 커밋 전 확인)',
]

const FIELD =
  'w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink outline-none placeholder:text-ink-3 focus:border-coral-soft'
const LABEL = 'block text-[13px] font-bold text-ink-2'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-line bg-surface-2 p-4 sm:p-5">
      <h2 className="text-sm font-extrabold tracking-tight text-ink">{title}</h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  )
}

export default function AnatomyComposer({
  nextExhibit,
  existingSlugs,
  categories,
}: {
  nextExhibit: number
  existingSlugs: string[]
  categories: string[]
}) {
  const [form, setForm] = useState<ComposerForm>({
    title: '',
    slug: '',
    exhibit: nextExhibit,
    category: '',
    question: '',
    options: [
      { title: '', tradeoff: '' },
      { title: '', tradeoff: '' },
      { title: '', tradeoff: '' },
    ],
    decisionIndex: 0,
    decisionLabel: '',
    decisionSub: '',
    result: '',
    ledgerClaude: '',
    ledgerMe: '',
    date: '',
    rationale: '',
  })
  const [checks, setChecks] = useState<boolean[]>(CHECKLIST.map(() => false))
  const [copied, setCopied] = useState<'' | 'mdx' | 'json'>('')

  // BYOAI(AI로 초안 잡기) 상태
  const [byoaiOpen, setByoaiOpen] = useState(true)
  const [context, setContext] = useState('')
  const [pasteText, setPasteText] = useState('')
  const [injectErrors, setInjectErrors] = useState<string[]>([])
  const [promptCopied, setPromptCopied] = useState(false)

  const set = <K extends keyof ComposerForm>(k: K, v: ComposerForm[K]) =>
    setForm((f) => ({ ...f, [k]: v }))

  const setOption = (i: number, k: 'title' | 'tradeoff', v: string) =>
    setForm((f) => ({ ...f, options: f.options.map((o, j) => (j === i ? { ...o, [k]: v } : o)) }))

  const addOption = () =>
    setForm((f) => (f.options.length >= 4 ? f : { ...f, options: [...f.options, { title: '', tradeoff: '' }] }))

  const removeOption = (i: number) =>
    setForm((f) => {
      if (f.options.length <= 2) return f
      const options = f.options.filter((_, j) => j !== i)
      // decision 인덱스 보정(삭제로 어긋나지 않게)
      let decisionIndex = f.decisionIndex
      if (i === f.decisionIndex) decisionIndex = 0
      else if (i < f.decisionIndex) decisionIndex = f.decisionIndex - 1
      return { ...f, options, decisionIndex }
    })

  const errors = useMemo(() => validate(form), [form])
  const slugConflict = form.slug.trim() !== '' && existingSlugs.includes(form.slug.trim())
  const ready = errors.length === 0
  const mdx = useMemo(() => (ready ? toMdx(form) : ''), [form, ready])
  const json = useMemo(() => (ready ? toJson(form) : ''), [form, ready])

  const copy = async (text: string, which: 'mdx' | 'json') => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(which)
      setTimeout(() => setCopied(''), 1500)
    } catch {
      /* noop */
    }
  }

  const download = () => {
    const blob = new Blob([mdx], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${form.slug || 'exhibit'}.mdx`
    a.click()
    URL.revokeObjectURL(url)
  }

  // BYOAI: 프롬프트(컨텍스트 반영) + 폼이 비어있지 않은지(덮어쓰기 confirm 용)
  const byoaiPrompt = useMemo(() => buildByoaiPrompt(context), [context])
  const formDirty = useMemo(() => {
    const f = form
    return !!(
      f.title || f.slug || f.category || f.question || f.result || f.decisionLabel ||
      f.decisionSub || f.ledgerClaude || f.ledgerMe || f.date || f.rationale ||
      f.options.some((o) => o.title || o.tradeoff)
    )
  }, [form])

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(byoaiPrompt)
      setPromptCopied(true)
      setTimeout(() => setPromptCopied(false), 1500)
    } catch {
      /* noop */
    }
  }

  const injectFromPaste = () => {
    const res = parseCanonical(pasteText, form.exhibit)
    if (!res.ok || !res.form) {
      setInjectErrors(res.errors)
      return
    }
    if (formDirty && !window.confirm('현재 폼 내용을 덮어씁니다. 계속할까요?')) return
    setForm(res.form)
    setInjectErrors(res.errors)
  }

  const btn =
    'rounded-lg bg-coral px-3.5 py-2 text-sm font-bold text-white transition-colors hover:bg-coral-2 disabled:cursor-not-allowed disabled:opacity-40'
  const btnGhost =
    'rounded-lg border border-line bg-surface px-3.5 py-2 text-sm font-bold text-ink-2 transition-colors hover:border-coral-soft hover:text-ink disabled:cursor-not-allowed disabled:opacity-40'

  return (
    <>
      {/* ── AI로 초안 잡기 (BYOAI) — 폼 상단, 접이식 ── */}
      <section className="mt-6 rounded-xl border border-dashed border-coral-soft bg-surface-2 p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-extrabold tracking-tight text-ink">
            AI로 초안 잡기 <span className="font-normal text-ink-3">— 선택</span>
          </h2>
          <button
            type="button"
            onClick={() => setByoaiOpen((v) => !v)}
            className="text-[12px] font-semibold text-ink-3 hover:text-coral-2"
          >
            {byoaiOpen ? '접기 ▲' : '펼치기 ▼'}
          </button>
        </div>

        {byoaiOpen && (
          <div className="mt-3 space-y-4">
            <p className="text-[12.5px] leading-relaxed text-ink-2">
              프롬프트 복사 → 내 AI와 대화 → 받은 JSON 붙여넣기 → 폼에 채우기 → 검토·수정 → (기존) 커밋
              <br />
              <span className="font-semibold text-coral-2">
                AI는 구조화만 — 판단과 근거는 직접 확인·보강하세요.
              </span>
            </p>

            <div className="grid gap-4 lg:grid-cols-2">
              {/* 프롬프트 */}
              <div className="space-y-2">
                <label className={LABEL} htmlFor="ac-ctx">
                  무슨 결정이었나 <span className="font-normal text-ink-3">— 선택, 비워도 됨</span>
                </label>
                <input
                  id="ac-ctx"
                  className={FIELD}
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="예: 댓글 삭제 시 답글 처리"
                />
                <button type="button" onClick={copyPrompt} className={btn}>
                  {promptCopied ? '복사됨 ✓' : '프롬프트 복사'}
                </button>
                <pre className="max-h-[220px] overflow-auto rounded-lg border border-line bg-surface p-3 font-mono text-[11.5px] leading-relaxed text-ink-2">
                  {byoaiPrompt}
                </pre>
              </div>

              {/* 붙여넣기 → 주입 */}
              <div className="space-y-2">
                <label className={LABEL} htmlFor="ac-paste">
                  받은 JSON 붙여넣기
                </label>
                <textarea
                  id="ac-paste"
                  rows={9}
                  className={`${FIELD} resize-y font-mono text-[12px]`}
                  value={pasteText}
                  onChange={(e) => setPasteText(e.target.value)}
                  placeholder='{ "title": "...", "options": [ … ], "decision": { … }, … }'
                />
                <button
                  type="button"
                  onClick={injectFromPaste}
                  disabled={!pasteText.trim()}
                  className={btn}
                >
                  폼에 채우기
                </button>
              </div>
            </div>

            {/* 주입 결과 요약 */}
            {injectErrors.length > 0 && (
              <div className="rounded-lg border border-coral-soft bg-coral/5 p-3">
                <p className="text-[12.5px] font-bold text-coral-2">
                  주입 결과 — AI가 비웠거나 확인이 필요한 항목
                </p>
                <ul className="mt-1.5 list-disc space-y-0.5 pl-5 text-[12px] text-ink-2">
                  {injectErrors.map((e, i) => (
                    <li key={i} className={e.startsWith('★') ? 'font-bold text-coral-2' : ''}>
                      {e}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </section>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
      {/* ── 입력 ── */}
      <div className="space-y-4">
        <Section title="기본">
          <div>
            <label className={LABEL} htmlFor="ac-title">
              제목 <span className="font-normal text-ink-3">— 선언형 한 문장</span>
            </label>
            <input
              id="ac-title"
              className={`${FIELD} mt-1`}
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="~했다 / ~인가"
            />
          </div>

          <div className="grid grid-cols-[1fr_auto] gap-3">
            <div>
              <label className={LABEL} htmlFor="ac-slug">
                slug <span className="font-normal text-ink-3">— 영문 kebab-case</span>
              </label>
              <input
                id="ac-slug"
                className={`${FIELD} mt-1 font-mono`}
                value={form.slug}
                onChange={(e) => set('slug', e.target.value)}
                placeholder="demo-isolation"
              />
            </div>
            <div className="w-24">
              <label className={LABEL} htmlFor="ac-exhibit">
                exhibit
              </label>
              <input
                id="ac-exhibit"
                type="number"
                min={1}
                className={`${FIELD} mt-1`}
                value={form.exhibit}
                onChange={(e) => set('exhibit', parseInt(e.target.value, 10) || 0)}
              />
            </div>
          </div>
          {form.slug.trim() !== '' && !SLUG_RE.test(form.slug.trim()) && (
            <p className="text-[12px] font-semibold text-coral-2">
              slug 형식 오류 — 소문자·숫자·하이픈만 사용하세요.
            </p>
          )}
          {slugConflict && (
            <p className="text-[12px] font-semibold text-coral-2">
              ⚠ 이미 존재하는 slug 입니다 (data/anatomy/{form.slug}.mdx). 덮어쓰기 주의.
            </p>
          )}

          <div>
            <label className={LABEL} htmlFor="ac-category">
              category
            </label>
            <input
              id="ac-category"
              className={`${FIELD} mt-1`}
              list="ac-categories"
              value={form.category}
              onChange={(e) => set('category', e.target.value)}
              placeholder="아키텍처 / 데이터 설계 …"
            />
            <datalist id="ac-categories">
              {categories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>

          <div>
            <label className={LABEL} htmlFor="ac-question">
              질문 <span className="font-normal text-ink-3">— 배경 2~3문장 + 당신이라면?</span>
            </label>
            <textarea
              id="ac-question"
              rows={3}
              className={`${FIELD} mt-1 resize-y`}
              value={form.question}
              onChange={(e) => set('question', e.target.value)}
            />
          </div>
        </Section>

        <Section title="선택지 (2~4)">
          {form.options.map((o, i) => (
            <div key={i} className="rounded-lg border border-line bg-surface p-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[12px] font-bold text-coral-2">
                  선택지 {letterFor(i)}
                </span>
                <button
                  type="button"
                  onClick={() => removeOption(i)}
                  disabled={form.options.length <= 2}
                  className="text-[12px] font-semibold text-ink-3 hover:text-coral-2 disabled:opacity-30"
                >
                  삭제
                </button>
              </div>
              <input
                className={`${FIELD} mt-2`}
                value={o.title}
                onChange={(e) => setOption(i, 'title', e.target.value)}
                placeholder="제목"
                aria-label={`선택지 ${letterFor(i)} 제목`}
              />
              <textarea
                rows={2}
                className={`${FIELD} mt-2 resize-y`}
                value={o.tradeoff}
                onChange={(e) => setOption(i, 'tradeoff', e.target.value)}
                placeholder="트레이드오프 — 장점과 대가를 한 문장에"
                aria-label={`선택지 ${letterFor(i)} 트레이드오프`}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addOption}
            disabled={form.options.length >= 4}
            className={`${btnGhost} w-full`}
          >
            + 선택지 추가
          </button>
        </Section>

        <Section title="내 결정">
          <div>
            <span className={LABEL}>어느 선택지였나 (라디오 = decision.key)</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {form.options.map((o, i) => (
                <label
                  key={i}
                  className={`flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-semibold transition-colors ${
                    form.decisionIndex === i
                      ? 'border-coral-2 bg-coral/10 text-coral-2'
                      : 'border-line text-ink-2 hover:border-coral-soft'
                  }`}
                >
                  <input
                    type="radio"
                    name="ac-decision"
                    className="sr-only"
                    checked={form.decisionIndex === i}
                    onChange={() => set('decisionIndex', i)}
                  />
                  {letterFor(i)}. {o.title || '(제목 없음)'}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className={LABEL} htmlFor="ac-dlabel">
              결정 한 줄(label)
            </label>
            <input
              id="ac-dlabel"
              className={`${FIELD} mt-1`}
              value={form.decisionLabel}
              onChange={(e) => set('decisionLabel', e.target.value)}
            />
          </div>
          <div>
            <label className={LABEL} htmlFor="ac-dsub">
              조건(sub) <span className="font-normal text-ink-3">— 선택, "단, ~"</span>
            </label>
            <input
              id="ac-dsub"
              className={`${FIELD} mt-1`}
              value={form.decisionSub}
              onChange={(e) => set('decisionSub', e.target.value)}
            />
          </div>
        </Section>

        <Section title="결과 · AI 분업 · 날짜">
          <div>
            <div className="flex items-center justify-between">
              <label className={LABEL} htmlFor="ac-result">
                결과(result)
              </label>
              <button
                type="button"
                onClick={() => set('result', (form.result + ' [추기 예정: ]').trim())}
                className="text-[12px] font-semibold text-coral-2 hover:text-coral"
              >
                + [추기 예정: ] 삽입
              </button>
            </div>
            <textarea
              id="ac-result"
              rows={2}
              className={`${FIELD} mt-1 resize-y`}
              value={form.result}
              onChange={(e) => set('result', e.target.value)}
            />
          </div>
          <div>
            <label className={LABEL} htmlFor="ac-claude">
              AI 분업 — Claude Code 가 한 것
            </label>
            <textarea
              id="ac-claude"
              rows={2}
              className={`${FIELD} mt-1 resize-y`}
              value={form.ledgerClaude}
              onChange={(e) => set('ledgerClaude', e.target.value)}
            />
          </div>
          <div>
            <label className={LABEL} htmlFor="ac-me">
              AI 분업 — 내가 결정한 것
            </label>
            <textarea
              id="ac-me"
              rows={2}
              className={`${FIELD} mt-1 resize-y`}
              value={form.ledgerMe}
              onChange={(e) => set('ledgerMe', e.target.value)}
            />
          </div>
          <div className="w-44">
            <label className={LABEL} htmlFor="ac-date">
              date <span className="font-normal text-ink-3">— 선택</span>
            </label>
            <input
              id="ac-date"
              type="date"
              className={`${FIELD} mt-1`}
              value={form.date}
              onChange={(e) => set('date', e.target.value)}
            />
          </div>
        </Section>

        <Section title="근거 본문 — 저자의 목소리 (문단 = 빈 줄)">
          <textarea
            rows={8}
            className={`${FIELD} resize-y`}
            value={form.rationale}
            onChange={(e) => set('rationale', e.target.value)}
            placeholder="무엇을 버렸는지가 핵심이다. 2~3문단."
            aria-label="근거 본문"
          />
        </Section>

        <Section title="승격 체크리스트 (표시용 — 게시를 막지 않음)">
          <ul className="space-y-2">
            {CHECKLIST.map((c, i) => (
              <li key={i}>
                <label className="flex cursor-pointer items-start gap-2 text-[13px] text-ink-2">
                  <input
                    type="checkbox"
                    checked={checks[i]}
                    onChange={() => setChecks((cs) => cs.map((x, j) => (j === i ? !x : x)))}
                    className="mt-0.5 accent-coral"
                  />
                  <span>{c}</span>
                </label>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      {/* ── 출력 ── */}
      <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-lg border border-dashed border-line bg-surface-2 px-4 py-2.5 text-[12.5px] text-ink-2">
          복사 → <code className="font-mono text-coral-2">data/anatomy/{form.slug || '<slug>'}.mdx</code> 생성 → 사실 검증 → 커밋 → 머지(=게시)
        </div>

        {!ready && (
          <div className="rounded-xl border border-coral-soft bg-coral/5 p-4">
            <p className="text-[13px] font-bold text-coral-2">출력하려면 다음을 채우세요</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-[12.5px] text-ink-2">
              {errors.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </div>
        )}

        {/* MDX */}
        <div className="rounded-xl border border-line bg-surface-2 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-ink">MDX 미리보기</h2>
            <div className="flex gap-2">
              <button type="button" onClick={() => copy(mdx, 'mdx')} disabled={!ready} className={btn}>
                {copied === 'mdx' ? '복사됨 ✓' : 'MDX 복사'}
              </button>
              <button type="button" onClick={download} disabled={!ready} className={btnGhost}>
                .mdx 다운로드
              </button>
            </div>
          </div>
          <pre className="font-mono mt-3 max-h-[420px] overflow-auto rounded-lg border border-line bg-surface p-3 text-[12px] leading-relaxed text-ink-2">
            {ready ? mdx : '— 입력을 완료하면 MDX 가 생성됩니다 —'}
          </pre>
        </div>

        {/* JSON */}
        <div className="rounded-xl border border-line bg-surface-2 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-ink">
              canonical JSON <span className="font-normal text-ink-3">— 이식용</span>
            </h2>
            <button type="button" onClick={() => copy(json, 'json')} disabled={!ready} className={btn}>
              {copied === 'json' ? '복사됨 ✓' : 'JSON 복사'}
            </button>
          </div>
          <pre className="font-mono mt-3 max-h-[320px] overflow-auto rounded-lg border border-line bg-surface p-3 text-[12px] leading-relaxed text-ink-2">
            {ready ? json : '— 입력을 완료하면 JSON 이 생성됩니다 —'}
          </pre>
        </div>
      </div>
    </div>
    </>
  )
}
