import 'css/judgment-stepper.css'
import Link from '@/components/Link'
import JudgmentStepper from '@/components/book/JudgmentStepper'
import Reveal from '@/components/book/Reveal'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({
  title: 'AI 시대, 판단하는 개발자',
  description: 'AI가 코드를 쓰는 시대에 더 중요해진 것 — 무엇을 왜 선택하는가, 판단과 취향의 기록.',
})

// 독자 카드(제공 카피만 사용 — 변형·추가 금지). aBefore/key/after 로 핵심어만 coral 강조.
const READERS = [
  {
    type: '주니어',
    role: '막 시작한 개발자',
    q: '"AI가 코드를 다 짜는데, 신입인 내가 쌓아야 할 실력은 뭐지?"',
    aBefore: '코드 생산이 아니라 ',
    key: '판단',
    aAfter: '을 처음부터 훈련하는 법 — AI의 출력을 가설로 의심하고 검증하기.',
  },
  {
    type: '중급',
    role: '구현은 익숙한, 다음을 고민하는 개발자',
    q: '"구현 능력이 평가절하되는 느낌. 시니어로 가려면 뭘 증명해야 하나?"',
    aBefore: '구현자에서 ',
    key: '결정하는 사람',
    aAfter: '으로 — 성과를 ‘결정의 궤적’으로 남기기.',
  },
  {
    type: '시니어',
    role: '기준을 세우는 사람',
    q: '"팀이 AI로 코드를 쏟아낸다. 무엇을 기준으로 리뷰하고 승인하나?"',
    aBefore: '시니어 = ',
    key: '기준',
    aAfter: '. 팀의 판단 품질을 끌어올리는 기준 세우기.',
  },
]

export default function JudgmentDevPage() {
  return (
    <div className="mx-auto max-w-[760px] py-12">
      {/* 1. 히어로 */}
      <header>
        <Link href="/book" className="text-sm font-semibold text-coral-2 hover:text-coral">
          ← Book
        </Link>
        <div className="mt-6">
          <span className="inline-block rounded-full bg-ink/5 px-3 py-1 text-xs font-bold text-ink-2">
            출간 예정
          </span>
        </div>
        <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-ink sm:text-5xl">
          AI 시대, 판단하는 개발자
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-ink-2">
          AI가 코드를 쓰는 시대에 더 중요해진 것 — 무엇을 왜 선택하는가, 판단과 취향의 기록.
        </p>
      </header>

      {/* 2. 정의 풀-쿼트 */}
      <Reveal>
        <blockquote className="mt-16 border-l-4 border-coral pl-6 text-2xl font-bold leading-snug tracking-tight text-ink sm:text-[28px]">
          판단이란 <span className="text-coral-2">무엇을</span> <span className="text-coral-2">왜</span>{' '}
          <span className="text-coral-2">선택</span>하는가 — 결정의 궤적이다.
        </blockquote>
      </Reveal>

      {/* 3. 인터랙티브 스테퍼 */}
      <Reveal className="mt-16">
        <div className="rounded-2xl border border-line bg-surface-2/40 p-4 sm:p-6">
          <p className="mb-3 text-base font-bold tracking-tight text-ink sm:text-lg">
            판단을 훈련한 개발자와 그렇지 않은 개발자
          </p>
          <JudgmentStepper />
        </div>
      </Reveal>

      {/* 4. 누구를 위한 책 */}
      <Reveal className="mt-16">
        <section>
          <h2 className="text-2xl font-extrabold tracking-tight text-ink">누구를 위한 책인가</h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-2">
            변화 앞에서 <strong className="font-semibold text-ink">‘나는 무엇으로 평가받는가’</strong>를
            묻는 개발자를 위한 책입니다 — 막 시작한 주니어부터, 기준을 세워야 하는 시니어까지.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {READERS.map((r) => (
              <div key={r.type} className="rounded-2xl border border-line bg-surface-2 p-5">
                <span className="text-xs font-bold uppercase tracking-wide text-coral-2">
                  {r.type}
                </span>
                <p className="mt-1 text-sm font-semibold text-ink">{r.role}</p>
                <div className="mt-4">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-ink-3">
                    지금 이런 고민
                  </p>
                  <p className="mt-1.5 font-semibold leading-relaxed text-ink">{r.q}</p>
                </div>
                <hr className="my-4 border-line" />
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wide text-ink-3">이 책에서</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-2">
                    {r.aBefore}
                    <span className="font-semibold text-coral-2">{r.key}</span>
                    {r.aAfter}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* 5. 저자 */}
      <Reveal className="mt-16">
        <section className="rounded-2xl border border-line bg-surface-2 p-6">
          <h2 className="text-xl font-extrabold tracking-tight text-ink">저자</h2>
          <p className="mt-3 leading-relaxed text-ink-2">
            삼성전자에서 16년, 지금은 독립 개발자이자 저자입니다(이전 LLM 앱 개발서 저자). 2020년 삼성
            사내 세미나에서 받은 질문 — <em className="text-ink">“이제 코딩을 AI가 할 텐데 우리는 뭘 해야
            할까요?”</em> — 이 책의 출발점이 되었습니다.
          </p>
          <Link
            href="/about"
            className="mt-4 inline-block text-sm font-semibold text-coral-2 hover:text-coral"
          >
            저자 소개 →
          </Link>
        </section>
      </Reveal>

      {/* 6. CTA (링크만) */}
      <Reveal className="mt-16">
        <Link
          href="/book/judgment-dev/board"
          className="flex flex-col gap-1 rounded-2xl border border-line bg-surface-2 p-6 transition hover:-translate-y-0.5 hover:border-coral-soft hover:shadow-soft"
        >
          <span className="text-lg font-bold tracking-tight text-ink">책에 대해 묻고 토론하기 →</span>
          <span className="text-sm text-ink-2">문의 · 토론 · 오타 제보</span>
        </Link>
      </Reveal>

      {/* 7. 출간 예정 처리 */}
      <p className="mt-12 text-center text-sm text-ink-3">
        정식 목차 · 출간일 · 구매 링크는 출간 시 공개됩니다.
      </p>
    </div>
  )
}
