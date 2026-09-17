import 'css/judgment-stepper.css'
import Link from '@/components/Link'
import BookCovers from '@/components/book/BookCovers'
import JudgmentStepper from '@/components/book/JudgmentStepper'
import Reveal from '@/components/book/Reveal'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({
  title: '코드를 넘어서: 판단하는 개발자',
  description: 'AI가 코드를 쓰는 시대에 더 중요해진 것 — 무엇을 왜 선택하는가, 판단과 취향의 기록.',
})

// 표지 원본 픽셀(비율 유지용).
const COVERS = {
  front: { src: '/static/images/beyond_code/cover_front.jpeg', width: 837, height: 1200 },
  middle: { src: '/static/images/beyond_code/cover_middle.png', width: 80, height: 1094 },
  back: { src: '/static/images/beyond_code/cover_back.jpg', width: 500, height: 719 },
}

// 도서 정보 — 예스24 상품 페이지 기준.
const SPECS = [
  { k: '지은이', v: '팍스' },
  { k: '출판사', v: '비제이퍼블릭' },
  { k: '출간일', v: '2026년 9월 21일' },
  { k: '쪽수', v: '272쪽' },
  { k: 'ISBN', v: '9791165923525' },
]

const STORES = [
  { name: '예스24', href: 'https://www.yes24.com/product/goods/196261951' },
  { name: '교보문고', href: 'https://product.kyobobook.co.kr/detail/S000221248777' },
  { name: '알라딘', href: 'https://aladin.kr/p/3Si3Z' },
  {
    name: '네이버',
    href: 'https://search.shopping.naver.com/book/catalog/61613098178?query=%EC%BD%94%EB%93%9C%EB%A5%BC%20%EB%84%98%EC%96%B4%EC%84%9C&NaPm=ct%3Dmu5gp55c%7Cci%3Dcf708039887a1db2474048aab356a81a2e1a51c1%7Ctr%3Dboksl%7Csn%3D95694%7Chk%3Dccc1fd384cb70bbb08dcec157bf343f1b1e0edfd',
  },
]

// 책 소개 — 제공 카피 그대로(변형·요약 금지).
const INTRO = [
  'AI가 코드를 쏟아내는 시대, ‘코드를 잘 짠다’는 말이 예전만큼 개발자의 경쟁력이 되지 못하고 있습니다. 이제 개발자의 진정한 가치는 AI가 작성한 코드를 믿을지 의심할지 판단하고, 시스템 전체를 조망하며 운영해 가는 능력에서 만들어집니다. 이는 주니어 개발자에게도 예전보다 이른 시점부터 직접 작성하지 않은 코드를 검증하고 승인해야 하는 불안감을 안겨줍니다.',
  '이 책은 AI 도구 사용법이나 특정 언어·프레임워크를 가르치지 않습니다. 대신 개발자가 매일 내리는 판단에 집중합니다. 무엇을 만들고 무엇을 만들지 않을지, 어떤 코드를 승인하고 어떤 코드를 되돌릴지, 그리고 그 결정을 어떻게 기록하고 설명할지에 대한 이야기입니다. 저자의 삼성전자 16년 경력과 4년간의 개인 개발 경험에서 얻은 통찰을 바탕으로, 변화하는 개발자의 역할과 회사가 실제로 무엇을 평가하는지를 명쾌하게 짚어줍니다.',
  '이 책은 단순히 이론을 제시하는 것을 넘어, 독자가 즉시 활용할 수 있는 24가지 실천 도구를 제공합니다. 중요한 결정을 반 페이지에 남기는 마이크로 ADR, 하루 5분이면 채우는 판단 로그, AI 코드 검증 체크리스트, 30초 보고 템플릿 등 구체적인 가이드라인을 통해 실제 업무에 적용 가능한 판단력을 길러줍니다. 4주 실천 로드맵 또는 상황별 도구 인덱스를 활용하여 필요한 역량을 효과적으로 강화할 수 있습니다.',
  'AI가 코드를 쏟아내는 광경에 막연한 불안을 느끼는 주니어, 구현에는 자신이 있지만 커리어 성장에 고민이 많은 중견 개발자에게 이 책을 권합니다. 코드를 넘어선다는 것은 코드를 떠나는 것이 아니라, 여전히 코드를 짜면서 동시에 그 코드를 판단하는 자리에 서는 일입니다. 이 책은 직급이 아닌 역량으로 스스로의 가치를 증명할 길을 안내합니다.',
]

