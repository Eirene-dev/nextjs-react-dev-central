// 쇼케이스 갤러리 단일 소스. 3개 틀(tier)로 재편:
//   built      = 실물 — 직접 만들어 운영 중인 제품(외부 링크 + 핵심 판단 3줄)
//   anatomy    = 해부 — 이 사이트를 만들며 내린 결정의 기록(배치 2에서 Velite 컬렉션으로 합류 예정)
//   experiment = 실험 — 웹·AI를 재해석한 자체완결 정적 데모(public/ 의 self-contained, 소스 공개)
// category 는 필터가 아니라 카드의 보조 태그로만 쓴다.

export type Tier = 'built' | 'anatomy' | 'experiment'

interface ShowcaseBase {
  slug: string
  title: string
  blurb: string
  category: string // 보조 태그(필터 아님)
}

// 실험 — 자체완결 정적 데모. href 진입, thumb 썸네일.
export interface ExperimentShowcase extends ShowcaseBase {
  tier: 'experiment'
  href: string
  thumb: string
  source?: string // 공개 소스 링크(GitHub). 있으면 카드에 "소스 보기" 노출.
  narrative?: string // 본 사이트 서사형 인트로 라우트(/showcases/{slug}). 있으면 카드가 데모 대신 이리로.
}

// 실물 — 운영 중인 제품. 외부 링크(새 탭) + 스크린샷 + 핵심 판단 3줄.
export interface BuiltShowcase extends ShowcaseBase {
  tier: 'built'
  url: string // 외부 운영 URL (새 탭, rel=noopener)
  thumb?: string // 스크린샷(없으면 자리표시자)
  judgments: [string, string, string] // 핵심 판단 3줄
  narrative?: string // 본 사이트 서사형 상세(/showcases/{slug}). 있으면 카드가 외부 대신 이리로.
}

export type Showcase = ExperimentShowcase | BuiltShowcase

