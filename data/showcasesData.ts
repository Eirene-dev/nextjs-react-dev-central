// 쇼케이스 갤러리 단일 소스. 3개 틀(tier)로 재편:
//   built      = 실물 — 직접 만들어 운영 중인 제품(외부 링크 + 핵심 판단 3줄)
//   anatomy    = 해부 — 이 사이트를 만들며 내린 결정의 기록(배치 2에서 Velite 컬렉션으로 합류 예정)
//   experiment = 실험 — 웹·AI를 재해석한 인터랙티브 mock(public/ 의 self-contained 정적 데모)
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
  source?: string // 공개 소스 링크(GitHub). 있으면 카드에 "소스 보기" 노출. 기존 mock 3종은 없음.
}

// 실물 — 운영 중인 제품. 외부 링크(새 탭) + 스크린샷 + 핵심 판단 3줄.
export interface BuiltShowcase extends ShowcaseBase {
  tier: 'built'
  url: string // 외부 운영 URL (새 탭, rel=noopener)
  thumb?: string // 스크린샷(없으면 자리표시자)
  judgments: [string, string, string] // 핵심 판단 3줄
}

export type Showcase = ExperimentShowcase | BuiltShowcase

const showcasesData: Showcase[] = [
  // ── 실물(built) ───────────────────────────────────────────────
  // 0건. 항목이 생기면 아래 주석 샘플처럼 한 건만 추가하면 끝난다.
  // {
  //   slug: 'mindvest-lab',
  //   tier: 'built',
  //   title: 'lab.mindvest.ai',
  //   blurb: 'AI 투자 리서치 도구 — 직접 만들어 운영 중',
  //   category: 'AI 통합',
  //   url: 'https://lab.mindvest.ai',
  //   thumb: '/static/showcases/mindvest-lab.png',
  //   judgments: [
  //     '왜 만들었나 — 한 줄',
  //     '핵심 기술 결정 — 한 줄',
  //     '직접 운영하며 배운 것 — 한 줄',
  //   ],
  // },

  // ── 실험(experiment) — 기존 mock 데모 3종(브랜드명으로 표기) ──
  {
    slug: 'ai-assistant',
    tier: 'experiment',
    title: 'Lumina',
    blurb: 'AI 어시스턴트 인터페이스 — 스트리밍 챗과 대화 히스토리·툴 패널',
    category: 'AI 통합',
    href: '/showcases/ai-assistant/index.html',
    thumb: '/static/showcases/ai-assistant.png',
  },
  {
    slug: 'storefront',
    tier: 'experiment',
    title: '새두 Store',
    blurb: '미니 커머스 스토어프런트 — 제품 그리드·카테고리 필터·장바구니 드로어',
    category: '커머스',
    href: '/showcases/storefront/index.html',
    thumb: '/static/showcases/storefront.png',
  },
  {
    slug: 'landing',
    tier: 'experiment',
    title: 'Tempo',
    blurb: '소개형 랜딩 — 히어로·가격 토글·FAQ 아코디언, 자체 브랜드 테마',
    category: '정보형',
    href: '/showcases/landing/index.html',
    thumb: '/static/showcases/landing.png',
  },

  // ── 실험(experiment) — 최신 웹 플랫폼 데모 3종(바닐라, 소스 공개) ──
  {
    slug: 'drift',
    tier: 'experiment',
    title: 'Drift',
    blurb: 'Claude Code와 페어로 제작 — JS 0줄 스크롤 내러티브. CSS Scroll-driven Animations(animation-timeline)만으로.',
    category: '웹 플랫폼',
    href: '/showcases/drift/index.html',
    thumb: '/static/showcases/drift.png',
    source: 'https://github.com/Eirene-dev/nextjs-react-dev-central/tree/main/demos/drift',
  },
  {
    slug: 'slate',
    tier: 'experiment',
    title: 'Slate',
    blurb: 'Claude Code와 페어로 제작 — JS 없는 UI 레이어. Popover API + CSS Anchor Positioning + @starting-style.',
    category: '웹 플랫폼',
    href: '/showcases/slate/index.html',
    thumb: '/static/showcases/slate.png',
    source: 'https://github.com/Eirene-dev/nextjs-react-dev-central/tree/main/demos/slate',
  },
  {
    slug: 'folio',
    tier: 'experiment',
    title: 'Folio',
    blurb: 'Claude Code와 페어로 제작 — 페이지 간 모핑 갤러리. Cross-document View Transitions(@view-transition).',
    category: '웹 플랫폼',
    href: '/showcases/folio/index.html',
    thumb: '/static/showcases/folio.png',
    source: 'https://github.com/Eirene-dev/nextjs-react-dev-central/tree/main/demos/folio',
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
  },
]

export default showcasesData
