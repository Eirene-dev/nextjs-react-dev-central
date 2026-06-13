// 도메인 레지스트리 — ★ fields[] 가 단일 소스.
// 폼 렌더(label/type/opts) · gemini 프롬프트의 필드 목록 · validateExtractions 허용 키 · streamFill order
// 를 모두 fields 에서 파생한다(3곳 중복 제거). 도메인 추가는 이 배열에 객체 하나.
//
// 도메인 객체: { id, label, fields:[{key,label,type,opts?,ph?}], systemPrompt, samples:[{sentence, extractions:[{field,value,source_text}]}] }
// 추출 투명성(source_text + substring 검증 + 문장 하이라이트)은 추출 계층이라 전 도메인에 자동 적용.

export const DOMAINS = [
  {
    id: 'reservation',
    label: '식당 예약',
    fields: [
      { key: 'date', label: '날짜', type: 'text', ph: 'YYYY-MM-DD / 요일' },
      { key: 'time', label: '시간', type: 'text', ph: 'HH:MM' },
      { key: 'adults', label: '성인', type: 'number' },
      { key: 'children', label: '아동', type: 'number' },
      { key: 'seat', label: '좌석', type: 'select', opts: ['', '창가', '룸', '일반', '바'] },
      { key: 'course', label: '코스', type: 'select', opts: ['', '런치', '디너 A', '디너 B', '미정'] },
      { key: 'allergy', label: '알레르기', type: 'text', ph: '예: 땅콩' },
      { key: 'name', label: '예약자', type: 'text' },
      { key: 'phone', label: '연락처', type: 'text' },
      { key: 'request', label: '요청사항', type: 'text' },
    ],
    systemPrompt: '식당 예약 문장에서 폼 필드를 추출하라. 값(value)은 정규화하되(저녁 7시→19:00, 어른 둘→2) source_text 는 원문 그대로.',
    samples: [
      {
        sentence: '금요일 저녁 7시, 어른 둘 아이 하나, 창가 자리, 땅콩 알레르기 있어요',
        extractions: [
          { field: 'date', value: '금요일', source_text: '금요일' },
          { field: 'time', value: '19:00', source_text: '저녁 7시' },
          { field: 'adults', value: '2', source_text: '어른 둘' },
          { field: 'children', value: '1', source_text: '아이 하나' },
          { field: 'seat', value: '창가', source_text: '창가 자리' },
          // ↓ source_text 가 원문 substring 아님(공백 빠짐) → 검증에서 근거 버려지고 값만(환각 방지 시연)
          { field: 'allergy', value: '땅콩', source_text: '땅콩알레르기' },
        ],
      },
      {
        sentence: '내일 점심 12시 30분 4명, 룸으로, 디너 B 코스, 김민호 010-1234-5678',
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
      {
        sentence: '토요일 저녁 6시 둘이서 바 자리, 케이크 준비 부탁드려요',
        extractions: [
          { field: 'date', value: '토요일', source_text: '토요일' },
          { field: 'time', value: '18:00', source_text: '저녁 6시' },
          { field: 'adults', value: '2', source_text: '둘이서' },
          { field: 'seat', value: '바', source_text: '바 자리' },
          { field: 'request', value: '케이크 준비 요청', source_text: '케이크 준비' },
        ],
      },
    ],
  },
  {
    id: 'delivery',
    label: '배송 주문',
    fields: [
      { key: 'recipient', label: '받는 분', type: 'text' },
      { key: 'phone', label: '연락처', type: 'text' },
      { key: 'address', label: '배송지', type: 'text' },
      { key: 'product', label: '상품', type: 'text' },
      { key: 'quantity', label: '수량', type: 'number' },
      { key: 'delivery_date', label: '희망일', type: 'text', ph: 'YYYY-MM-DD / 요일' },
      { key: 'delivery_time', label: '시간대', type: 'select', opts: ['', '오전', '오후', '저녁'] },
      { key: 'payment', label: '결제', type: 'select', opts: ['', '카드', '계좌이체', '무통장'] },
      { key: 'request', label: '요청사항', type: 'text' },
    ],
    systemPrompt: '배송 주문 문장에서 폼 필드를 추출하라. 값(value)은 정규화하되(두 대→2, 오후→오후) source_text 는 원문 그대로.',
    samples: [
      {
        sentence: '내일 오후에 김철수한테 서울 강남구로 노트북 2대 카드로 보내줘',
        extractions: [
          { field: 'delivery_date', value: '내일', source_text: '내일' },
          { field: 'delivery_time', value: '오후', source_text: '오후' },
          { field: 'recipient', value: '김철수', source_text: '김철수' },
          { field: 'address', value: '서울 강남구', source_text: '서울 강남구' },
          { field: 'product', value: '노트북', source_text: '노트북' },
          { field: 'quantity', value: '2', source_text: '2대' },
          { field: 'payment', value: '카드', source_text: '카드' },
        ],
      },
      {
        sentence: '박영희 010-9876-5432, 부산 해운대구로 텀블러 3개 무통장으로 금요일 오전 배송, 부재시 경비실에 맡겨주세요',
        extractions: [
          { field: 'recipient', value: '박영희', source_text: '박영희' },
          { field: 'phone', value: '010-9876-5432', source_text: '010-9876-5432' },
          { field: 'address', value: '부산 해운대구', source_text: '부산 해운대구' },
          { field: 'product', value: '텀블러', source_text: '텀블러' },
          { field: 'quantity', value: '3', source_text: '3개' },
          { field: 'payment', value: '무통장', source_text: '무통장' },
          { field: 'delivery_date', value: '금요일', source_text: '금요일' },
          { field: 'delivery_time', value: '오전', source_text: '오전' },
          { field: 'request', value: '부재시 경비실 보관', source_text: '경비실에 맡겨주세요' },
        ],
      },
    ],
  },
  {
    id: 'job',
    label: '채용 지원',
    fields: [
      { key: 'name', label: '이름', type: 'text' },
      { key: 'email', label: '이메일', type: 'text' },
      { key: 'phone', label: '연락처', type: 'text' },
      { key: 'position', label: '직무', type: 'text' },
      { key: 'experience', label: '경력', type: 'text', ph: '예: 5년' },
      { key: 'skills', label: '보유 기술', type: 'text' },
      { key: 'portfolio', label: '포트폴리오', type: 'text', ph: 'URL' },
      { key: 'available_date', label: '입사 가능일', type: 'text' },
      { key: 'expected_salary', label: '희망 연봉', type: 'text' },
      { key: 'cover', label: '한 줄 소개', type: 'text' },
    ],
    systemPrompt: '채용 지원 문장에서 폼 필드를 추출하라. 값(value)은 정규화하되 source_text 는 원문 그대로. 경력은 "5년"처럼 간결히.',
    samples: [
      {
        sentence: '프론트엔드 개발자로 지원합니다. 홍길동, 경력 5년, React·TypeScript 주력, 다음 달부터 가능',
        extractions: [
          { field: 'position', value: '프론트엔드 개발자', source_text: '프론트엔드 개발자' },
          { field: 'name', value: '홍길동', source_text: '홍길동' },
          { field: 'experience', value: '5년', source_text: '경력 5년' },
          { field: 'skills', value: 'React·TypeScript', source_text: 'React·TypeScript' },
          { field: 'available_date', value: '다음 달', source_text: '다음 달부터' },
        ],
      },
      {
        sentence: '백엔드 엔지니어 지원합니다. 이수민 sumin@mail.com, 경력 3년, Java·Spring, 희망 연봉 6000만원, 포트폴리오 github.com/sumin',
        extractions: [
          { field: 'position', value: '백엔드 엔지니어', source_text: '백엔드 엔지니어' },
          { field: 'name', value: '이수민', source_text: '이수민' },
          { field: 'email', value: 'sumin@mail.com', source_text: 'sumin@mail.com' },
          { field: 'experience', value: '3년', source_text: '경력 3년' },
          { field: 'skills', value: 'Java·Spring', source_text: 'Java·Spring' },
          { field: 'expected_salary', value: '6000만원', source_text: '희망 연봉 6000만원' },
          { field: 'portfolio', value: 'github.com/sumin', source_text: 'github.com/sumin' },
        ],
      },
    ],
  },
]

export const getDomain = (id) => DOMAINS.find((d) => d.id === id) || DOMAINS[0]
