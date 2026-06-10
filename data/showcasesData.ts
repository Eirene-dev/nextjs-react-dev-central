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
]

export default showcasesData
