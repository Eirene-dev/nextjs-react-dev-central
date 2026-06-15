import ScrollSection from '@/components/showcases/scroll/ScrollSection'
import GiantType from '@/components/showcases/scroll/GiantType'
import Pinned from '@/components/showcases/scroll/Pinned'
import { Breadcrumb, Hero, BeatLabel, BottomCta } from './parts'

// Vanta — 테슬라 홈 문법(풀스크린 scroll-snap·거대 스펙·라이브 컨피규레이터).
// ★ 데모가 scroll-snap/컨피규레이터 시그니처라 메타 해설 전용 — 차량·가격 시퀀스 재연 금지.
// 안무는 Aura와 다르게: 풀스크린 슬라이드 → 스펙을 크기로 → '선택이 곧 제품' 컨피규레이터로 마무리.
export default function VantaNarrative({ title, demoHref }: { title: string; demoHref: string }) {
  return (
    <div className="py-16">
      <Breadcrumb />

      <Hero
        kicker="스타일 연구 · 테슬라 문법"
        headline="선택이 곧 제품."
        demoHref={demoHref}
        title={title}
        hint="또는 아래로 — 세 가지 기법을 먼저 보기 ↓"
      >
        <p className="mt-6 text-lg leading-relaxed text-ink-2">
          <strong className="text-ink">{title}</strong>는 테슬라 홈 페이지의 디자인 문법을 해부한 가상
          전기차입니다. 풀스크린으로 넘어가는 패널과 고르는 순간 다시 그려지는 컨피규레이터 — 제품이
          아니라 <em className="not-italic text-ink">그 문법</em>을 봅니다.
        </p>
      </Hero>

      {/* ── 기법 ① 풀스크린 scroll-snap = 슬라이드 ── */}
      <section className="mt-16 sm:mt-20">
        <BeatLabel n="01" name="한 패널, 한 주장" />
        <Pinned
          focal={
            <p className="max-w-2xl text-3xl font-bold leading-snug tracking-tight text-ink sm:text-5xl">
              스크롤이 페이지가 아니라 슬라이드를 넘긴다.
            </p>
          }
          steps={[
            '풀스크린 패널이 스크롤마다 딱 맞춰 멈추고(scroll-snap)',
            '한 패널은 하나의 주장만 — 가속, 주행거리, 안전, 하나씩',
            '여백이 곧 자신감. 설명은 짧고, 화면은 크게.',
          ]}
        />
      </section>

      {/* ── 기법 ② 스펙을 크기로 ── */}
      <section className="mt-16 sm:mt-20">
        <BeatLabel n="02" name="스펙을 크기로" />
        <GiantType
          words={['스펙은', '말이 아니라', '크기.']}
          className="mt-6 text-5xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-7xl"
        />
        <ScrollSection className="mt-8 max-w-xl text-lg text-ink-2">
          핵심 숫자 하나를 화면 가득 — 카탈로그 대신 한 방. 제로백도 주행거리도, 단위까지 크게 박아 곧장
          각인시킨다.
        </ScrollSection>
      </section>

      {/* ── 기법 ③ 선택이 즉시 반영 = 컨피규레이터(클라이맥스) ── */}
      <section className="mt-16 sm:mt-20">
        <BeatLabel n="03" name="고르면 즉시 바뀐다" />
        <ScrollSection className="mt-8 max-w-xl">
          {/* 컨피규레이터 '선택'을 evoke하는 정적 일러스트(데모의 실제 컨피거 재연 아님) */}
          <div className="flex items-center gap-2.5">
            <span className="h-7 w-7 rounded-full border border-line bg-[#15403b]" />
            <span className="h-7 w-7 rounded-full border border-line bg-[#3a3320]" />
            <span className="h-7 w-7 rounded-full border-2 border-coral-2 bg-[#1b2440]" />
            <span className="ml-2 font-mono text-xs text-ink-3">선택 →</span>
          </div>
          <p className="mt-5 text-lg text-ink-2">
            색을 고르고 휠을 바꾸면, 차도 가격도 새로고침 없이 즉시 다시 그려진다. 페이지가 아니라
            <em className="not-italic text-ink"> 상태</em>가 바뀐다 — 이게 컨피규레이터다.
          </p>
        </ScrollSection>
      </section>

      <BottomCta demoHref={demoHref} title={title}>
        세 기법이 하나의 차량 페이지로 — 풀스크린 scroll-snap과 라이브 컨피규레이터로. JS는 컨피거 한 곳뿐.
      </BottomCta>
    </div>
  )
}
