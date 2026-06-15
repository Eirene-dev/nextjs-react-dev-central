import ScrollSection from '@/components/showcases/scroll/ScrollSection'
import Pinned from '@/components/showcases/scroll/Pinned'
import { Breadcrumb, Hero, BeatLabel, BottomCta } from './parts'

// Relay — 목표를 단계로 쪼개 [실행] 승인마다 진행하는 에이전트(6스텝·루프 가드·결제 직전 정지). 인터랙티브.
// ★ AI×웹 서브패턴. 시그니처 = 단계 카드 타임라인 + [실행] 게이트.
const STEPS: { n: string; label: string; done: boolean }[] = [
  { n: '01', label: '상품을 장바구니에 담기', done: true },
  { n: '02', label: '쿠폰 코드 적용', done: true },
  { n: '03', label: '배송지 확인', done: false },
  { n: '04', label: '결제 — 여기서 멈춤', done: false },
]

export default function RelayNarrative({ title, demoHref }: { title: string; demoHref: string }) {
  return (
    <div className="py-16">
      <Breadcrumb />

      <Hero
        kicker="AI×웹 · 승인형 에이전트"
        headline="승인받고, 한 칸씩."
        demoHref={demoHref}
        title={title}
        hint="또는 아래로 — 동작 원리를 먼저 보기 ↓"
      >
        <p className="mt-6 text-lg leading-relaxed text-ink-2">
          <strong className="text-ink">{title}</strong>는 목표를 단계로 쪼개 [실행]을 눌러야 다음으로 가는
          에이전트 데모입니다. 6스텝·루프 가드, 결제 직전에서 멈춥니다. 아래는 그 원리 — 자동이 아니라
          승인.
        </p>
      </Hero>

      {/* ── 원리 ① 목표 하나 ── */}
      <section className="mt-16 sm:mt-20">
        <BeatLabel n="01" name="목표 하나" />
        <ScrollSection className="mt-8 max-w-xl">
          <div className="flex items-center gap-3 rounded-full border border-line bg-surface-2 px-5 py-3.5">
            <span className="font-mono text-sm text-coral-2">›</span>
            <span className="text-ink-2">장바구니 담고 쿠폰 적용해서 결제 직전까지</span>
          </div>
        </ScrollSection>
      </section>

      {/* ── 원리 ② 단계로 쪼갠다(시그니처 — [실행] 게이트 타임라인) ── */}
      <section className="mt-16 sm:mt-20">
        <BeatLabel n="02" name="단계로 쪼갠다" />
        <ScrollSection className="mt-8 max-w-xl">
          <div className="space-y-2.5">
            {STEPS.map((s) => (
              <div
                key={s.n}
                className="flex items-center gap-3 rounded-2xl border border-line bg-surface-2 p-4"
              >
                <span className="font-mono text-xs text-ink-3">{s.n}</span>
                <span className="text-ink">{s.label}</span>
                <span
                  className={
                    s.done
                      ? 'ml-auto rounded-full bg-coral-2/15 px-3 py-1 text-xs font-semibold text-coral-2'
                      : 'ml-auto rounded-full bg-coral-2 px-3 py-1 text-xs font-semibold text-white'
                  }
                >
                  {s.done ? '완료' : '실행 →'}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-6 text-lg text-ink-2">
            한 번에 다 하지 않는다. 단계마다 <em className="not-italic text-ink">[실행]</em>을 눌러야 다음으로
            — 사람이 매 칸을 승인한다.
          </p>
        </ScrollSection>
      </section>

      {/* ── 원리 ③ 승인 없이는 멈춘다(안전장치) ── */}
      <section className="mt-16 sm:mt-20">
        <BeatLabel n="03" name="승인 없이는 멈춘다" />
        <Pinned
          focal={
            <p className="max-w-2xl text-3xl font-bold leading-snug tracking-tight text-ink sm:text-5xl">
              자율이 아니라, 통제된 자동.
            </p>
          }
          steps={[
            '최대 6스텝 — 무한정 돌지 않는다',
            '루프 가드 — 같은 행동 반복을 끊는다',
            '결제 직전에서 정지 — 진짜 돈은 사람이.',
          ]}
        />
      </section>

      <BottomCta demoHref={demoHref} title={title} heading="직접 목표를 주고 승인해 볼까요?">
        목표를 적으면 단계로 쪼개지고, 매 칸을 승인하며 진행합니다 — 샘플 모드 기본, 키는 BYOA.
      </BottomCta>
    </div>
  )
}
