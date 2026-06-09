'use client'

import { useState } from 'react'

// BYOAI 내보내기 — AI 호출 없는 순수 클라이언트. 프리셋 프롬프트(편집 가능) + 현재 본문을
// 클립보드로 복사해 외부 AI 와 논의. 프리셋별 편집 내용은 상위(EditorShell)에서 보존(탭 전환에도).
export type ByoaiPreset =
  | 'proofread'
  | 'structure'
  | 'content'
  | 'voice'
  | 'thinking'
  | 'free'

export const BYOAI_PRESETS: { key: ByoaiPreset; label: string; prompt: string }[] = [
  {
    key: 'proofread',
    label: '교정',
    prompt:
      "아래 글의 맞춤법·띄어쓰기·문법·오타만 교정해 주세요. 문체나 표현은 바꾸지 말고, 고친 부분은 '원래 → 고침 (이유)' 형태로 알려주세요. 그리고 마지막에, 철학적 글쓰기의 관점에서 개념이 모호하거나 더 정확하게 표현할 수 있는 부분이 있으면 한두 가지만 따로(교정과 구분해) 짚어 주세요.",
  },
  {
    key: 'structure',
    label: '구조분석',
    prompt:
      '아래 글의 논증 구조를 깊이 비평해 주세요. 주제(주장)가 분명한지, 주장→근거→예시의 흐름에 빈틈이나 비약은 없는지, 예상 반론을 충분히 다뤘는지, 결론이 논증에서 자연스럽게 따라 나오는지 짚어 주세요. 더해서, 소크라테스식 문답·변증법·반증가능성 같은 철학적 관점에서 보면 이 논증의 약한 고리가 어디인지도 함께 짚어 주세요. 약한 부분은 어떻게 고치면 좋을지 제안하고, 더 볼 곳이 있으면 제게 되물어 주세요.',
  },
  {
    key: 'content',
    label: '내용 논의',
    prompt:
      '아래 글을 진지한 대화 상대로서 읽고 내용에 대해 토론해 주세요. 어디에 동의하고 어디에 동의하지 않는지, 빠진 관점이나 더 강한 반례는 없는지 솔직하게 말해 주세요. 가능하면 철학적 시각이나 유발 하라리·칼 포퍼·한나 아렌트·다니엘 카너먼 같은 사상가라면 이 주제를 어떻게 볼지도 한두 관점으로 제시해 주세요. 칭찬보다 생각을 밀어붙이는 쪽으로, 한두 가지씩 던지고 제 반응을 기다려 주세요.',
  },
  {
    key: 'voice',
    label: '필체 논의',
    prompt:
      '아래 글의 문체(필체)를 분석하고 함께 이야기해 주세요. 지금 글의 목소리·리듬·문장 길이·어조의 특징과 강점·약점을 짚어 주세요. 그리고 유발 하라리·칼 세이건·조지 오웰·김영하 같은 저자의 문체를 이 글에 적용한다면 무엇이 좋아지고 무엇을 잃을지 구체적으로 논의해 주세요. 원하면 한 단락을 그 문체로 다시 써서 비교해 주셔도 좋습니다.',
  },
  {
    key: 'thinking',
    label: '사고방식 논의',
    prompt:
      '아래 글에 담긴 사고 방식을 함께 들여다봐 주세요. 제가 어떻게 전제를 세우고 근거를 잇고 결론에 이르는지, 그 사고 패턴과 약점(성급한 일반화, 빠진 가정 등)을 짚어 주세요. 그리고 소크라테스식 질문·변증법 같은 철학적 사고법이나 유발 하라리·칼 포퍼·다니엘 카너먼 같은 사상가의 사고 방식을 이 주제에 적용하면 어떻게 달리 접근하게 될지 논의해 주세요. 한두 가지씩 묻고 제 답을 기다린 뒤 더 깊이 들어가 주세요.',
  },
  { key: 'free', label: '자유 입력', prompt: '' },
]

const DEFAULTS: Record<ByoaiPreset, string> = Object.fromEntries(
  BYOAI_PRESETS.map((p) => [p.key, p.prompt])
) as Record<ByoaiPreset, string>

export default function ByoaiPanel({
  body,
  preset,
  onPreset,
  drafts,
  onDraft,
}: {
  body: string
  preset: ByoaiPreset
  onPreset: (p: ByoaiPreset) => void
  drafts: Partial<Record<ByoaiPreset, string>>
  onDraft: (p: ByoaiPreset, text: string) => void
}) {
  const [copied, setCopied] = useState(false)
  // 편집값 우선, 없으면 프리셋 기본 문구(자유 입력은 '')
  const promptText = drafts[preset] ?? DEFAULTS[preset]

  const copy = async () => {
    const text = `${promptText}\n\n---\n\n${body}`
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="mt-4 min-w-0">
      <p className="text-[11px] leading-relaxed text-ink-3">
        프롬프트와 현재 글을 복사해 외부 AI(ChatGPT·Claude 등)와 논의하세요. AI 호출 없음.
      </p>

      {/* 프리셋 선택 — 칩 */}
      <div className="mt-3 flex flex-wrap gap-1.5" role="group" aria-label="BYOAI 프리셋">
        {BYOAI_PRESETS.map((p) => (
          <button
            key={p.key}
            type="button"
            aria-pressed={preset === p.key}
            onClick={() => onPreset(p.key)}
            className={`rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors ${
              preset === p.key
                ? 'border-coral-soft bg-coral/10 text-coral-2'
                : 'border-line text-ink-3 hover:text-ink-2'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* 편집 가능한 프롬프트 */}
      <textarea
        value={promptText}
        onChange={(e) => onDraft(preset, e.target.value)}
        placeholder={preset === 'free' ? '프롬프트를 직접 작성하세요…' : ''}
        rows={6}
        aria-label="프롬프트"
        className="mt-3 block w-full min-w-0 resize-y rounded-xl border border-line bg-surface px-3 py-2.5 text-sm leading-relaxed text-ink outline-none focus:border-coral-soft"
      />

      <button
        type="button"
        onClick={copy}
        className="mt-3 rounded-lg bg-coral-2 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-coral"
      >
        {copied ? '복사됨 ✓' : '프롬프트 + 글 복사'}
      </button>
    </div>
  )
}