const showcasesData: Showcase[] = [
  // ── 실물(built) ───────────────────────────────────────────────
  // 항목을 늘릴 땐 아래 형태로 한 건씩 추가한다.
  // narrative 를 주면 카드가 외부 대신 본 사이트 서사형 상세(/showcases/{slug})로 진입하고,
  // "바로가기 ↗"는 그 위(z-20)의 독립 링크로 남아 외부 운영 URL을 새 탭으로 연다.
  {
    slug: 'dodream',
    tier: 'built',
    title: '두드림글로벌 러닝센터',
    blurb:
      '중국어 학원 홈페이지 디자인 시안 15종 — 같은 학원, 열다섯 개의 얼굴. 15벌 × 31화면이 전부 동작하는 선택용 쇼케이스.',
    category: '학원 · 홈페이지 시안',
    url: 'https://dodream-showcase.vercel.app/',
    thumb: '/static/showcases/dodream.png',
    judgments: [
      '데이터도 기능도 하나, 다른 건 디자인뿐 — 그래서 열다섯을 나란히 놓고 비교가 성립한다',
      '첫 화면만 예쁜 목업 금지 — 15벌 × 31화면 465장을 다 만들어 끝까지 눌러보게 했다',
      '홈페이지의 목적은 문의를 받는 것 — 그 뒤 문의→상담→등록을 잇는 운영 화면을 공통으로',
    ],
    narrative: '/showcases/dodream', // 서사형 상세(시안 15종의 설계 판단) → 그 안에서 사이트 열기
  },

  // ── 실험(experiment) — AI×웹 BYOA 3종(Vite+React, 샘플 모드 기본 + 방문자 키) ──
  {
    slug: 'pilot',
    tier: 'experiment',
    title: 'Pilot',
    blurb: '자연어가 UI를 조작 — Gemini function calling으로 테마·정렬·필터·스크롤을 실제로 바꿉니다. 샘플 모드 기본, 키 BYOA.',
    category: 'AI×웹',
    href: '/showcases/pilot/index.html',
    thumb: '/static/showcases/pilot.png',
    source: 'https://github.com/Eirene-dev/nextjs-react-dev-central/tree/main/demos/pilot',
    narrative: '/showcases/pilot', // 서사형 인트로(function calling 개념 시연) → 그 안에서 데모 실행
  },
  {
    slug: 'canvasly',
    tier: 'experiment',
    title: 'Canvasly',
    blurb: '스트리밍 Generative UI — AI의 structured output을 카드·타임라인·체크리스트로 점진 조립. 샘플 모드 기본, 키 BYOA.',
    category: 'AI×웹',
    href: '/showcases/canvasly/index.html',
    thumb: '/static/showcases/canvasly.png',
    source: 'https://github.com/Eirene-dev/nextjs-react-dev-central/tree/main/demos/canvasly',
    narrative: '/showcases/canvasly', // 서사형 인트로(생성형 UI 개념 시연) → 그 안에서 데모 실행
  },
  {
    slug: 'formig',
    tier: 'experiment',
    title: 'Formig',
    blurb: '자연어 한 줄이 폼을 채운다 — AI 구조화 추출로 예약 폼 필드를 순차 채움. 샘플 모드 기본, 키 BYOA.',
    category: 'AI×웹',
    href: '/showcases/formig/index.html',
    thumb: '/static/showcases/formig.png',
    source: 'https://github.com/Eirene-dev/nextjs-react-dev-central/tree/main/demos/formig',
    narrative: '/showcases/formig', // 서사형 인트로(구조화 추출 개념 시연) → 그 안에서 데모 실행
  },
  {
    slug: 'docent',
    tier: 'experiment',
    title: 'Docent',
    blurb: '답에 근거를 붙인다 — 제품 문서 Q&A, 근거 문단 하이라이트. 없으면 솔직하게 “없습니다”. 샘플 모드 기본, 키 BYOA.',
    category: 'AI×웹',
    href: '/showcases/docent/index.html',
    thumb: '/static/showcases/docent.png',
    source: 'https://github.com/Eirene-dev/nextjs-react-dev-central/tree/main/demos/docent',
    narrative: '/showcases/docent', // 서사형 인트로(근거 있는 답 개념 시연) → 그 안에서 데모 실행
  },
  {
    slug: 'relay',
    tier: 'experiment',
    title: 'Relay',
    blurb: '승인받고 움직이는 에이전트 — 목표를 단계로 쪼개 [실행]을 눌러야 진행. 6스텝·루프 가드, 결제 직전까지. 샘플 모드 기본, 키 BYOA.',
    category: 'AI×웹',
    href: '/showcases/relay/index.html',
    thumb: '/static/showcases/relay.png',
    source: 'https://github.com/Eirene-dev/nextjs-react-dev-central/tree/main/demos/relay',
    narrative: '/showcases/relay', // 서사형 인트로(승인형 에이전트 개념 시연) → 그 안에서 데모 실행
  },
  {
    slug: 'sema',
    tier: 'experiment',
    title: 'Sema',
    blurb: '키워드 말고 의미로 찾는다 — 임베딩+코사인 유사도 검색 팔레트(⌘K). 단어가 안 겹쳐도 매칭. 샘플 모드 기본, 키 BYOA.',
    category: 'AI×웹',
    href: '/showcases/sema/index.html',
    thumb: '/static/showcases/sema.png',
    source: 'https://github.com/Eirene-dev/nextjs-react-dev-central/tree/main/demos/sema',
    narrative: '/showcases/sema', // 서사형 인트로(의미 검색 개념 시연) → 그 안에서 데모 실행
  },

  // ── 실험(experiment) — 선진 업체 스타일 연구 3종(가상 브랜드, 디자인 문법만 연구) ──
  {
    slug: 'aura-one',
    tier: 'experiment',
    title: 'Aura One',
    blurb: '애플 제품 페이지 문법을 연구한 가상 무선 이어버드 — 스크롤이 곧 프레젠테이션(sticky 리빌·거대 타이포).',
    category: '스타일 연구',
    href: '/showcases/aura-one/index.html',
    thumb: '/static/showcases/aura-one.png',
    source: 'https://github.com/Eirene-dev/nextjs-react-dev-central/tree/main/demos/aura-one',
    narrative: '/showcases/aura-one', // 서사형 인트로(애플 문법 메타 해설) → 그 안에서 데모 실행
  },
  {
    slug: 'vanta-ev',
    tier: 'experiment',
    title: 'Vanta',
    blurb: '테슬라 홈 문법을 연구한 가상 전기차 — 풀스크린 scroll-snap + 색·휠 컨피규레이터(가격 즉시 반영).',
    category: '스타일 연구',
    href: '/showcases/vanta-ev/index.html',
    thumb: '/static/showcases/vanta-ev.png',
    source: 'https://github.com/Eirene-dev/nextjs-react-dev-central/tree/main/demos/vanta-ev',
    narrative: '/showcases/vanta-ev', // 서사형 인트로(테슬라 문법 메타 해설) → 그 안에서 데모 실행
  },
  {
    slug: 'ledgr',
    tier: 'experiment',
    title: 'Ledgr',
    blurb: '스트라이프 랜딩 문법을 연구한 가상 결제 도구 — 그라디언트 메시·코드와 마케팅의 공존·문서형 푸터.',
    category: '스타일 연구',
    href: '/showcases/ledgr/index.html',
    thumb: '/static/showcases/ledgr.png',
    source: 'https://github.com/Eirene-dev/nextjs-react-dev-central/tree/main/demos/ledgr',
    narrative: '/showcases/ledgr', // 서사형 인트로(스트라이프 문법 메타 해설) → 그 안에서 데모 실행
  },

  // ── 실험(experiment) — 최신 웹 플랫폼 데모 3종(바닐라, 소스 공개) ──
  {
    slug: 'drift',
    tier: 'experiment',
    title: 'Drift',
    blurb: 'JS 0줄 스크롤 내러티브. CSS Scroll-driven Animations(animation-timeline)만으로.',
    category: '웹 플랫폼',
    href: '/showcases/drift/index.html',
    thumb: '/static/showcases/drift.png',
    source: 'https://github.com/Eirene-dev/nextjs-react-dev-central/tree/main/demos/drift',
    narrative: '/showcases/drift', // 서사형 인트로(animation-timeline 메타 해설) → 그 안에서 데모 실행
  },
  {
    slug: 'slate',
    tier: 'experiment',
    title: 'Slate',
    blurb: 'JS 없는 UI 레이어. Popover API + CSS Anchor Positioning + @starting-style.',
    category: '웹 플랫폼',
    href: '/showcases/slate/index.html',
    thumb: '/static/showcases/slate.png',
    source: 'https://github.com/Eirene-dev/nextjs-react-dev-central/tree/main/demos/slate',
    narrative: '/showcases/slate', // 서사형 인트로(Popover·Anchor·@starting-style 메타 해설) → 그 안에서 데모 실행
  },
  {
    slug: 'folio',
    tier: 'experiment',
    title: 'Folio',
    blurb: '페이지 간 모핑 갤러리. Cross-document View Transitions(@view-transition).',
    category: '웹 플랫폼',
    href: '/showcases/folio/index.html',
    thumb: '/static/showcases/folio.png',
    source: 'https://github.com/Eirene-dev/nextjs-react-dev-central/tree/main/demos/folio',
    narrative: '/showcases/folio', // 서사형 인트로(cross-document View Transitions 메타 해설) → 그 안에서 데모 실행
  },
]

export default showcasesData
