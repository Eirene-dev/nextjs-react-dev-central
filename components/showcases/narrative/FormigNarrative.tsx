import ScrollSection from '@/components/showcases/scroll/ScrollSection'
import GiantType from '@/components/showcases/scroll/GiantType'
import { Breadcrumb, Hero, BeatLabel, BottomCta } from './parts'

// Formig — 자연어 한 문장에서 폼 필드를 추출(구조화). 데모는 인터랙티브.
// ★ AI×웹 서브패턴(개념 시연). 시그니처 = 문장 조각 → 필드 매핑(색으로 근거 표시).
const MAP: { phrase: string; field: string; value: string; color: string }[] = [
  { phrase: '내일', field: '날짜', value: '2026-06-16', color: '#818cf8' },
  { phrase: '저녁 7시', field: '시간', value: '19:00', color: '#2dd4bf' },
  { phrase: '2명', field: '인원', value: '2', color: '#fbbf24' },
  { phrase: '창가 자리', field: '좌석', value: '창가', color: '#f472b6' },
]

export default function FormigNarrative({ title, demoHref }: { title: string; demoHref: string }) {
  return (
    <div className="py-16">
      <Breadcrumb />

      <Hero
        kicker="AI×웹 · 구조화 추출"
        headline="말 한 줄이 폼을 채운다."
        demoHref={demoHref}
        title={title}
        hint="또는 아래로 — 동작 원리를 먼저 보기 ↓"
      >
        <p className="mt-6 text-lg leading-relaxed text-ink-2">
          <strong className="text-ink">{title}</strong>는 자연어 한 문장에서 예약 폼의 필드를 추출해 순서대로
          채우는 데모입니다. 어떤 조각이 어느 필드로 갔는지까지 보여줍니다. 아래는 그 원리 — 문장에서
          필드로.
        </p>
      </Hero>

      {/* ── 원리 ① 한 문장(색으로 조각 구분) ── */}
      <section className="mt-16 sm:mt-20">
        <BeatLabel n="01" name="입력은 한 문장" />
        <ScrollSection className="mt-8 max-w-xl">
          <p className="text-2xl font-bold leading-relaxed tracking-tight text-ink sm:text-3xl">
            {MAP.map((m, i) => (
              <span key={m.field}>
                <span style={{ color: m.color }}>{m.phrase}</span>
                {i < MAP.length - 1 ? ', ' : ' 예약'}
              </span>
            ))}
          </p>
          <p className="mt-5 text-lg text-ink-2">
            버튼 하나 없이, 한 문장. 색칠된 조각마다 폼의 다른 필드를 가리킨다.
          </p>
        </ScrollSection>
      </section>

      {/* ── 원리 ② 조각이 필드로(시그니처 — 근거 매핑) ── */}
      <section className="mt-16 sm:mt-20">
        <BeatLabel n="02" name="조각이 필드로" />
        <ScrollSection className="mt-8 max-w-xl">
          <div className="space-y-2.5">
            {MAP.map((m) => (
              <div key={m.field} className="flex items-center gap-3">
                <span
                  className="rounded-lg px-3 py-1.5 text-sm font-semibold text-ink"
                  style={{ backgroundColor: `${m.color}22`, boxShadow: `inset 0 0 0 1px ${m.color}66` }}
                >
                  {m.phrase}
                </span>
                <span className="font-mono text-xs text-ink-3">→</span>
                <span className="font-mono text-sm" style={{ color: m.color }}>
                  {m.field}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-6 text-lg text-ink-2">
            추출은 곧 <em className="not-italic text-ink">근거 표시</em>다. 어느 단어가 어느 칸을 채웠는지
            보이니, 틀리면 어디가 틀렸는지도 바로 보인다.
          </p>
        </ScrollSection>
      </section>

      {/* ── 원리 ③ 순서대로 채워진다 ── */}
      <section className="mt-16 sm:mt-20">
        <BeatLabel n="03" name="폼이 채워진다" />
        <GiantType
          words={['문장이,', '곧', '폼이다.']}
          className="mt-6 text-5xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-7xl"
        />
        <ScrollSection className="mt-8 max-w-md">
          <div className="divide-y divide-line rounded-2xl border border-line bg-surface-2">
            {MAP.map((m) => (
              <div key={m.field} className="flex items-center justify-between px-4 py-3">
                <span className="font-mono text-xs text-ink-3">{m.field}</span>
                <span className="font-semibold text-ink">{m.value}</span>
              </div>
            ))}
          </div>
        </ScrollSection>
      </section>

      <BottomCta demoHref={demoHref} title={title} heading="직접 한 문장으로 채워볼까요?">
        말로 예약 내용을 적으면 필드가 순서대로 채워집니다 — 샘플 모드 기본, 키는 BYOA.
      </BottomCta>
    </div>
  )
}
