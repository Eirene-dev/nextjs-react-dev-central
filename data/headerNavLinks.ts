// 개편 내비 (design-decisions §3) — 한글 라벨, 데스크톱 헤더·모바일 메뉴 공용.
// Archive 는 상단에서 제외하고 푸터로 이동(/archive 라우트 자체는 유지).
const headerNavLinks = [
  { href: '/essays', title: '에세이' },
  { href: '/showcases', title: '쇼케이스' },
  { href: '/book', title: '저서' },
  { href: '/about', title: '소개' },
]

export default headerNavLinks
