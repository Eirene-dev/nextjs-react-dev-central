// /book 인덱스 정적 카드. Next.js 책은 기존 /levelup/book URL 유지(리스타일 없음).
export interface Book {
  title: string
  subtitle?: string
  description: string
  href: string
  status: '출간' | '출간 예정'
  cover?: string
  // 표지 원본 비율(px). 두 카드의 표지 높이를 맞추면서 비율을 유지하려고 함께 둔다.
  coverWidth?: number
  coverHeight?: number
}

const booksData: Book[] = [
  {
    title: '레벨업 리액트 프로그래밍 with Next.js',
    description: '웹앱의 작동 원리부터 SSR 방식을 적용한 현대적 접근까지 — 리액트와 Next.js 실전 가이드.',
    href: '/levelup/book',
    status: '출간',
    cover: '/static/images/levelup/cover_front.png',
    coverWidth: 458,
    coverHeight: 653,
  },
  {
    title: '코드를 넘어서',
    subtitle: '판단하는 개발자',
    description: '무엇을 왜 선택하는가, 판단의 기록.',
    href: '/book/judgment-dev',
    status: '출간',
    cover: '/static/images/beyond_code/cover_front.jpeg',
    coverWidth: 837,
    coverHeight: 1200,
  },
]

export default booksData
