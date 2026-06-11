// 샘플 모드 — 녹화된 function_call 픽스처. 실제 호출과 동일한 콜백(onToolCall)로 재생.
// 키 없는 방문자가 데모 핵심을 100% 체험. 명령 4종.
export const SAMPLE_COMMANDS = [
  { label: '다크모드로 바꿔줘', call: { name: 'set_theme', args: { mode: 'dark' } } },
  { label: '가격 낮은 순으로 정렬해줘', call: { name: 'sort_by', args: { field: 'price', order: 'asc' } } },
  { label: '전자제품만 보여줘', call: { name: 'filter_category', args: { category: '전자제품' } } },
  { label: '맨 위로 스크롤', call: { name: 'scroll_to', args: { target: 'top' } } },
  { label: '필터 초기화하고 라이트모드로', call: { name: 'set_theme', args: { mode: 'light' } } },
]

// 샘플 재생: 잠깐의 "생각 중" 후 실제 호출과 동일하게 onToolCall 호출.
export function runSample(label, { onToolCall, onError, delay = 650 }) {
  const cmd = SAMPLE_COMMANDS.find((c) => c.label === label)
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!cmd) {
        onError && onError('샘플에 없는 명령입니다. "내 키로 실행"으로 자유 명령을 시도하세요.')
        return resolve()
      }
      onToolCall(cmd.call.name, cmd.call.args)
      // '필터 초기화하고 라이트모드로' = 복합 → 필터 해제도 함께
      if (label.includes('필터 초기화')) onToolCall('filter_category', { category: null })
      resolve()
    }, delay)
  })
}
