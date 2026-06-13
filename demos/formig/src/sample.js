// 샘플 — 도메인별 녹화 추출(값 + 근거 source_text)은 domains.js 의 samples 가 보유.
// 실제/샘플 모두 동일 경로: validateExtractions(substring 검증) → streamFill(onField 순차 콜백).

// 순차 채움 재생 — 검증된 추출 배열을 하나씩 onField(field, value, source) 호출.
// 자연어가 폼을 차례로 채우고, 동시에 그 근거 구절이 문장에서 하이라이트되는 시각.
export function streamFill(items, { onField, done, step = 320 }) {
  let i = 0
  const tick = () => {
    if (i >= items.length) return done && done()
    const it = items[i]
    onField(it.field, it.value, it.source)
    i++
    setTimeout(tick, step)
  }
  setTimeout(tick, step)
}

// 활성 도메인의 샘플에서 문장 정확 일치(없으면 첫 샘플 fallback)로 추출 결과 반환.
export function getSampleParse(domain, sentence) {
  const hit = domain.samples.find((s) => s.sentence === sentence)
  return hit || domain.samples[0]
}
