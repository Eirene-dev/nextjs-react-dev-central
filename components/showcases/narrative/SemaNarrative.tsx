import ScrollSection from '@/components/showcases/scroll/ScrollSection'
import GiantType from '@/components/showcases/scroll/GiantType'
import { Breadcrumb, Hero, BeatLabel, BottomCta } from './parts'

// Sema — 임베딩 + 코사인 유사도 검색 팔레트(⌘K). 단어가 안 겹쳐도 의미로 매칭. 인터랙티브.
// ★ AI×웹 서브패턴. 시그니처 = 키워드 0 매칭인데 의미가 가까운 쌍(유사도) 대비.
export default function SemaNarrative({ title, demoHref }: { title: string; demoHref: string }) {
  return (
    <div className="py-16">
      <Breadcrumb />

      <Hero
        kicker="AI×웹 · 의미 검색"
        headline="단어가 안 겹쳐도, 의미로."
        demoHref={demoHref}
        title={title}
        hint="또는 아래로 — 동작 원리를 먼저 보기 ↓"
      >
        <p className="mt-6 text-lg leading-relaxed text-ink-2">
          <strong className="text-ink">{title}</strong>는 임베딩과 코사인 유사도로 찾는 검색 팔레트(⌘K)
          데모입니다. 단어가 하나도 안 겹쳐도 의미가 가까우면 매칭됩니다. 아래는 그 원리 — 키워드가 아니라
          거리.
        </p>
      </Hero>

      {/* ── 원리 ① 키워드 0 매칭 ── */}
      <section className="mt-16 sm:mt-20">
        <BeatLabel n="01" name="키워드 0 매칭" />
        <ScrollSection className="mt-8 max-w-xl">
          <div className="flex items-center gap-3 rounded-full border border-line bg-surface-2 px-5 py-3.5">
            <span className="font-mono text-sm text-coral-2">⌘K</span>
            <span className="text-ink-2">로그인이 안 돼요</span>
          </div>
          <div className="mt-3 flex items-center gap-3 rounded-2xl border border-line bg-surface-2 px-5 py-3.5">
            <span className="font-mono text-xs text-ink-3">결과</span>
            <span className="font-semibold text-ink">비밀번호 재설정</span>
          </div>
          <p className="mt-5 text-lg text-ink-2">
            두 문장에 <em className="not-italic text-ink">겹치는 단어가 하나도 없다</em>. 키워드 검색이라면
            0건. 그런데 사람은 안다 — 같은 이야기다.
          </p>
        </ScrollSection>
      </section>

      {/* ── 원리 ② 의미는 가깝다(시그니처 — 유사도) ── */}
      <section className="mt-16 sm:mt-20">
        <BeatLabel n="02" name="의미는 가깝다" />
        <ScrollSection className="mt-8 max-w-xl">
          <div className="rounded-2xl border border-line bg-surface-2 p-5">
            <div className="flex items-center justify-between font-mono text-sm">
              <span className="text-ink-3">코사인 유사도</span>
              <span className="font-bold text-coral-2">0.89</span>
            </div>
            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-ink/10">
              <div className="h-full rounded-full bg-coral-2" style={{ width: '89%' }} />
            </div>
          </div>
          <p className="mt-5 text-lg text-ink-2">
            단어 대신 <em className="not-italic text-ink">의미를 좌표로</em> 바꾼다(임베딩). 두 문장의 좌표가
            가까우면 — 글자가 안 겹쳐도 — 가까운 결과다.
          </p>
        </ScrollSection>
      </section>

      {/* ── 원리 ③ ⌘K로 부른다 ── */}
      <section className="mt-16 sm:mt-20">
        <BeatLabel n="03" name="거리로 찾는다" />
        <GiantType
          words={['키워드가', '아니라,', '거리.']}
          className="mt-6 text-5xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-7xl"
        />
        <ScrollSection className="mt-8 max-w-xl text-lg text-ink-2">
          ⌘K로 팔레트를 열고 떠오르는 대로 적으면, 정확한 키워드를 몰라도 의미가 가까운 항목이 위로 온다.
        </ScrollSection>
      </section>

      <BottomCta demoHref={demoHref} title={title} heading="직접 의미로 검색해 볼까요?">
        키워드를 몰라도 떠오르는 말로 검색하면 의미가 가까운 결과가 나옵니다 — 샘플 모드 기본, 키는 BYOA.
      </BottomCta>
    </div>
  )
}
