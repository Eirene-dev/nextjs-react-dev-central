import ScrollSection from '@/components/showcases/scroll/ScrollSection'
import GiantType from '@/components/showcases/scroll/GiantType'
import { Breadcrumb, Hero, BeatLabel, BottomCta } from './parts'

// Canvasly — AI의 structured output을 카드·타임라인·체크리스트로 점진 조립(생성형 UI). 데모는 인터랙티브.
// ★ AI×웹 서브패턴. 시그니처 = 구조화 출력(컴포넌트 목록) → 화면 조립.
const COMPONENTS = ['카드', '타임라인', '체크리스트']

export default function CanvaslyNarrative({ title, demoHref }: { title: string; demoHref: string }) {
  return (
    <div className="py-16">
      <Breadcrumb />

      <Hero
        kicker="AI×웹 · 생성형 UI"
        headline="같은 질문, 매번 다른 UI."
        demoHref={demoHref}
        title={title}
        hint="또는 아래로 — 동작 원리를 먼저 보기 ↓"
      >
        <p className="mt-6 text-lg leading-relaxed text-ink-2">
          <strong className="text-ink">{title}</strong>는 AI의 structured output을 카드·타임라인·체크리스트로
          점진 조립하는 데모입니다. 질문이 바뀌면 화면 구성도 통째로 바뀝니다. 아래는 그 원리 — 구조가
          곧 UI.
        </p>
      </Hero>

      {/* ── 원리 ① 질문 하나 ── */}
      <section className="mt-16 sm:mt-20">
        <BeatLabel n="01" name="질문 하나" />
        <ScrollSection className="mt-8 max-w-xl">
          <div className="flex items-center gap-3 rounded-full border border-line bg-surface-2 px-5 py-3.5">
            <span className="font-mono text-sm text-coral-2">›</span>
            <span className="text-ink-2">주말 교토 2박 일정 짜줘</span>
          </div>
          <p className="mt-5 text-lg text-ink-2">
            미리 만든 화면을 고르는 게 아니다. 답이 어떤 모양일지는 질문이 정한다.
          </p>
        </ScrollSection>
      </section>

      {/* ── 원리 ② 구조화된 출력(시그니처) ── */}
      <section className="mt-16 sm:mt-20">
        <BeatLabel n="02" name="구조가 곧 UI" />
        <ScrollSection className="mt-8 max-w-xl">
          <pre className="overflow-x-auto rounded-2xl border border-line bg-[#0b0b12] p-5 font-mono text-sm leading-relaxed text-ink-2">
            <code>
              {'[\n  { type: '}
              <span className="text-coral-2">&quot;card&quot;</span>
              {', ... },\n  { type: '}
              <span className="text-coral-2">&quot;timeline&quot;</span>
              {', ... },\n  { type: '}
              <span className="text-coral-2">&quot;checklist&quot;</span>
              {', ... }\n]'}
            </code>
          </pre>
          <p className="mt-5 text-lg text-ink-2">
            모델은 문단이 아니라 <em className="not-italic text-ink">컴포넌트 목록</em>을 돌려준다. 웹은 그
            목록을 읽어 화면을 짠다.
          </p>
        </ScrollSection>
      </section>

      {/* ── 원리 ③ 점진 조립 ── */}
      <section className="mt-16 sm:mt-20">
        <BeatLabel n="03" name="점진 조립" />
        <GiantType
          words={['JSON이,', '화면이', '된다.']}
          className="mt-6 text-5xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-7xl"
        />
        <ScrollSection className="mt-8 max-w-md">
          <div className="space-y-3">
            {COMPONENTS.map((c, i) => (
              <div
                key={c}
                className="flex items-center gap-3 rounded-2xl border border-line bg-surface-2 p-4"
              >
                <span className="font-mono text-xs text-ink-3">{String(i + 1).padStart(2, '0')}</span>
                <span className="font-semibold text-ink">{c}</span>
                <span className="ml-auto h-2 w-16 rounded-full bg-coral-2/30" />
              </div>
            ))}
          </div>
          <p className="mt-6 text-lg text-ink-2">
            스트리밍으로 하나씩 도착해 차곡차곡 쌓인다. 같은 입력창, 매번 다른 조립.
          </p>
        </ScrollSection>
      </section>

      <BottomCta demoHref={demoHref} title={title} heading="직접 물어보면 UI가 조립됩니다">
        무엇을 묻느냐에 따라 카드·타임라인·체크리스트가 다르게 짜입니다 — 샘플 모드 기본, 키는 BYOA.
      </BottomCta>
    </div>
  )
}