// 목차 — 제공 문구 그대로.
const TOC: { label: string; title?: string }[] = [
  { label: '프롤로그' },
  { label: 'Chapter 1', title: 'AI는 왜 개발자를 더 불안하게 만드는가' },
  { label: 'Chapter 2', title: '‘코드를 잘 짠다’는 말이 무력해진 이유' },
  { label: 'Chapter 3', title: '회사가 개발자를 바라보는 시선이 달라진 이유' },
  { label: 'Chapter 4', title: '성과는 코드가 아닌 결정의 궤적으로 남는다' },
  { label: 'Chapter 5', title: '야근은 성실함을 증명할 뿐 성과를 증명하지는 않는다' },
  { label: 'Chapter 6', title: '신뢰는 코드가 아닌 ‘판단의 언어’로 쌓인다' },
  { label: 'Chapter 7', title: 'AI 코드는 ‘정답’이 아닌 ‘가설’이다' },
  { label: 'Chapter 8', title: '사고가 나면 AI가 책임지는가' },
  { label: 'Chapter 9', title: '자동화할수록 인간의 판단이 중요해지는 이유' },
  { label: 'Chapter 10', title: '코드를 작성하지 않고도 가치 있는 사람이 되는 법' },
  { label: 'Chapter 11', title: '시니어의 가치는 기술이 아닌 기준이다' },
  { label: 'Chapter 12', title: '판단력이 커리어를 연장하는 이유' },
  { label: 'Chapter 13', title: 'AI 시대에 도태되는 개발자의 공통점' },
  { label: 'Chapter 14', title: '커리어가 막히는 사람들의 사고 습관' },
  { label: 'Chapter 15', title: '당신은 무엇으로 기억될 것인가' },
  { label: '에필로그' },
]

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
          <span className="inline-block rounded-full bg-coral/10 px-3 py-1 text-xs font-bold text-coral-2">
            출간
          </span>
        </div>
        <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-ink sm:text-5xl">
          코드를 넘어서
        </h1>
        <p className="mt-2 text-xl font-bold tracking-tight text-ink-2 sm:text-2xl">
          판단하는 개발자
        </p>
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

      {/* 3. 표지 앞면·중간·뒷면 */}
      <Reveal className="mt-16">
        <BookCovers title="코드를 넘어서" {...COVERS} />
      </Reveal>

      {/* 4. 도서 정보 · 온라인 서점 */}
      <Reveal className="mt-12">
        <section className="rounded-2xl border border-line bg-surface-2 p-6">
          <h2 className="text-xl font-extrabold tracking-tight text-ink">도서 정보</h2>
          <dl className="mt-4 grid gap-x-8 gap-y-2 sm:grid-cols-2">
            {SPECS.map((s) => (
              <div key={s.k} className="flex gap-3 text-sm">
                <dt className="w-16 shrink-0 font-bold text-ink-3">{s.k}</dt>
                <dd className="text-ink-2">{s.v}</dd>
              </div>
            ))}
          </dl>
          <hr className="my-5 border-line" />
          <p className="text-[11px] font-bold uppercase tracking-wide text-ink-3">온라인 서점</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {STORES.map((s) => (
              <Link
                key={s.name}
                href={s.href}
                className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold text-ink transition hover:border-coral-soft hover:text-coral-2"
              >
                {s.name} ↗
              </Link>
            ))}
          </div>
        </section>
      </Reveal>

      {/* 5. 책 소개 */}
      <Reveal className="mt-16">
        <section>
          <h2 className="text-2xl font-extrabold tracking-tight text-ink">책 소개</h2>
          <div className="mt-4 space-y-4">
            {INTRO.map((para, i) => (
              // 1·4문단이 같은 어절로 시작 → 본문 대신 순서를 key 로.
              // eslint-disable-next-line react/no-array-index-key
              <p key={i} className="text-base leading-relaxed text-ink-2">
                {para}
              </p>
            ))}
          </div>
        </section>
      </Reveal>

      {/* 6. 목차 */}
      <Reveal className="mt-16">
        <section>
          <h2 className="text-2xl font-extrabold tracking-tight text-ink">목차</h2>
          <ul className="mt-4 divide-y divide-line rounded-2xl border border-line bg-surface-2">
            {TOC.map((c) => (
              <li key={c.label} className="flex gap-4 px-5 py-3">
                <span className="w-[76px] shrink-0 text-sm font-bold text-coral-2">{c.label}</span>
                {c.title && <span className="text-sm leading-relaxed text-ink">{c.title}</span>}
              </li>
            ))}
          </ul>
        </section>
      </Reveal>

      {/* 7. 인터랙티브 스테퍼 */}
      <Reveal className="mt-16">
        <div className="rounded-2xl border border-line bg-surface-2/40 p-4 sm:p-6">
          <p className="mb-3 text-base font-bold tracking-tight text-ink sm:text-lg">
            판단을 훈련한 개발자와 그렇지 않은 개발자
          </p>
          <JudgmentStepper />
        </div>
      </Reveal>

      {/* 8. 누구를 위한 책 */}
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

      {/* 9. 저자 */}
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

      {/* 10. CTA (링크만) */}
      <Reveal className="mt-16">
        <Link
          href="/book/judgment-dev/board"
          className="flex flex-col gap-1 rounded-2xl border border-line bg-surface-2 p-6 transition hover:-translate-y-0.5 hover:border-coral-soft hover:shadow-soft"
        >
          <span className="text-lg font-bold tracking-tight text-ink">책에 대해 묻고 토론하기 →</span>
          <span className="text-sm text-ink-2">문의 · 토론 · 오타 제보</span>
        </Link>
      </Reveal>
    </div>
  )
}
