// 가상 제품 문서(문단마다 id) + 샘플 질문 4종(있음 3 + ★없음 1 — '없다' 답변 시연).
// ★ span-level: 각 인용은 {source_quote(본문 verbatim 구절), source_id(문단)}. 실키/샘플 동일 검증 경로.
export const DOC = [
  { id: 'p1', text: 'Nimbus 7은 1.6kg 무게의 14인치 노트북으로, 마그네슘 합금 바디를 씁니다.' },
  { id: 'p2', text: '배터리는 일반 사용 기준 약 18시간 지속되며, 45분 충전으로 50%까지 채워집니다.' },
  { id: 'p3', text: '포트는 USB-C 2개(둘 다 영상 출력·충전 지원), USB-A 1개, 3.5mm 오디오 잭을 제공합니다.' },
  { id: 'p4', text: '디스플레이는 2.8K 해상도, 120Hz 주사율, sRGB 100% 색역을 지원합니다.' },
  { id: 'p5', text: '보증은 기본 2년이며, 정품 등록 시 1년이 추가됩니다. 배터리는 별도 1년 보증입니다.' },
  { id: 'p6', text: '키보드는 1.5mm 키 스트로크에 백라이트를 내장했고, 지문 센서가 전원 버튼에 통합돼 있습니다.' },
]

export const SAMPLE_QA = {
  '배터리 얼마나 가나요?': {
    found: true,
    answer: '일반 사용 기준 약 18시간 지속되고, 45분 충전으로 50%까지 채워집니다.',
    citations: [
      { source_quote: '약 18시간 지속되며', source_id: 'p2' },
      { source_quote: '45분 충전으로 50%까지 채워집니다', source_id: 'p2' },
    ],
  },
  '영상 출력 되는 포트는?': {
    found: true,
    answer: 'USB-C 2개가 모두 영상 출력을 지원합니다.',
    citations: [{ source_quote: 'USB-C 2개(둘 다 영상 출력·충전 지원)', source_id: 'p3' }],
  },
  '보증 기간은?': {
    found: true,
    answer: '기본 2년이고 정품 등록 시 1년이 추가되며, 배터리는 별도 1년 보증입니다.',
    citations: [
      { source_quote: '보증은 기본 2년이며, 정품 등록 시 1년이 추가됩니다', source_id: 'p5' },
      { source_quote: '배터리는 별도 1년 보증입니다', source_id: 'p5' },
    ],
  },
  '방수 등급이 어떻게 되나요?': { found: false, answer: '', citations: [] }, // ★ 본문에 없음 → '없다'
}
export const SAMPLE_QUESTIONS = Object.keys(SAMPLE_QA)

// 샘플 재생 — 실제와 동일한 onAnswer 경로(잠깐 생각 후).
export function runSample(question, { onAnswer, delay = 700 }) {
  return new Promise((resolve) => {
    setTimeout(() => {
      onAnswer(SAMPLE_QA[question] || { found: false, answer: '', citations: [] })
      resolve()
    }, delay)
  })
}
