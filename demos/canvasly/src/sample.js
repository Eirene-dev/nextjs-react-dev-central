// 샘플 — 완성된 여행 계획 픽스처 2종. 실제/샘플 모두 동일하게 onSection 콜백으로 점진 조립.
export const SAMPLE_PROMPTS = ['부산 2박 3일 여행 계획', '제주 당일치기 코스']

const PLANS = {
  '부산 2박 3일 여행 계획': {
    title: '부산 2박 3일',
    summary: '바다·도시·먹거리를 고루 담은 3일 코스.',
    days: [
      { day: '1일차 — 해운대·광안리', items: [
        { time: '14:00', place: '해운대 해변', note: '체크인 후 산책' },
        { time: '17:00', place: '더베이101', note: '야경 명소' },
        { time: '19:30', place: '광안리 회센터', note: '저녁' },
      ] },
      { day: '2일차 — 원도심·감천', items: [
        { time: '10:00', place: '감천문화마을', note: '골목 사진' },
        { time: '13:00', place: '자갈치시장', note: '점심' },
        { time: '16:00', place: '국제시장·BIFF', note: '거리 간식' },
      ] },
      { day: '3일차 — 기장', items: [
        { time: '10:00', place: '해동용궁사', note: '바다 절경' },
        { time: '12:30', place: '기장 멸치 정식', note: '점심 후 귀가' },
      ] },
    ],
    checklist: ['선크림·모자', '편한 신발', '교통카드 충전', '회센터 예약', '우산(변덕 날씨)'],
  },
  '제주 당일치기 코스': {
    title: '제주 당일치기',
    summary: '동부 해안 한 바퀴, 무리 없이.',
    days: [
      { day: '하루 — 동부 해안', items: [
        { time: '09:30', place: '성산일출봉', note: '오전 등반' },
        { time: '12:00', place: '광치기 해변', note: '점심·산책' },
        { time: '14:30', place: '비자림', note: '숲길' },
        { time: '17:00', place: '함덕 해변', note: '카페·노을' },
      ] },
    ],
    checklist: ['렌터카 예약', '입장권 모바일', '바람막이', '간식·물'],
  },
}

// 점진 조립 재생 — title→요약→day들→체크리스트를 순차로 onSection 호출(스트리밍처럼 쌓임).
export function streamPlan(plan, { onReset, onSection, done, step = 480 }) {
  onReset()
  const seq = [{ kind: 'head', title: plan.title, summary: plan.summary }]
  plan.days.forEach((d) => seq.push({ kind: 'day', ...d }))
  seq.push({ kind: 'checklist', items: plan.checklist })
  let i = 0
  const tick = () => {
    if (i >= seq.length) return done && done()
    onSection(seq[i]); i++
    setTimeout(tick, step)
  }
  setTimeout(tick, step)
}

export function getSamplePlan(prompt) {
  return PLANS[prompt] || PLANS['부산 2박 3일 여행 계획']
}
