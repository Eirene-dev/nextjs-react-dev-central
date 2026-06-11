// 샘플 — 예시 문장 3종의 녹화 파싱 결과. 실제/샘플 모두 동일하게 onField 콜백으로 순차 채움.
export const SAMPLE_SENTENCES = [
  '금요일 저녁 7시, 어른 둘 아이 하나, 창가 자리, 땅콩 알레르기 있어요',
  '내일 점심 12시 30분 4명, 룸으로, 디너 B 코스, 김민호 010-1234-5678',
  '토요일 저녁 6시 둘이서 바 자리, 케이크 준비 부탁드려요',
]

const PARSED = {
  '금요일 저녁 7시, 어른 둘 아이 하나, 창가 자리, 땅콩 알레르기 있어요': {
    date: '금요일', time: '19:00', adults: 2, children: 1, seat: '창가', allergy: '땅콩',
  },
  '내일 점심 12시 30분 4명, 룸으로, 디너 B 코스, 김민호 010-1234-5678': {
    date: '내일', time: '12:30', adults: 4, children: 0, seat: '룸', course: '디너 B', name: '김민호', phone: '010-1234-5678',
  },
  '토요일 저녁 6시 둘이서 바 자리, 케이크 준비 부탁드려요': {
    date: '토요일', time: '18:00', adults: 2, children: 0, seat: '바', request: '케이크 준비 요청',
  },
}

// 순차 채움 재생 — 필드를 하나씩 onField 호출(자연어가 폼을 차례로 채우는 시각).
export function streamFill(parsed, { onField, done, step = 280 }) {
  const order = ['date', 'time', 'adults', 'children', 'seat', 'course', 'allergy', 'name', 'phone', 'request']
  const entries = order.filter((k) => parsed[k] !== undefined && parsed[k] !== '').map((k) => [k, parsed[k]])
  let i = 0
  const tick = () => {
    if (i >= entries.length) return done && done()
    onField(entries[i][0], entries[i][1]); i++
    setTimeout(tick, step)
  }
  setTimeout(tick, step)
}

export function getSampleParse(sentence) {
  return PARSED[sentence] || PARSED[SAMPLE_SENTENCES[0]]
}
