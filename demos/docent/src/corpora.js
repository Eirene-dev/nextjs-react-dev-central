// 코퍼스 레지스트리 — { id, label, doc:[{id,text}], samples:{질문→{found,answer,citations}} }.
// ★ doc 이 단일 소스: askGrounded 프롬프트 본문 · validateCitations 검증 기준 · 문서 패널 렌더 모두 활성 코퍼스 doc 에서.
// span 인용·검증·"모르면 모른다"는 그라운딩 계층이라 전 코퍼스 자동 적용. 코퍼스 추가 = 이 배열에 객체 하나.
// citations.source_quote 는 반드시 해당 문단의 verbatim substring(검증 통과 조건).

export const CORPORA = [
  {
    id: 'nimbus',
    label: '제품 — Nimbus 7',
    doc: [
      { id: 'p1', text: 'Nimbus 7은 1.6kg 무게의 14인치 노트북으로, 마그네슘 합금 바디를 씁니다.' },
      { id: 'p2', text: '배터리는 일반 사용 기준 약 18시간 지속되며, 45분 충전으로 50%까지 채워집니다.' },
      { id: 'p3', text: '포트는 USB-C 2개(둘 다 영상 출력·충전 지원), USB-A 1개, 3.5mm 오디오 잭을 제공합니다.' },
      { id: 'p4', text: '디스플레이는 2.8K 해상도, 120Hz 주사율, sRGB 100% 색역을 지원합니다.' },
      { id: 'p5', text: '보증은 기본 2년이며, 정품 등록 시 1년이 추가됩니다. 배터리는 별도 1년 보증입니다.' },
      { id: 'p6', text: '키보드는 1.5mm 키 스트로크에 백라이트를 내장했고, 지문 센서가 전원 버튼에 통합돼 있습니다.' },
    ],
    samples: {
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
      '방수 등급이 어떻게 되나요?': { found: false, answer: '', citations: [] }, // ★ 본문에 없음
    },
  },
  {
    id: 'refund',
    label: '환불·교환 정책',
    doc: [
      { id: 'r1', text: '단순 변심 반품은 상품 수령 후 7일 이내 가능하며, 왕복 배송비는 구매자가 부담합니다.' },
      { id: 'r2', text: '상품 불량·오배송의 경우 수령 후 30일 이내 무상 반품·교환되며, 배송비는 당사가 부담합니다.' },
      { id: 'r3', text: '개봉 후 사용 흔적이 있는 위생용품·식품은 단순 변심 반품이 불가합니다.' },
      { id: 'r4', text: '환불은 반품 상품 회수가 확인된 후 3영업일 이내에 결제 수단으로 처리됩니다.' },
      { id: 'r5', text: '교환은 동일 상품의 다른 옵션(색상·사이즈)에 한해 1회 무상으로 제공됩니다.' },
      { id: 'r6', text: '주문 제작·맞춤 상품은 제작에 착수한 후에는 취소·반품이 제한됩니다.' },
    ],
    samples: {
      '단순 변심 반품 며칠 안에 되나요?': {
        found: true,
        answer: '단순 변심 반품은 상품 수령 후 7일 이내 가능합니다(왕복 배송비는 구매자 부담).',
        citations: [{ source_quote: '상품 수령 후 7일 이내 가능하며', source_id: 'r1' }],
      },
      '불량이면 배송비 누가 내요?': {
        found: true,
        answer: '상품 불량·오배송이면 배송비는 당사가 부담합니다.',
        citations: [{ source_quote: '배송비는 당사가 부담합니다', source_id: 'r2' }],
      },
      '환불은 언제 처리되나요?': {
        found: true,
        answer: '반품 상품 회수가 확인된 후 3영업일 이내에 처리됩니다.',
        citations: [{ source_quote: '회수가 확인된 후 3영업일 이내에 결제 수단으로 처리됩니다', source_id: 'r4' }],
      },
      '포인트 적립은 어떻게 되나요?': { found: false, answer: '', citations: [] }, // ★ 정책에 없음
    },
  },
  {
    id: 'faq',
    label: '서비스 이용 FAQ',
    doc: [
      { id: 'f1', text: '무료 플랜은 프로젝트 3개와 멤버 2명까지 지원하며, 기능 제한 없이 핵심 도구를 제공합니다.' },
      { id: 'f2', text: '프로 플랜은 월 9,900원이며 프로젝트·멤버 무제한, 우선 지원과 버전 기록을 제공합니다.' },
      { id: 'f3', text: '결제는 매월 자동 갱신되며, 갱신 7일 전에 이메일로 안내합니다.' },
      { id: 'f4', text: '구독은 설정 > 결제에서 언제든 해지할 수 있고, 해지 후에도 결제 주기 종료일까지 이용됩니다.' },
      { id: 'f5', text: '데이터는 매일 자동 백업되며, 탈퇴 시 30일간 보관 후 영구 삭제됩니다.' },
      { id: 'f6', text: '팀 워크스페이스는 역할 기반 권한(소유자·편집자·뷰어)을 지원합니다.' },
    ],
    samples: {
      '무료 플랜 멤버 몇 명까지?': {
        found: true,
        answer: '무료 플랜은 멤버 2명까지 지원합니다.',
        citations: [{ source_quote: '멤버 2명까지 지원하며', source_id: 'f1' }],
      },
      '구독 해지하면 바로 끊겨요?': {
        found: true,
        answer: '아니요, 해지 후에도 결제 주기 종료일까지 이용됩니다.',
        citations: [{ source_quote: '해지 후에도 결제 주기 종료일까지 이용됩니다', source_id: 'f4' }],
      },
      '탈퇴하면 데이터 언제 삭제돼요?': {
        found: true,
        answer: '탈퇴 시 30일간 보관 후 영구 삭제됩니다.',
        citations: [{ source_quote: '탈퇴 시 30일간 보관 후 영구 삭제됩니다', source_id: 'f5' }],
      },
      '전화 상담 번호 알려줘': { found: false, answer: '', citations: [] }, // ★ FAQ에 없음
    },
  },
]

export const getCorpus = (id) => CORPORA.find((c) => c.id === id) || CORPORA[0]
