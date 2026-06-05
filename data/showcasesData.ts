// 쇼케이스 갤러리 단일 소스. href 는 public/ 의 self-contained 정적 데모(전체 로드).
export interface Showcase {
  slug: string
  title: string
  category: string
  blurb: string
  href: string
  thumb: string
}

const showcasesData: Showcase[] = [
  {
    slug: 'ai-assistant',
    title: 'AI 어시스턴트 인터페이스',
    category: 'AI 통합',
    blurb: '스트리밍 챗 + 대화 히스토리·툴 패널 (mock)',
    href: '/showcases/ai-assistant/index.html',
    thumb: '/static/showcases/ai-assistant.png',
  },
  {
    slug: 'storefront',
    title: '미니 스토어프런트',
    category: '커머스',
    blurb: '제품 그리드·카테고리 필터·장바구니 드로어 (mock)',
    href: '/showcases/storefront/index.html',
    thumb: '/static/showcases/storefront.png',
  },
  {
    slug: 'landing',
    title: '소개형 랜딩',
    category: '정보형',
    blurb: '히어로·가격 토글·FAQ 아코디언, 자체 브랜드 테마',
    href: '/showcases/landing/index.html',
    thumb: '/static/showcases/landing.png',
  },
]

export default showcasesData
