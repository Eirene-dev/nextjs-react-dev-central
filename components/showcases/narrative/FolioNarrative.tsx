import ScrollSection from '@/components/showcases/scroll/ScrollSection'
import Pinned from '@/components/showcases/scroll/Pinned'
import { Breadcrumb, Hero, BeatLabel, BottomCta } from './parts'

// Folio — Cross-document View Transitions(@view-transition). 데모는 갤러리→상세 페이지 모핑.
// ★ 메타 해설 전용 — 데모의 6개 작품 페이지 재연 금지. 시그니처 비트 = 카드→히어로 모핑 다이어그램.
const MORPH_GRADIENT = 'linear-gradient(135deg, rgba(99,102,241,0.6), rgba(45,212,191,0.5))'

export default function FolioNarrative({ title, demoHref }: { title: string; demoHref: string }) {
  return (
    <div className="py-16">
      <Breadcrumb />

      <Hero
        kicker="웹 플랫폼 · View Transitions"
        headline="페이지 사이에 솔기가 없다."
        demoHref={demoHref}
        title={title}
        hint="또는 아래로 — 세 가지 포인트를 먼저 보기 ↓"
      >
        <p className="mt-6 text-lg leading-relaxed text-ink-2">
          <strong className="text-ink">{title}</strong>는 Cross-document View Transitions(@view-transition)
          만으로 갤러리에서 상세로 모핑합니다. 두 문서를 오가는데 같은 요소가 이어집니다. JS 0줄 — 제품이
          아니라 <em className="not-italic text-ink">그 플랫폼 기능</em>을 봅니다.
        </p>
      </Hero>

      {/* ── 포인트 ① 카드 → 히어로 모핑(시그니처 다이어그램) ── */}
      <section className="mt-16 sm:mt-20">
        <BeatLabel n="01" name="같은 요소가 이어진다" />
        <ScrollSection className="mt-8">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <div className="flex flex-col gap-1.5">
              <div className="h-16 w-24 rounded-lg ring-1 ring-line" style={{ background: MORPH_GRADIENT }} />
              <span className="font-mono text-[11px] text-ink-3">갤러리 카드</span>
            </div>
            <span className="font-mono text-sm text-coral-2">모핑 →</span>
            <div className="flex flex-col gap-1.5">
              <div className="h-28 w-44 rounded-xl ring-1 ring-line" style={{ background: MORPH_GRADIENT }} />
              <span className="font-mono text-[11px] text-ink-3">상세 히어로</span>
            </div>
          </div>
          <p className="mt-6 max-w-xl text-lg text-ink-2">
            같은 이미지가 잘리지도 다시 로드되지도 않고 — 자리와 크기만 바뀌어 커진다. 제목도 위치만 옮긴다.
            두 페이지를 잇는 하나의 동작.
          </p>
        </ScrollSection>
      </section>

      {/* ── 포인트 ② 한 줄 선언 ── */}
      <section className="mt-16 sm:mt-20">
        <BeatLabel n="02" name="한 줄 선언" />
        <ScrollSection className="mt-8 max-w-xl">
          <pre className="overflow-x-auto rounded-2xl border border-line bg-[#0b0b12] p-5 font-mono text-sm leading-relaxed text-ink-2">
            <code>
              <span className="text-coral-2">@view-transition</span> {'{'} navigation: auto; {'}'}
            </code>
          </pre>
          <p className="mt-5 text-lg text-ink-2">
            예전엔 SPA에서나 되던 페이지 전환 애니를, 멀티 페이지(MPA)에서 CSS 한 줄로. 라우터도 프레임워크도
            없이 — 그냥 링크다.
          </p>
        </ScrollSection>
      </section>

      {/* ── 포인트 ③ 링크 하나로 + graceful degradation ── */}
      <section className="mt-16 sm:mt-20">
        <BeatLabel n="03" name="링크 하나로" />
        <Pinned
          focal={
            <p className="max-w-2xl text-3xl font-bold leading-snug tracking-tight text-ink sm:text-5xl">
              링크를 누르면, 브라우저가 알아서 잇는다.
            </p>
          }
          steps={[
            '전환 전·후 화면을 브라우저가 스스로 캡처하고',
            '같은 이름(view-transition-name)의 요소를 찾아 모핑하고',
            '지원 안 하는 브라우저? 그냥 평범한 링크 — 깨지지 않는다.',
          ]}
        />
      </section>

      <BottomCta demoHref={demoHref} title={title}>
        세 포인트가 하나의 갤러리로 — cross-document View Transitions만으로, JS 0줄·이미지 0.
      </BottomCta>
    </div>
  )
}
