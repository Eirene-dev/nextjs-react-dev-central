// 샘플 — 질문별 완성 components 배열 픽스처. ★ 서로 다른 질문이 서로 다른 컴포넌트 세트를 낸다.
// 실제/샘플 모두 동일 경로: validateComponents → streamComponents(onSection). 필드명은 스키마(gemini.js)와 동일.
export const SAMPLE_PROMPTS = [
  '부산 2박 3일 여행 계획',
  '이번 분기 핵심 지표 보여줘',
  '리액트 배우는 단계별 로드맵',
  '아이폰 16 vs 갤럭시 S25 비교',
  '이 노트북 사양 정리해줘',
  '프로젝트 진행 현황 보고',
]

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
      // ↓ 미지 타입(chart) — 레지스트리에 없어 검증에서 버려짐(불량 버림 시연 유지)
      { type: 'chart', series: [1, 2, 3] },
    ],
  },
  '리액트 배우는 단계별 로드맵': {
    components: [
      { type: 'step', steps: [
        { title: '기초 JS·ES6', detail: 'let/const, 화살표 함수, 구조분해, 모듈' },
        { title: 'JSX·컴포넌트', detail: 'props/state, 이벤트 핸들링' },
        { title: 'Hooks', detail: 'useState/useEffect/커스텀 훅' },
        { title: '상태·데이터', detail: 'Context, 서버 상태, 라우팅' },
        { title: '실전 프로젝트', detail: '작은 앱을 배포까지' },
      ] },
      { type: 'checklist', checklist_items: ['공식문서 react.dev 정독', '매주 작은 결과물 1개', '에러는 검색 전에 먼저 읽기'] },
      { type: 'callout', variant: 'tip', title: '학습 팁', body: '튜토리얼을 따라치기보다, 빈 화면에서 다시 만들어 보세요.' },
    ],
  },
  '아이폰 16 vs 갤럭시 S25 비교': {
    components: [
      { type: 'compare', options: ['iPhone 16', 'Galaxy S25'], compare_rows: [
        { label: '칩', values: ['A18', 'Snapdragon 8 Elite'] },
        { label: '디스플레이', values: ['6.1" OLED', '6.2" AMOLED'] },
        { label: '카메라', values: ['48MP 듀얼', '50MP 트리플'] },
        { label: '배터리', values: ['3561mAh', '4000mAh'] },
        { label: '가격', values: ['₩1,250,000', '₩1,155,000'] },
      ] },
      { type: 'card', title: '한 줄 추천', body: '생태계·영상은 iPhone 16, 화면·줌·가격은 Galaxy S25.' },
    ],
  },
  '이 노트북 사양 정리해줘': {
    components: [
      { type: 'spec', specs: [
        { label: 'CPU', value: '8코어 3.4GHz' },
        { label: '메모리', value: '16GB LPDDR5' },
        { label: '저장', value: '512GB SSD' },
        { label: '디스플레이', value: '14" 2.8K 120Hz' },
        { label: '무게', value: '1.2kg' },
        { label: '포트', value: 'USB-C ×2, HDMI' },
      ] },
      { type: 'gauge', label: '배터리 수명', value: '82%', max: '100' },
    ],
  },
  '프로젝트 진행 현황 보고': {
    components: [
      { type: 'stat', metrics: [
        { label: '완료 태스크', value: '48', delta: '+6' },
        { label: '진행 중', value: '7' },
        { label: '지연', value: '2', delta: '-1' },
      ] },
      { type: 'gauge', label: '전체 진행률', value: '68%', max: '100' },
      { type: 'table', columns: ['마일스톤', '상태', '기한'], rows: [
        ['설계', '완료', '5/10'],
        ['구현', '진행', '6/20'],
        ['QA', '대기', '7/01'],
      ] },
      { type: 'callout', variant: 'warn', title: '리스크', body: 'QA 단계가 인력 부족으로 지연 가능성. 다음 주 검토 필요.' },
    ],
  },
}

// 점진 조립 재생 — components 배열을 순차로 onSection 호출. 기존 480ms 재사용.
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
