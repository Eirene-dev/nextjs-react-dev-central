import 'css/home.css'
import Link from '@/components/Link'
import DemoWidget from '@/components/home/DemoWidget'
import { listPublishedEssays } from '@/lib/essay-drafts'
import { allAnatomy } from '@/lib/content'

const ym = (d: string | number | Date) => {
  const dt = new Date(d)
  return `${dt.getFullYear()}.${String(dt.getMonth() + 1).padStart(2, '0')}`
}

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

// 카드 순서 = 상단 메뉴와 동일(에세이 → 쇼케이스 → 저서)
const FEATURES = [
  {
    title: '개인적인 글',
    desc: '제 생각으로 쓴 판단·취향·실패의 기록.',
    icon: <path d="M4 4h16v16H4zM8 9h8M8 13h5" />,
  },
  {
    title: '결정의 해부',
    desc: '해부·실험·실물 — 무엇을 왜 골랐는지.',
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M3 9h18M9 21V9" />
      </>
    ),
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

export default async function Main() {
  // 발행된 에세이만 라이브로(최대 3). 없으면 graceful "곧 공개".
  const essays = (await listPublishedEssays()).slice(0, 3)
  // 해부 최신 6편 — exhibit 내림차순(빌드타임 데이터). slice 로 향후 증가 대비.
  const anatomy = [...allAnatomy].sort((a, b) => b.exhibit - a.exhibit).slice(0, 6)

  return (
    <div className="home">
      {/* hero */}
      <section className="hero">
        <div className="hero-grid">
          <div className="h-copy">
            <Pill>New · 인터랙티브 데모</Pill>
            <h1 className="h1">
              AI가 코드를 쓰는 시대,
              <br />
              <span className="g">판단과 취향</span>을 기록합니다.
            </h1>
            <p className="lead">
              튜토리얼이 아니라, 무엇을 왜 골랐는지. 만들며 내린 결정들과, 제 생각으로 쓴 글들.
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
              <span>핀테크 실전 경험 · 직접 내린 결정들</span>
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

      {/* 섹션 순서 = 상단 메뉴와 동일(에세이 → 쇼케이스 → 저서) */}
      {/* essays preview */}
      <section className="sec">
        <div className="s-head">
          <Pill>Essays</Pill>
          <h2>개인적인 생각과 의견</h2>
          <p>AI가 아닌, 제 생각으로 쓴 글.</p>
        </div>
        <div className="elist">
          {essays.length === 0 ? (
            <Link href="/essays" style={{ justifyContent: 'center' }}>
              <h3 style={{ color: 'hsl(var(--ink-2))', fontWeight: 600 }}>
                첫 에세이를 준비 중입니다 — 곧 공개
              </h3>
            </Link>
          ) : (
            essays.map((e) => (
              <Link href={`/essays/${e.slug}`} key={e.id}>
                <h3>{e.title}</h3>
                {e.publishedAt && <span className="d">{ym(e.publishedAt)}</span>}
              </Link>
            ))
          )}
        </div>
      </section>

      {/* anatomy preview — 판단의 기록(해부 최신 6편) */}
      <section className="sec" id="anatomy">
        <div className="s-head">
          <Pill>Anatomy</Pill>
          <h2>판단의 기록</h2>
          <p>튜토리얼이 아니라, 무엇을 왜 골랐는지 — 이 사이트를 만들며 내린 결정들.</p>
        </div>
        <div className="anat-grid">
          {anatomy.map((a) => (
            <Link className="acard" href={`/showcases/anatomy/${a.slug}`} key={a.slug}>
              <span className="ex">전시 {String(a.exhibit).padStart(2, '0')}</span>
              <h3>{a.title}</h3>
              <p className="q">{a.question}</p>
              <span className="go">읽어 보기 →</span>
            </Link>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 36 }}>
          <Link className="btn btn-p" href="/showcases/anatomy">
            해부 전체 보기 <ArrowRight />
          </Link>
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
          <h2>세 가지 틀로 둘러보세요</h2>
          <p>해부·실험·실물 — 내린 결정, 재해석한 실험, 운영 중인 것.</p>
          <Link className="btn btn-p" href="/showcases">
            쇼케이스 전체 보기 <ArrowRight />
          </Link>
          <div className="soon">lab.mindvest.ai · 곧 공개</div>
        </div>
      </section>
    </div>
  )
}
