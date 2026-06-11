# Drift — 원두의 여정

가상 커피 브랜드의 스크롤 내러티브 한 페이지.

## 무엇을 보여주나
스크롤만으로 진행되는 스토리텔링 — 상단 진행 바, 텍스트 떠오름(rise), 이미지 시차(parallax). **전부 CSS, JavaScript 0줄.**

## 핵심 기술
- **CSS Scroll-driven Animations**: 진행 바 = `animation-timeline: scroll(root block)`, 섹션 reveal·시차 = `animation-timeline: view()` + `animation-range`.
- 스크립트 없음(진짜 0줄). 미지원 브라우저는 `@supports (animation-timeline: scroll())`로 감지해 안내 배너 표시 + 내용은 정적으로 그대로 노출.

## 브라우저 요구
- Chrome/Edge 115+ 등 Scroll-driven Animations 지원 브라우저. 미지원 시 효과만 생략(콘텐츠·읽기 정상).

## 로컬 실행
`index.html`을 브라우저로 열기.
