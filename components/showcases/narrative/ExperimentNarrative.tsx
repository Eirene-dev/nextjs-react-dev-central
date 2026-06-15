'use client'

import 'lenis/dist/lenis.css'
import { useEffect } from 'react'
import Link from '@/components/Link'
import { ScrollTrigger } from '@/components/showcases/scroll/gsap'
import { useLenis } from '@/components/showcases/scroll/useLenis'
import ScrollSection from '@/components/showcases/scroll/ScrollSection'
import GiantType from '@/components/showcases/scroll/GiantType'
import Pinned from '@/components/showcases/scroll/Pinned'
import ToneFlip from '@/components/showcases/scroll/ToneFlip'
import CounterScrub from '@/components/showcases/scroll/CounterScrub'

// 실험 서사형 인트로(본 사이트). ★ 데모가 scroll-native이므로 내러티브는 "연구한 디자인 문법"의
// 메타 해설 전용 — 데모의 제품 시퀀스(이어버드 회전·배터리·색상 등)를 재연하지 않는다.
// 템플릿 단계는 aura-one 1종만 구현. 나머지는 롤아웃 단계에서 슬러그별 컴포넌트를 추가한다.
export default function ExperimentNarrative({
  slug,
  title,
  demoHref,
}: {
  slug: string
  title: string
  demoHref: string
}) {
  useLenis()

  // 웹폰트(Pretendard) 스왑 후 핀 측정 보정 — 레이아웃 시프트 방지.
  useEffect(() => {
    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(() => ScrollTrigger.refresh())
    }
  }, [])

  if (slug !== 'aura-one') return null
  return <AuraOneNarrative title={title} demoHref={demoHref} />
}

function AuraOneNarrative({ title, demoHref }: { title: string; demoHref: string }) {
  return (
    <div className="py-16">
      <p className="mb-10 font-mono text-[11.5px] tracking-[0.04em] text-ink-3">
        <Link href="/showcases" className="hover:text-coral-2">
          Showcases <span className="mx-1.5 text-coral-2">/</span> 실험
        </Link>
      </p>

      {/* ── 명명: 이 데모가 무엇을 연구했나 ── */}
      <header className="max-w-3xl">
        <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-coral-2">
          스타일 연구 · 애플 문법
        </span>
        <h1 className="mt-4 text-4xl font-extrabold leading-[1.08] tracking-tight text-ink sm:text-6xl">
          스크롤이 곧 프레젠테이션.
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-ink-2">
          <strong className="text-ink">{title}</strong>은 애플 제품 페이지의 디자인 문법을 해부한 가상
          이어버드입니다. 아래는 제품이 아니라 <em className="not-italic text-ink">그 문법 자체</em>에 대한
          노트 — 네 가지 기법을, 그 기법으로 설명합니다.
        </p>
      </header>

      {/* ── 기법 ① 거대 타이포 ── */}
      <section className="mt-40">
        <BeatLabel n="01" name="타이포가 곧 레이아웃" />
        <GiantType
          words={['크게,', '단순하게,', '한 단어씩.']}
          className="mt-6 text-5xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-7xl"
        />
        <ScrollSection className="mt-8 max-w-xl text-lg text-ink-2">
          한 단어를 화면 가득 — 카피가 이미지를 대신한다. 크기와 여백만으로 위계를 만들고, 읽는 속도를
          저자가 정한다.
        </ScrollSection>
      </section>

      {/* ── 기법 ② sticky 리빌 ── */}
      <section className="mt-40">
        <BeatLabel n="02" name="스크롤 = 프레젠테이션" />
        <Pinned
          focal={
            <p className="max-w-2xl text-3xl font-bold leading-snug tracking-tight text-ink sm:text-5xl">
              한 화면, 한 메시지.
            </p>
          }
          steps={[
            '페이지를 넘기지 않고, 한 요소를 시야에 고정한 채',
            '주변 정보가 스크롤에 맞춰 차례로 드러나고',
            '다 읽으면 다음 장으로 — 발표 슬라이드처럼.',
          ]}
        />
      </section>

      {/* ── 기법 ③ 라이트↔다크 리듬 ── */}
      <section className="mt-40">
        <BeatLabel n="03" name="명암의 리듬" />
        <div className="mt-8">
          <ToneFlip>
            <p className="max-w-2xl text-3xl font-bold leading-snug tracking-tight sm:text-5xl">
              밝은 면과 어두운 면이 번갈아 — 챕터가 바뀐다는 신호.
            </p>
            <p className="mt-6 max-w-xl text-lg opacity-90">
              눈이 한 박자 쉬고, 다음 주제에 다시 집중한다. 색이 아니라 리듬이다.
            </p>
          </ToneFlip>
        </div>
      </section>

      {/* ── 기법 ④ 움직이는 숫자 ── */}
      <section className="mt-40">
        <BeatLabel n="04" name="움직이는 숫자" />
        <div className="mt-10 grid gap-10 sm:grid-cols-[auto_1fr] sm:items-end">
          <CounterScrub to={4} label="이 페이지가 모은 애플-문법 기법" />
          <p className="max-w-md text-lg text-ink-2">
            정지된 스펙도 스크롤에 맞춰 올라가면 사건이 된다. 숫자가 카운트되는 동안, 읽는 사람은 그
            값에 머문다.
          </p>
        </div>
      </section>

      {/* ── CTA: 문법이 제품에 적용된 모습은 데모에서 ── */}
      <section className="mt-40 rounded-3xl border border-line bg-surface-2 px-7 py-16 text-center sm:py-20">
        <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          이 문법이 제품을 만나면?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-ink-2">
          네 기법이 하나의 제품 페이지로 합쳐진 모습 — JS 0줄, 이미지 0, CSS scroll-driven 으로만.
        </p>
        <a
          href={demoHref}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-coral-2 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-coral"
        >
          {title} 데모 실행 →
        </a>
      </section>
    </div>
  )
}

function BeatLabel({ n, name }: { n: string; name: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-sm font-bold text-coral-2">{n}</span>
      <span className="h-px flex-1 bg-line" />
      <span className="font-mono text-xs uppercase tracking-[0.16em] text-ink-3">{name}</span>
    </div>
  )
}
