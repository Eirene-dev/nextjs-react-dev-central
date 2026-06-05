import 'css/home.css'
import Link from '@/components/Link'
import DemoWidget from '@/components/home/DemoWidget'

// 새 홈 — homepage-05-final.html 기반. Phase 1 토큰/셸 + 데모 위젯.
// 프리뷰(쇼케이스/에세이/책)는 이번 단계 정적 카드(05). 레거시 블로그 피드 제거.

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-coral-2/20 bg-coral/10 px-3 py-1.5 text-[12.5px] font-semibold text-coral-2">
      <span className="h-1.5 w-1.5 rounded-full bg-coral" />
      {children}
    </span>
  )
}

const ArrowRight = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

const FEATURES = [
  {
    title: '직접 만든 데모',
    desc: '정보형·게시판·커머스·AI 통합 등 다양한 웹·AI 데모를 카테고리별로.',
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M3 9h18M9 21V9" />
      </>
    ),
  },
  {
    title: '개인적인 글',
    desc: 'AI가 아닌 제 생각으로 쓴 판단·취향·실패의 기록.',
    icon: <path d="M4 4h16v16H4zM8 9h8M8 13h5" />,
  },
  {
    title: '출간한 책',
    desc: 'Next.js 실전 가이드, 그리고 『AI 시대, 판단하는 개발자』.',
    icon: (
      <>
        <path d="M4 19V5a2 2 0 012-2h12v18H6a2 2 0 01-2-2z" />
        <path d="M8 7h7" />
      </>
    ),
  },
]

const SHOWCASES = [
  {
    cat: 'AI 통합',
    title: 'AI 어시스턴트 인터페이스',
    svg: (
      <>
        <circle cx="50" cy="42" r="13" />
        <path d="M31 73c0-10 8-17 19-17s19 7 19 17" opacity=".7" />
      </>
    ),
  },
  {
    cat: '정보형',
    title: '소개형 랜딩',
    svg: (
      <>
        <circle cx="50" cy="50" r="36" opacity=".5" />
        <rect x="34" y="46" width="32" height="8" rx="2" stroke="#fff" />
      </>
    ),
  },
  {
    cat: '게시판',
    title: '커뮤니티 게시판',
    svg: (
      <>
        <rect x="26" y="28" width="48" height="9" rx="2" />
        <rect x="26" y="46" width="48" height="9" rx="2" opacity=".7" />
        <rect x="26" y="64" width="30" height="9" rx="2" opacity=".5" />
      </>
    ),
  },
  {
    cat: '커머스',
    title: '미니 스토어프런트',
    svg: (
      <>
        <rect x="28" y="28" width="18" height="24" rx="3" />
        <rect x="54" y="28" width="18" height="24" rx="3" opacity=".7" />
      </>
    ),
  },
]

// 05 정적 에세이 프리뷰 (Phase 2 단계). 첫 글만 실제 라우트로 연결.
const ESSAYS = [
  { title: '왜 나는 내 기술 블로그를 다시 생각하게 되었는가', date: '2026.06', href: '/essays' },
  { title: '삼성에서의 16년, 그리고 독립 개발자로', date: '2026.05', href: '/essays' },
  { title: '판단을 자동화할 수 없는 이유', date: '2026.05', href: '/essays' },
]

export default function Main() {
  return (
    <div className="home">
      {/* hero */}
      <section className="hero">
        <div className="hero-grid">
          <div className="h-copy">
            <Pill>New · 인터랙티브 AI 데모</Pill>
            <h1 className="h1">
              AI가 코드를 쓰는 시대,
              <br />
              <span className="g">판단과 취향</span>을 기록합니다.
            </h1>
            <p className="lead">
              튜토리얼이 아니라, 무엇을 왜 골랐는지. 직접 만든 웹·AI 데모와, AI가 아닌 제 생각으로 쓴 글들.
            </p>
            <div className="cta">
              <Link className="btn btn-p" href="/showcases">
                쇼케이스 둘러보기 <ArrowRight />
              </Link>
              <Link className="btn btn-s" href="/essays">
                에세이 읽기
              </Link>
            </div>
            <div className="proof">
              <span className="av">
                <i />
                <i />
                <i />
              </span>
              <span>직접 만든 5+ 데모 · 핀테크·AI 실전 경험</span>
            </div>
          </div>
          <DemoWidget />
        </div>
      </section>

      {/* features */}
      <section className="feats">
        <div className="feats-grid">
          {FEATURES.map((f) => (
            <div className="fcard" key={f.title}>
              <div className="ic">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  {f.icon}
                </svg>
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* showcases preview */}
      <section className="sec" id="showcases">
        <div className="s-head">
          <Pill>Showcases</Pill>
          <h2>직접 만든 웹·AI 데모</h2>
          <p>Claude Code로 만든 standalone 데모들 — 카테고리로 둘러보세요.</p>
        </div>
        <div className="grid4">
          {SHOWCASES.map((s) => (
            <Link className="uc" href="/showcases" key={s.title}>
              <div className="pic">
                <svg viewBox="0 0 100 100" fill="none" stroke="hsl(var(--coral-soft))" strokeWidth="1.6">
                  {s.svg}
                </svg>
              </div>
              <div className="b">
                <span className="cat">{s.cat}</span>
                <h3>{s.title}</h3>
                <span className="go">데모 보기 →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* essays preview */}
      <section className="sec">
        <div className="s-head">
          <Pill>Essays</Pill>
          <h2>개인적인 생각과 의견</h2>
          <p>AI가 아닌, 제 생각으로 쓴 글.</p>
        </div>
        <div className="elist">
          {ESSAYS.map((e) => (
            <Link href={e.href} key={e.title}>
              <h3>{e.title}</h3>
              <span className="d">{e.date}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* book strip (후순위) */}
      <section className="sec">
        <div className="s-head">
          <Pill>Book</Pill>
          <h2>출간한 책</h2>
        </div>
        <div className="book-strip">
          <Link href="/levelup/book">
            <span className="bt">레벨업 리액트 프로그래밍 with Next.js</span>
            <span className="bd">웹앱의 작동 원리부터 SSR 방식을 적용한 현대적 접근까지.</span>
          </Link>
          <Link href="/book/judgment-dev">
            <span className="bt">AI 시대, 판단하는 개발자</span>
            <span className="bd">출간 예정 — 무엇을 왜 선택하는가, 판단의 기록.</span>
          </Link>
        </div>
      </section>

      {/* cta banner */}
      <section className="banner">
        <div className="box">
          <h2>직접 만든 데모를 둘러보세요</h2>
          <p>정보형부터 AI 통합까지 — 카테고리로 탐색하는 standalone 데모 모음.</p>
          <Link className="btn btn-p" href="/showcases">
            쇼케이스 전체 보기 <ArrowRight />
          </Link>
          <div className="soon">lab.mindvest.ai 연동 · 곧 공개 예정</div>
        </div>
      </section>
    </div>
  )
}
