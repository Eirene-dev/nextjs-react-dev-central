// 샘플 — 질문별 완성 components 배열 픽스처. ★ 서로 다른 질문이 서로 다른 컴포넌트 세트를 낸다
// (AI 가 UI 를 고른다는 증거). 실제/샘플 모두 동일 경로: validateComponents → streamComponents(onSection).
// 픽스처 필드명은 스키마(gemini.js)와 동일(timeline_items/checklist_items/columns/rows/metrics) → 검증 경로 동일.
export const SAMPLE_PROMPTS = ['부산 2박 3일 여행 계획', '이번 분기 핵심 지표 보여줘', '노트북 A vs B 사양 비교']

const PLANS = {
  '부산 2박 3일 여행 계획': {
    components: [
      { type: 'card', title: '부산 2박 3일', body: '바다·도시·먹거리를 고루 담은 3일 코스.' },
      { type: 'timeline', timeline_items: [
        { time: '14:00', label: '해운대 해변', note: '체크인 후 산책' },
        { time: '17:00', label: '더베이101', note: '야경 명소' },
        { time: '19:30', label: '광안리 회센터', note: '저녁' },
        { time: '10:00', label: '감천문화마을', note: '2일차 골목 사진' },
        { time: '10:00', label: '해동용궁사', note: '3일차 바다 절경' },
      ] },
      { type: 'checklist', checklist_items: ['선크림·모자', '편한 신발', '교통카드 충전', '회센터 예약', '우산(변덕 날씨)'] },
    ],
  },
  '이번 분기 핵심 지표 보여줘': {
    components: [
      { type: 'stat', metrics: [
        { label: '매출', value: '₩128.4M', delta: '+12.4%' },
        { label: '주문', value: '3,210', delta: '+5.1%' },
        { label: '전환율', value: '2.8%', delta: '-0.3%' },
      ] },
      { type: 'table', columns: ['분기', '매출', '주문', 'YoY'], rows: [
        ['Q1', '₩98.2M', '2,510', '+8%'],
        ['Q2', '₩110.7M', '2,880', '+10%'],
        ['Q3', '₩119.1M', '3,020', '+11%'],
        ['Q4', '₩128.4M', '3,210', '+12%'],
      ] },
      // ↓ 미지 타입(gauge) — 레지스트리에 없어 검증에서 버려짐(generativity 안전장치 시연)
      { type: 'gauge', value: '0.82' },
    ],
  },
  '노트북 A vs B 사양 비교': {
    components: [
      { type: 'table', columns: ['항목', 'A — Nimbus 14', 'B — Vertex 15'], rows: [
        ['CPU', '8코어 3.4GHz', '10코어 3.2GHz'],
        ['메모리', '16GB', '32GB'],
        ['무게', '1.2kg', '1.6kg'],
        ['배터리', '18시간', '14시간'],
        ['가격', '₩1,690,000', '₩1,990,000'],
      ] },
      { type: 'card', title: '추천', body: '휴대성·배터리 우선이면 A, 멀티태스킹·메모리 우선이면 B. 일반 업무엔 A가 균형이 좋습니다.' },
    ],
  },
}

// 점진 조립 재생 — components 배열을 순차로 onSection 호출(스트리밍처럼 쌓임). 기존 480ms 재사용.
export function streamComponents(components, { onReset, onSection, done, step = 480 }) {
  onReset()
  let i = 0
  const tick = () => {
    if (i >= components.length) return done && done()
    onSection(components[i]); i++
    setTimeout(tick, step)
  }
  setTimeout(tick, step)
}

export function getSamplePlan(prompt) {
  return PLANS[prompt] || PLANS['부산 2박 3일 여행 계획']
}
