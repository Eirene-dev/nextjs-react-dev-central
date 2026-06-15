import ScrollSection from '@/components/showcases/scroll/ScrollSection'
import Pinned from '@/components/showcases/scroll/Pinned'
import ToneFlip from '@/components/showcases/scroll/ToneFlip'
import { Breadcrumb, Hero, BeatLabel, BottomCta } from './parts'

// Ledgr — 스트라이프 랜딩 문법(sticky 코드 왈츠·마케팅↔코드 듀얼리티·그라디언트 메시).
// ★ 데모가 sticky 코드/메시 시그니처라 메타 해설 전용 — 실제 코드 워크스루 재연 금지.
// 안무는 Aura/Vanta와 다르게: sticky 코드 왈츠(Pinned) → 마케팅/코드 듀얼리티(ToneFlip) → 그라디언트 메시.
export default function LedgrNarrative({ title, demoHref }: { title: string; demoHref: string }) {
  return (
    <div className="py-16">
      <Breadcrumb />

      <Hero
        kicker="스타일 연구 · 스트라이프 문법"
        headline="마케팅과 코드가 한 페이지에."
        demoHref={demoHref}
        title={title}
        hint="또는 아래로 — 세 가지 기법을 먼저 보기 ↓"
      >
        <p className="mt-6 text-lg leading-relaxed text-ink-2">
          <strong className="text-ink">{title}</strong>는 스트라이프 랜딩의 디자인 문법을 해부한 가상 결제
          도구입니다. 고정된 코드 패널과 흐르는 설명, 그리고 그라디언트 메시 — 제품이 아니라{' '}
          <em className="not-italic text-ink">그 문법</em>을 봅니다.
        </p>
      </Hero>

      {/* ── 기법 ① sticky 코드 왈츠 ── */}
      <section className="mt-24 sm:mt-28">
        <BeatLabel n="01" name="코드는 고정, 설명은 흐른다" />
        <Pinned
          focal={
            <p className="max-w-2xl text-3xl font-bold leading-snug tracking-tight text-ink sm:text-5xl">
              코드는 멈추고, 설명만 흐른다.
            </p>
          }
          steps={[
            '오른쪽 코드 패널을 화면에 고정한 채(sticky)',
            '왼쪽 설명이 단계마다 스크롤로 바뀌고',
            '코드도 그 단계에 맞춰 함께 바뀐다 — 읽기와 보기가 동기화.',
          ]}
        />
      </section>

      {/* ── 기법 ② 마케팅↔코드 듀얼리티 ── */}
      <section className="mt-24 sm:mt-28">
        <BeatLabel n="02" name="설득과 증거" />
        <div className="mt-8">
          <ToneFlip>
            <p className="max-w-2xl text-3xl font-bold leading-snug tracking-tight sm:text-5xl">
              밝은 마케팅 면과 어두운 코드 면이 번갈아.
            </p>
            <p className="mt-6 max-w-xl text-lg opacity-90">
              한쪽은 설득, 한쪽은 증거 — 결정권자와 개발자에게 동시에 말한다. 스트라이프가 둘을 한
              페이지에 담는 법.
            </p>
          </ToneFlip>
        </div>
      </section>

      {/* ── 기법 ③ 그라디언트 메시 ── */}
      <section className="mt-24 sm:mt-28">
        <BeatLabel n="03" name="그라디언트 메시" />
        <ScrollSection className="mt-8">
          <div className="relative h-56 overflow-hidden rounded-3xl border border-line sm:h-72">
            {/* 흐릿하게 겹친 라디얼 그라디언트 — 스트라이프식 '메시'를 evoke(데모 메시 재연 아님) */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(55% 75% at 18% 22%, rgba(99,102,241,0.55), transparent 60%), radial-gradient(50% 70% at 82% 28%, rgba(45,212,191,0.5), transparent 60%), radial-gradient(60% 80% at 60% 92%, rgba(168,85,247,0.45), transparent 60%), #0a0a12',
              }}
              aria-hidden
            />
            <span className="absolute bottom-5 left-6 font-mono text-xs uppercase tracking-[0.16em] text-white/70">
              gradient mesh
            </span>
          </div>
          <p className="mt-5 max-w-xl text-lg text-ink-2">
            코드 제품에도 분위기를 — 흐릿하게 겹친 그라디언트가 차갑지 않은 &lsquo;첨단&rsquo;의 인상을
            만든다. 기능 설명 위에 깔리는 무드.
          </p>
        </ScrollSection>
      </section>

      <BottomCta demoHref={demoHref} title={title}>
        세 기법이 하나의 개발자 랜딩으로 — sticky 코드 왈츠와 그라디언트 메시로. 코드 동기화 외 JS는 최소.
      </BottomCta>
    </div>
  )
}
