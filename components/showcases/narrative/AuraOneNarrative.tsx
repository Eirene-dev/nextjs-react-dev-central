import ScrollSection from '@/components/showcases/scroll/ScrollSection'
import GiantType from '@/components/showcases/scroll/GiantType'
import Pinned from '@/components/showcases/scroll/Pinned'
import ToneFlip from '@/components/showcases/scroll/ToneFlip'
import CounterScrub from '@/components/showcases/scroll/CounterScrub'
import { Breadcrumb, Hero, BeatLabel, BottomCta } from './parts'

// Aura One — 애플 제품 페이지 문법(거대 타이포·sticky 리빌·명암 리듬·움직이는 숫자).
// ★ 데모가 scroll-native이므로 메타 해설 전용 — 제품 시퀀스(이어버드·배터리·색상) 재연 금지.
export default function AuraOneNarrative({ title, demoHref }: { title: string; demoHref: string }) {
  return (
    <div className="py-16">
      <Breadcrumb />

      <Hero
        kicker="스타일 연구 · 애플 문법"
        headline="스크롤이 곧 프레젠테이션."
        demoHref={demoHref}
        title={title}
        hint="또는 아래로 — 네 가지 기법을 먼저 보기 ↓"
      >
        <p className="mt-6 text-lg leading-relaxed text-ink-2">
          <strong className="text-ink">{title}</strong>은 애플 제품 페이지의 디자인 문법을 해부한 가상
          이어버드입니다. 아래는 제품이 아니라 <em className="not-italic text-ink">그 문법 자체</em>에 대한
          노트 — 네 가지 기법을, 그 기법으로 설명합니다.
        </p>
      </Hero>

      {/* ── 기법 ① 거대 타이포 ── */}
      <section className="mt-24 sm:mt-28">
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
      <section className="mt-24 sm:mt-28">
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
      <section className="mt-24 sm:mt-28">
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
      <section className="mt-24 sm:mt-28">
        <BeatLabel n="04" name="움직이는 숫자" />
        <div className="mt-10 grid gap-10 sm:grid-cols-[auto_1fr] sm:items-end">
          <CounterScrub to={4} label="이 페이지가 모은 애플-문법 기법" />
          <p className="max-w-md text-lg text-ink-2">
            정지된 스펙도 스크롤에 맞춰 올라가면 사건이 된다. 숫자가 카운트되는 동안, 읽는 사람은 그
            값에 머문다.
          </p>
        </div>
      </section>

      <BottomCta demoHref={demoHref} title={title}>
        네 기법이 하나의 제품 페이지로 합쳐진 모습 — JS 0줄, 이미지 0, CSS scroll-driven 으로만.
      </BottomCta>
    </div>
  )
}
