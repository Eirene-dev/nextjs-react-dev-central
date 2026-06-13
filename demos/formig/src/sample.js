// 샘플 — 예시 문장 3종의 녹화 추출(값 + 근거 source_text). 실제/샘플 모두 동일 경로:
// validateExtractions(substring 검증) → streamFill(onField 순차 콜백). 키 없이 투명성 동일 체험.
export const SAMPLE_SENTENCES = [
  '금요일 저녁 7시, 어른 둘 아이 하나, 창가 자리, 땅콩 알레르기 있어요',
  '내일 점심 12시 30분 4명, 룸으로, 디너 B 코스, 김민호 010-1234-5678',
  '토요일 저녁 6시 둘이서 바 자리, 케이크 준비 부탁드려요',
]

// 각 문장의 추출 결과(extractions). value 는 정규화, source_text 는 원문 구절 그대로.
const PARSED = {
  '금요일 저녁 7시, 어른 둘 아이 하나, 창가 자리, 땅콩 알레르기 있어요': {
    extractions: [
      { field: 'date', value: '금요일', source_text: '금요일' },
      { field: 'time', value: '19:00', source_text: '저녁 7시' },
      { field: 'adults', value: '2', source_text: '어른 둘' },
      { field: 'children', value: '1', source_text: '아이 하나' },
      { field: 'seat', value: '창가', source_text: '창가 자리' },
      // ↓ source_text 가 원문 substring 이 아님(공백 빠짐) → 검증에서 근거 버려지고 값만 채워짐(환각 방지 시연)
      { field: 'allergy', value: '땅콩', source_text: '땅콩알레르기' },
    ],
  },
  '내일 점심 12시 30분 4명, 룸으로, 디너 B 코스, 김민호 010-1234-5678': {
    extractions: [
      { field: 'date', value: '내일', source_text: '내일' },
      { field: 'time', value: '12:30', source_text: '12시 30분' },
      { field: 'adults', value: '4', source_text: '4명' },
      { field: 'seat', value: '룸', source_text: '룸으로' },
      { field: 'course', value: '디너 B', source_text: '디너 B 코스' },
      { field: 'name', value: '김민호', source_text: '김민호' },
      { field: 'phone', value: '010-1234-5678', source_text: '010-1234-5678' },
    ],
  },
  '토요일 저녁 6시 둘이서 바 자리, 케이크 준비 부탁드려요': {
    extractions: [
      { field: 'date', value: '토요일', source_text: '토요일' },
      { field: 'time', value: '18:00', source_text: '저녁 6시' },
      { field: 'adults', value: '2', source_text: '둘이서' },
      { field: 'seat', value: '바', source_text: '바 자리' },
      { field: 'request', value: '케이크 준비 요청', source_text: '케이크 준비' },
    ],
  },
}

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

export function getSampleParse(sentence) {
  return PARSED[sentence] || PARSED[SAMPLE_SENTENCES[0]]
}
