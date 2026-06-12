// 샘플 모드 — 녹화된 다중 function_call 픽스처. 실키와 동일 콜백(onToolCall)로 재생.
// 픽스처 스키마: { label, calls: [{name, args}, ...] } — 한 명령이 도구 여러 개를 순차 적용.
// scene 별 samples 배열을 받아 label 정확 일치로 조회(특례 분기 없음 — calls 배열로 일반 처리).
export function runSample(samples, label, { onToolCall, onError, delay = 650 }) {
  const cmd = samples.find((c) => c.label === label)
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!cmd) {
        onError && onError('샘플에 없는 명령입니다. "내 키로 실행"으로 자유 명령을 시도하세요.')
        return resolve()
      }
      for (const c of cmd.calls) onToolCall(c.name, c.args)
      resolve()
    }, delay)
  })
}
