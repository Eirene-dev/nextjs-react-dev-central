import ScrollSection from '@/components/showcases/scroll/ScrollSection'
import GiantType from '@/components/showcases/scroll/GiantType'
import CounterScrub from '@/components/showcases/scroll/CounterScrub'
import { Breadcrumb, Hero, BeatLabel, BottomCta } from './parts'

// Drift — CSS Scroll-driven Animations(animation-timeline). 데모는 JS 0줄 스크롤 내러티브.
// ★ 메타 해설 전용 — 데모의 커피 여정(seed→cup) 재연 금지. 시그니처 비트 = 스크롤 진행도 카운터.
export default function DriftNarrative({ title, demoHref }: { title: string; demoHref: string }) {
  return (
    <div className="py-16">
      <Breadcrumb />

      <Hero
        kicker="웹 플랫폼 · scroll-driven"
        headline="스크롤이 곧 타임라인."
        demoHref={demoHref}
        title={title}
        hint="또는 아래로 — 세 가지 포인트를 먼저 보기 ↓"
      >
        <p className="mt-6 text-lg leading-relaxed text-ink-2">
          <strong className="text-ink">{title}</strong>는 CSS Scroll-driven Animations(animation-timeline)
          만으로 짠 스크롤 내러티브입니다. JS 0줄 — 스크롤 위치가 그대로 애니메이션 진행도가 됩니다. 제품이
          아니라 <em className="not-italic text-ink">그 플랫폼 기능</em>을 봅니다.
        </p>
      </Hero>

      {/* ── 포인트 ① 스크롤 = 진행도(시그니처) ── */}
      <section className="mt-16 sm:mt-20">
        <BeatLabel n="01" name="스크롤 = 진행도" />
        <div className="mt-10 grid gap-10 sm:grid-cols-[auto_1fr] sm:items-end">
          <CounterScrub to={100} suffix="%" label="스크롤 위치 = 애니메이션 진행도" />
          <p className="max-w-md text-lg text-ink-2">
            스크롤을 내릴수록 0%에서 100%로. 이 값에 무엇이든 묶으면 — 색, 위치, 크기 — 스크롤이 그걸
            움직인다. 이게 animation-timeline이다.
          </p>
        </div>
      </section>

      {/* ── 포인트 ② CSS 한 줄 ── */}
      <section className="mt-16 sm:mt-20">
        <BeatLabel n="02" name="한 줄이면 된다" />
        <ScrollSection className="mt-8 max-w-xl">
          <pre className="overflow-x-auto rounded-2xl border border-line bg-[#0b0b12] p-5 font-mono text-sm leading-relaxed text-ink-2">
            <code>
              <span className="text-coral-2">animation-timeline</span>: view();
            </code>
          </pre>
          <p className="mt-5 text-lg text-ink-2">
            예전엔 IntersectionObserver와 scroll 리스너로 짜던 리빌·패럴랙스를, 이제 CSS 속성 하나로. 메인
            스레드를 막지 않아 잰크도 없다.
          </p>
        </ScrollSection>
      </section>

      {/* ── 포인트 ③ JS 0줄 ── */}
      <section className="mt-16 sm:mt-20">
        <BeatLabel n="03" name="JS는 0줄" />
        <GiantType
          words={['움직임은', 'CSS,', 'JS는 0줄.']}
          className="mt-6 text-5xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-7xl"
        />
        <ScrollSection className="mt-8 max-w-xl text-lg text-ink-2">
          내러티브 전체가 마크업과 CSS뿐. 브라우저가 스크롤을 직접 읽으니, 라이브러리도 번들도 필요 없다.
        </ScrollSection>
      </section>

      <BottomCta demoHref={demoHref} title={title}>
        세 포인트가 하나의 스크롤 내러티브로 — animation-timeline만으로, JS 0줄·이미지 0.
      </BottomCta>
    </div>
  )
}
