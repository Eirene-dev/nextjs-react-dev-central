// 샘플 재생 — 코퍼스별 녹화 답(span 인용)은 corpora.js 의 samples 가 보유.
// 실키/샘플 모두 동일 경로: onAnswer → validateCitations. 미등록 질문은 found:false('없다').
export function runSample(samples, question, { onAnswer, delay = 700 }) {
  return new Promise((resolve) => {
    setTimeout(() => {
      onAnswer(samples[question] || { found: false, answer: '', citations: [] })
      resolve()
    }, delay)
  })
}
