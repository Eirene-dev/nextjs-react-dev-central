import ScrollSection from '@/components/showcases/scroll/ScrollSection'
import GiantType from '@/components/showcases/scroll/GiantType'
import Pinned from '@/components/showcases/scroll/Pinned'
import { Breadcrumb, Hero, BeatLabel, BottomCta } from './parts'

// Slate — Popover API · CSS Anchor Positioning · @starting-style. 데모는 JS 없는 UI 카탈로그.
// ★ 메타 해설 전용 — 데모의 13개 컴포넌트 재연 금지. 시그니처 비트 = 네이티브 기능 카탈로그 그리드.
const NATIVE_FEATURES: [string, string][] = [
  ['Popover API', '열고 닫기·라이트 디스미스를 0줄로'],
  ['CSS Anchor Positioning', '화면 끝에서 자동으로 뒤집기'],
  ['@starting-style', '등장 애니메이션을 CSS만으로'],
  ['interpolate-size', 'height: auto 까지 부드럽게'],
]

export default function SlateNarrative({ title, demoHref }: { title: string; demoHref: string }) {
  return (
    <div className="py-16">
      <Breadcrumb />

      <Hero
        kicker="웹 플랫폼 · Popover · Anchor"
        headline="UI 레이어, JS 없이."
        demoHref={demoHref}
        title={title}
        hint="또는 아래로 — 세 가지 포인트를 먼저 보기 ↓"
      >
        <p className="mt-6 text-lg leading-relaxed text-ink-2">
          <strong className="text-ink">{title}</strong>는 Popover API · CSS Anchor Positioning ·
          @starting-style만으로 만든 인터랙티브 UI 카탈로그입니다. 툴팁·드롭다운·다이얼로그·토스트… 대부분
          JS 0줄. 제품이 아니라 <em className="not-italic text-ink">그 플랫폼 원시 기능</em>을 봅니다.
        </p>
      </Hero>

      {/* ── 포인트 ① 0줄(thesis) ── */}
      <section className="mt-16 sm:mt-20">
        <BeatLabel n="01" name="JS 0줄" />
        <GiantType
          words={['열고,', '뒤집고,', '등장.', '전부 CSS.']}
          className="mt-6 text-5xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-7xl"
        />
        <ScrollSection className="mt-8 max-w-xl text-lg text-ink-2">
          팝오버 열고 닫기, 화면 끝에서 자동 뒤집기, 등장 애니메이션 — 예전엔 라이브러리가 하던 일을 이제
          브라우저가 직접 한다.
        </ScrollSection>
      </section>

      {/* ── 포인트 ② 네이티브 기능 카탈로그(시그니처) ── */}
      <section className="mt-16 sm:mt-20">
        <BeatLabel n="02" name="플랫폼이 대신한다" />
        <ScrollSection className="mt-8">
          <div className="grid gap-3 sm:grid-cols-2">
            {NATIVE_FEATURES.map(([f, d]) => (
              <div key={f} className="rounded-2xl border border-line bg-surface-2 p-4">
                <div className="font-mono text-sm font-bold text-coral-2">{f}</div>
                <div className="mt-1 text-sm text-ink-3">{d}</div>
              </div>
            ))}
          </div>
        </ScrollSection>
      </section>

      {/* ── 포인트 ③ 라이브러리 → 브라우저 ── */}
      <section className="mt-16 sm:mt-20">
        <BeatLabel n="03" name="라이브러리에서 플랫폼으로" />
        <Pinned
          focal={
            <p className="max-w-2xl text-3xl font-bold leading-snug tracking-tight text-ink sm:text-5xl">
              예전엔 라이브러리, 지금은 브라우저.
            </p>
          }
          steps={[
            '툴팁 = JS 플러그인 → :hover + anchor 한 줄',
            '모달 = 포커스 트랩 라이브러리 → popover 속성',
            '등장 애니 = JS 토글 → @starting-style.',
          ]}
        />
      </section>

      <BottomCta demoHref={demoHref} title={title}>
        세 포인트가 하나의 UI 카탈로그로 — 무엇이 진짜 0줄이고 무엇이 아직 JS가 필요한지까지 정직하게.
      </BottomCta>
    </div>
  )
}
