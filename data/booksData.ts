// /book 인덱스 정적 카드. Next.js 책은 기존 /levelup/book URL 유지(리스타일 없음).
export interface Book {
  title: string
  description: string
  href: string
  status: '출간' | '출간 예정'
  cover?: string
}

const booksData: Book[] = [
  {
    title: '레벨업 리액트 프로그래밍 with Next.js',
    description: '웹앱의 작동 원리부터 SSR 방식을 적용한 현대적 접근까지 — 리액트와 Next.js 실전 가이드.',
    href: '/levelup/book',
    status: '출간',
    cover: '/static/images/levelup/cover_front.png',
  },
  {
    title: 'AI 시대, 판단하는 개발자',
    description: 'AI가 코드를 쓰는 시대에 더 중요해진 것 — 무엇을 왜 선택하는가, 판단과 취향의 기록.',
    href: '/book/judgment-dev',
    status: '출간 예정',
  },
]

export default booksData
