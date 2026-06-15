import ScrollSection from '@/components/showcases/scroll/ScrollSection'
import GiantType from '@/components/showcases/scroll/GiantType'
import { Breadcrumb, Hero, BeatLabel, BottomCta } from './parts'

// Pilot — 자연어 → Gemini function calling → 실제 UI 조작. 데모는 인터랙티브(클릭/타이핑, 스크롤 아님).
// ★ AI×웹 서브패턴: 메타 해설이 아니라 '개념을 시연' — 입력 1 → 의도 분해 → 표면 N.
//   데모의 기능 로직(실제 호출·BYOA 키)은 재구현하지 않고 개념만 정적으로 illustrate.
const SURFACES = ['테마', '정렬', '필터', '스크롤']

export default function PilotNarrative({ title, demoHref }: { title: string; demoHref: string }) {
  return (
    <div className="py-16">
      <Breadcrumb />

      <Hero
        kicker="AI×웹 · function calling"
        headline="한 문장이 UI를 조작한다."
        demoHref={demoHref}
        title={title}
        hint="또는 아래로 — 동작 원리를 먼저 보기 ↓"
      >
        <p className="mt-6 text-lg leading-relaxed text-ink-2">
          <strong className="text-ink">{title}</strong>은 자연어 명령을 Gemini function calling으로 받아
          테마·정렬·필터·스크롤을 <em className="not-italic text-ink">실제로</em> 바꾸는 데모입니다. 챗봇이
          답을 말하는 게 아니라 UI를 조작합니다. 아래는 그 원리 — 입력 1, 표면 N.
        </p>
      </Hero>

      {/* ── 원리 ① 입력은 한 문장 ── */}
      <section className="mt-16 sm:mt-20">
        <BeatLabel n="01" name="입력은 한 문장" />
        <ScrollSection className="mt-8 max-w-xl">
          <div className="flex items-center gap-3 rounded-full border border-line bg-surface-2 px-5 py-3.5">
            <span className="font-mono text-sm text-coral-2">›</span>
            <span className="text-ink-2">다크 테마로, 가격 낮은 순, 품절 빼고</span>
            <span className="ml-auto hidden rounded-full bg-coral-2 px-3 py-1 text-xs font-semibold text-white sm:inline">
              실행 →
            </span>
          </div>
          <p className="mt-5 text-lg text-ink-2">
            버튼도 메뉴도 아니다. 평범한 한 문장에 여러 의도가 섞여 있다 — 테마, 정렬, 필터.
          </p>
        </ScrollSection>
      </section>

      {/* ── 원리 ② 의도를 함수로(시그니처) ── */}
      <section className="mt-16 sm:mt-20">
        <BeatLabel n="02" name="의도를 함수로" />
        <ScrollSection className="mt-8 max-w-xl">
          <pre className="overflow-x-auto rounded-2xl border border-line bg-[#0b0b12] p-5 font-mono text-sm leading-relaxed text-ink-2">
            <code>
              {'setTheme('}
              <span className="text-coral-2">&quot;dark&quot;</span>
              {')\n'}
              {'sortBy('}
              <span className="text-coral-2">&quot;price&quot;</span>
              {', '}
              <span className="text-coral-2">&quot;asc&quot;</span>
              {')\n'}
              {'filter({ inStock: '}
              <span className="text-coral-2">true</span>
              {' })'}
            </code>
          </pre>
          <p className="mt-5 text-lg text-ink-2">
            function calling이 한 문장에서 의도를 뽑아 각각 <em className="not-italic text-ink">실제 함수
            호출</em>로 바꾼다. 모델이 텍스트가 아니라 &lsquo;무엇을 실행할지&rsquo;를 고른다.
          </p>
        </ScrollSection>
      </section>

      {/* ── 원리 ③ 표면이 동시에(입력 1, 표면 N) ── */}
      <section className="mt-16 sm:mt-20">
        <BeatLabel n="03" name="입력 1, 표면 N" />
        <GiantType
          words={['하나가,', '여럿을', '움직인다.']}
          className="mt-6 text-5xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-7xl"
        />
        <ScrollSection className="mt-8">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {SURFACES.map((s) => (
              <div
                key={s}
                className="rounded-xl border border-line bg-surface-2 p-4 text-center"
              >
                <div className="font-mono text-xs font-bold text-coral-2">{s}</div>
                <div className="mt-2 h-1.5 rounded-full bg-coral-2/30" />
              </div>
            ))}
          </div>
          <p className="mt-6 max-w-xl text-lg text-ink-2">
            한 번의 명령에 네 표면이 동시에 반응한다. 대화가 곧 조작 — 이게 생성형 UI의 핵심이다.
          </p>
        </ScrollSection>
      </section>

      <BottomCta demoHref={demoHref} title={title} heading="직접 말로 조작해 볼까요?">
        문장을 입력하면 테마·정렬·필터·스크롤이 실제로 바뀝니다 — 샘플 모드 기본, 키는 BYOA.
      </BottomCta>
    </div>
  )
}
