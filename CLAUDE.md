# reactnext-central

Next.js 개인 허브 / 책 동반 사이트. /book·/essays·/showcases·/archive 구조.
(스택·주요 관례·건드리지 말 폴더 등은 여기 채워넣기)

## UI 작업 검증 (필수)
UI·스타일·애니메이션 수정 작업에 한해 적용 (백엔드/로직만 바꾸는 작업엔 미적용):
1. 변경 후 chrome-devtools로 http://localhost:3000 의 해당 페이지를 열어
   스크린샷으로 레이아웃을 확인하고 콘솔에 새 에러가 없는지 본다.
2. 스크롤 애니메이션 추가·수정 시 Performance 트레이스(CPU 4x)로 INP·CLS와
   50ms 초과 long task를 확인하고 prefers-reduced-motion 대안이 있는지 본다.
3. 시각 확인 전에는 "완료"로 보고하지 않는다. 확인 후 무엇을 봤는지
   (스크린샷/지표)를 한 줄로 보고한다.

## 애니메이션 규약 (GSAP / ScrollTrigger / Lenis)

### 적용 범위 (★먼저 읽을 것)
- GSAP/Lenis는 **본 사이트(Next.js)에서만** — showcases 목록 + 실험별 서사형(narrative) 섹션에.
- ★ demos/{slug}/ 안 데모 자체는 건드리지 않는다. 특히 다음은 "JS 0줄 / 플랫폼 원시 기능"이 정체성(제목·footer 명시)이라 GSAP·외부 JS 추가 금지 — 넣으면 데모의 존재 이유가 사라진다:
  - drift(animation-timeline), slate(Popover/Anchor/@starting-style), folio(cross-document View Transitions), aura-one(CSS scroll-driven).
- vanta(CSS scroll-snap)·ledgr(IO 코드 동기)도 고유 시그니처가 있으니 의도적 결정 없이 GSAP로 덮지 않는다.
- AI×웹 데모(React)는 JS 네이티브 — 서사형 프레젠테이션은 가능하되 데모의 기능 로직은 보존.

### 의미 우선 (★하드 규칙)
- 모든 스크롤 비트는 "이게 보는 사람에게 이 실험에 대해 무엇을 이해시키는가"에 답해야 한다. 답 못 하는 효과(animation for animation's sake)는 넣지 않는다. 화려함이 콘텐츠를 가리면 후퇴다.

### 구현 규약
- 애니메이션 컴포넌트는 'use client'. AOS류 금지(App Router RSC 하이드레이션 깨짐).
- 클린업은 @gsap/react의 useGSAP()로(언마운트/리렌더 시 자동 revert). gsap.registerPlugin(ScrollTrigger)는 모듈 레벨 1회.
- 부드러운 스크롤은 Lenis, ScrollTrigger와 반드시 동기화(lenis.on('scroll', ScrollTrigger.update) + gsap.ticker raf).
- 이미지/동적 콘텐츠 로드 후 ScrollTrigger.refresh()(레이아웃 시프트 방지).
- transform(translate/scale/opacity)만 애니메이션. layout 속성(top/height 등) 금지 — INP/CLS 보호.
- prefers-reduced-motion일 때 모션 없는 대안(콘텐츠는 그대로 보이게).

### 성능 예산 (시각 루프에서 매번 재측정)
- scrub·pin은 잰크를 부른다. chrome-devtools Performance 트레이스로 INP/CLS/long task가 기존 Good 기준에서 후퇴 안 했는지 확인. 예산 초과 = "세련"이 아니라 "버벅임" → 효과 단순화.

### 인프라는 공유, 안무는 맞춤
- 재사용 프리미티브(<ScrollSection> 등, 안무를 설정으로)는 공유하되, 실험마다 움직임은 그 본질에 맞게 다르게. 전부 동일 모션이면 기계적이고 "의미있는"을 스스로 깎는다.

(라이선스: GSAP는 2025-04 이후 100% 무료 — 프리미엄 플러그인·상업 사용 포함. gsap.com/standard-license.)