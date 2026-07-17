import Main from './Main'

// 홈 에세이 미리보기가 DB(발행 글) 의존 → 매 요청 렌더.
// Neon compute 는 여기가 아니라 listPublishedEssays 의 데이터 캐시가 지킨다(요청당 DB 왕복 0).
// force-dynamic 을 유지하는 이유: ISR 로 바꾸면 빌드 타임 프리렌더가 DB 접속을 요구해
// 배포가 DB 상태에 묶인다(할당량 소진 시 빌드 자체가 실패).
export const dynamic = 'force-dynamic'

export default function Page() {
  return <Main />
}
