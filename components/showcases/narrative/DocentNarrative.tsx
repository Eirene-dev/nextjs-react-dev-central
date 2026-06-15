import ScrollSection from '@/components/showcases/scroll/ScrollSection'
import Pinned from '@/components/showcases/scroll/Pinned'
import { Breadcrumb, Hero, BeatLabel, BottomCta } from './parts'

// Docent — 제품 문서 Q&A + 근거 문단 하이라이트, 근거 없으면 "없습니다". 데모는 인터랙티브.
// ★ AI×웹 서브패턴. 시그니처 = 답 → 근거 인용(원문 하이라이트) 연결.
export default function DocentNarrative({ title, demoHref }: { title: string; demoHref: string }) {
  return (
    <div className="py-16">
      <Breadcrumb />

      <Hero
        kicker="AI×웹 · 근거 있는 답"
        headline="답엔 반드시 근거가 붙는다."
        demoHref={demoHref}
        title={title}
        hint="또는 아래로 — 동작 원리를 먼저 보기 ↓"
      >
        <p className="mt-6 text-lg leading-relaxed text-ink-2">
          <strong className="text-ink">{title}</strong>는 제품 문서에 묻고 답하되, 답의 근거가 된 문단을
          함께 하이라이트하는 데모입니다. 근거가 없으면 솔직하게 &lsquo;없습니다&rsquo;. 아래는 그 원리 —
          답과 근거를 잇는다.
        </p>
      </Hero>

      {/* ── 원리 ① 질문 ── */}
      <section className="mt-16 sm:mt-20">
        <BeatLabel n="01" name="질문" />
        <ScrollSection className="mt-8 max-w-xl">
          <div className="flex items-center gap-3 rounded-full border border-line bg-surface-2 px-5 py-3.5">
            <span className="font-mono text-sm text-coral-2">›</span>
            <span className="text-ink-2">환불은 며칠 안에 가능해?</span>
          </div>
        </ScrollSection>
      </section>

      {/* ── 원리 ② 답 + 근거(시그니처) ── */}
      <section className="mt-16 sm:mt-20">
        <BeatLabel n="02" name="답 + 근거" />
        <ScrollSection className="mt-8 max-w-xl">
          <div className="rounded-2xl border border-line bg-surface-2 p-5">
            <p className="text-lg text-ink">
              구매 후 <strong className="text-ink">14일 이내</strong> 환불할 수 있습니다.
              <sup className="ml-1 rounded bg-coral-2/20 px-1.5 py-0.5 align-super font-mono text-[10px] text-coral-2">
                근거 1
              </sup>
            </p>
          </div>
          <div className="mt-3 rounded-2xl border-l-2 border-coral-2 bg-coral-2/5 p-4">
            <p className="font-mono text-[11px] uppercase tracking-wide text-coral-2">근거 1 · 환불 정책 §2</p>
            <p className="mt-1.5 text-ink-2">
              “모든 제품은 <mark className="bg-coral-2/25 text-ink">수령일로부터 14일 이내</mark> 환불 신청이
              가능하다.”
            </p>
          </div>
          <p className="mt-5 text-lg text-ink-2">
            답의 문장이 원문 문단으로 곧장 이어진다. 클릭하면 근거가 하이라이트된다 — 출처 없는 문장은
            없다.
          </p>
        </ScrollSection>
      </section>

      {/* ── 원리 ③ 없으면, 없다(정직) ── */}
      <section className="mt-16 sm:mt-20">
        <BeatLabel n="03" name="없으면, 없다" />
        <Pinned
          focal={
            <p className="max-w-2xl text-3xl font-bold leading-snug tracking-tight text-ink sm:text-5xl">
              근거가 없으면, 지어내지 않는다.
            </p>
          }
          steps={[
            '문서에 답이 있으면 → 근거 문단과 함께',
            '문서에 없으면 → “이 문서엔 해당 정보가 없습니다”',
            '그럴듯한 거짓말 대신, 정직한 “모름”.',
          ]}
        />
      </section>

      <BottomCta demoHref={demoHref} title={title} heading="직접 문서에 물어볼까요?">
        무엇을 물어도 답엔 근거 문단이 붙고, 없으면 없다고 합니다 — 샘플 모드 기본, 키는 BYOA.
      </BottomCta>
    </div>
  )
}
