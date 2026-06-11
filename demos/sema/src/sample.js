// 샘플 — 키워드가 안 겹치는데 의미는 맞는 질의 위주(단순 키워드 검색과 다름이 한눈에).
// 녹화된 상위 매칭(id, score)을 onResults 로 재생. 키 없이 의미 매칭 시연.
export const SAMPLE_QUERIES = [
  { q: '돈 돌려받고 싶어요', hits: [['h01', 0.89], ['h05', 0.62]] }, // '환불' 단어 없이 → 취소·환불 정책
  { q: '비번 까먹었어요', hits: [['h03', 0.91], ['h04', 0.48]] }, // '비번'≠'비밀번호'
  { q: '택배 언제 와요?', hits: [['h02', 0.88], ['h13', 0.71], ['h08', 0.55]] }, // '택배'≠'배송'
  { q: '서비스 그만 쓸래요', hits: [['h04', 0.86], ['h01', 0.51]] }, // → 계정 삭제(탈퇴)
]

export function runSample(query, { onResults, delay = 550 }) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const found = SAMPLE_QUERIES.find((s) => s.q === query)
      onResults(found ? found.hits : [])
      resolve()
    }, delay)
  })
}
