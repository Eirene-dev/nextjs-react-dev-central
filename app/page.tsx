import Main from './Main'

// 홈 에세이 미리보기가 DB(발행 글) 의존 → 매 요청 렌더.
export const dynamic = 'force-dynamic'

export default function Page() {
  return <Main />
}
