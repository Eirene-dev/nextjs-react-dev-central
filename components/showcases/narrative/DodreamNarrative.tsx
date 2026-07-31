import ScrollSection from '@/components/showcases/scroll/ScrollSection'
import GiantType from '@/components/showcases/scroll/GiantType'
import Pinned from '@/components/showcases/scroll/Pinned'
import ToneFlip from '@/components/showcases/scroll/ToneFlip'
import CounterScrub from '@/components/showcases/scroll/CounterScrub'
import { Breadcrumb, Hero, BeatLabel, BottomCta } from './parts'

// 두드림글로벌 러닝센터 — 중국어 학원 홈페이지 디자인 시안 15종(외부 운영 URL).
// ★ 대상이 이미 스크롤·디자인으로 가득한 사이트이므로 메타 해설 전용 —
//   시안 각각의 화면이나 모션을 재연하지 않는다. 다루는 건 "왜 이 구조로 만들었나" 뿐.
// ★ 대상의 정체성은 "구경거리"가 아니라 "고르기 위한 도구" — 비트도 그 결정 순서를 따른다.
// ★ CTA는 전부 외부 도메인 → external(target/rel) 필수.
export default function DodreamNarrative({ title, demoHref }: { title: string; demoHref: string }) {
  return (
    <div className="py-16">
      <Breadcrumb tier="실물" />

      <Hero
        kicker="실물 · 학원 홈페이지 시안"
        headline="같은 학원, 열다섯 개의 얼굴."
        demoHref={demoHref}
        title={title}
        external
        ctaLabel="시안 15종 둘러보기 ↗"
        hint="또는 아래로 — 왜 열다섯인지 먼저 보기 ↓"
      >
        <p className="mt-6 text-lg leading-relaxed text-ink-2">
          중국어 학원 <strong className="text-ink">{title}</strong>가 홈페이지 디자인을 고르기 위한
          쇼케이스입니다. 열다섯 벌이 전부 만들어져 돌아가고, 20색 테마와 공통 운영 화면이 함께
          붙습니다. 아래는 화면 소개가 아니라{' '}
          <em className="not-italic text-ink">그 구조를 택한 이유</em>에 대한 노트입니다.
        </p>
        <p className="mt-3 text-sm text-ink-3">
          화면을 채운 학원명·인물·실적·금액·연락처는 예시 학원의 가상 데이터입니다.
        </p>
      </Hero>

      {/* ── 판단 ① 콘텐츠와 표현의 분리 ── */}
      <section className="mt-16 sm:mt-20">
        <BeatLabel n="01" name="열다섯 개의 얼굴" />
        <GiantType
          words={['같은 학원,', '열다섯 개의', '얼굴.']}
          className="mt-6 text-5xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-7xl"
        />
        <ScrollSection className="mt-8 max-w-xl text-lg text-ink-2">
          시안마다 콘텐츠를 새로 쓰지 않았다. 과정·시간표·강사·공지·상담 폼은 하나의 데이터와 기능
          위에 올리고, 다른 건 디자인뿐. 그래서 열다섯을 나란히 놓는 순간 &ldquo;비교&rdquo;가
          성립한다 — 다른 글이 아니라 다른 해석을 보고 고르게 된다.
        </ScrollSection>
      </section>

      {/* ── 판단 ② 고르는 행위 자체를 설계 ── */}
      <section className="mt-16 sm:mt-20">
        <BeatLabel n="02" name="고르는 일을 세 번으로" />
        <Pinned
          focal={
            <p className="max-w-2xl text-3xl font-bold leading-snug tracking-tight text-ink sm:text-5xl">
              상상하지 않아도 됩니다.
            </p>
          }
          steps={[
            '색을 먼저 — 간판·인테리어와 어울리는 20색 중 하나를 누르면 카드 15장이 그 자리에서 갈아입는다.',
            '시안을 고르고 — 카드는 그림이 아니라 실제 화면. 마우스를 올리면 스스로 한 바퀴 훑는다.',
            '들어가서 눌러본다 — 시안이 통째로 열리고, 메뉴 끝까지 실제로 동작한다.',
          ]}
        />
        <ScrollSection className="mt-8 max-w-xl text-lg text-ink-2">
          홈페이지를 새로 만들 때 가장 어려운 건 &ldquo;말로 설명된 디자인&rdquo;을 상상하는 일이다.
          그 상상을 없애는 게 이 사이트의 목적이다. 열다섯도 무난한 쪽(보편 문법 6)부터 정보 구조를
          바꾸는 쪽(구조 실험 5), 웹 기술이 첫인상이 되는 쪽(기술 실험 4)까지 축을 세워 놓았다.
        </ScrollSection>
      </section>

      {/* ── 판단 ③ 테마를 토큰으로 ── */}
      <section className="mt-16 sm:mt-20">
        <BeatLabel n="03" name="색은 취향이 아니라 토큰" />
        <div className="mt-8">
          <ToneFlip>
            <p className="max-w-2xl text-3xl font-bold leading-snug tracking-tight sm:text-5xl">
              색을 변수로 뽑아내면, 스무 벌이 공짜가 된다.
            </p>
            <p className="mt-6 max-w-xl text-lg opacity-90">
              팔레트 20종 × 라이트·다크가 시안마다 곱해지는데도 디자인을 다시 그리지 않는다. 게다가
              고른 색이 주소에 실려 — 합의가 스크린샷을 거치지 않고 링크 한 줄로 끝난다.
            </p>
          </ToneFlip>
        </div>
      </section>

      {/* ── 판단 ④ 목업이 아니라는 증명 ── */}
      <section className="mt-16 sm:mt-20">
        <BeatLabel n="04" name="첫 화면만 예쁜 목업이 아니다" />
        <div className="mt-10 grid gap-10 sm:grid-cols-[auto_1fr] sm:items-end">
          <CounterScrub to={465} label="실제로 만들어진 화면 — 15벌 × 31화면" />
          <p className="max-w-md text-lg text-ink-2">
            히어로 한 장만 그럴듯한 시안은 고를 근거가 되지 못한다. 그래서 한 벌마다 31개 화면을 전부
            세웠다.
          </p>
        </div>
        <ScrollSection className="mt-8 max-w-xl text-lg text-ink-2">
          어느 시안에 들어가든 메뉴를 끝까지 눌러 돌아다닐 수 있다. 고르는 사람이 확인해야 하는 건
          첫인상이 아니라 &ldquo;우리 학원 정보가 이 안에 들어갔을 때&rdquo;이기 때문이다.
        </ScrollSection>
      </section>

      {/* ── 판단 ⑤ 홈페이지 바깥의 병목 ── */}
      <section className="mt-16 sm:mt-20">
        <BeatLabel n="05" name="진짜 일은 문의를 받은 다음" />
        <ScrollSection className="mt-8 max-w-2xl">
          <p className="text-2xl font-bold leading-snug tracking-tight text-ink sm:text-3xl">
            홈페이지의 목적은 문의를 받는 것이고, 문의는 받은 다음이 더 일이다.
          </p>
          <p className="mt-6 text-lg text-ink-2">
            그래서 어느 시안을 고르든 그 뒤에 운영 화면이 공통으로 얹힌다. 문의가 들어오면 AI가
            의도·수준·급한 정도로 분류하고, 상담 준비 카드를 미리 세워두고, 상담이 끝나면 다음 액션
            초안까지 만들어 둔다. 운영자는 판단만 하면 된다.
          </p>
        </ScrollSection>
      </section>

      <BottomCta
        demoHref={demoHref}
        title={title}
        heading="어느 얼굴이 맞는지는, 입혀 봐야 압니다."
        external
        ctaLabel="시안 15종 직접 보기 ↗"
      >
        열다섯 벌을 20색으로 갈아입히며 비교하고, 운영자 화면까지 로그인 없이 열어볼 수 있습니다.
      </BottomCta>
    </div>
  )
}
