# Drift — 원두의 여정

가상 커피 브랜드의 스크롤 내러티브 한 페이지.

## 무엇을 보여주나
스크롤만으로 진행되는 스토리텔링 — 상단 진행 바, 텍스트 떠오름(rise), 이미지 시차(parallax), **단계별 SVG 커피 일러스트**(체리·핸드픽·로스팅 곡선·푸어오버). **전부 CSS/SVG, JavaScript 0줄·이미지 자산 0.**

## 핵심 기술
- **CSS Scroll-driven Animations**: 진행 바 = `animation-timeline: scroll(root block)`, 섹션 reveal·시차·일러스트 = `animation-timeline: view()` + `animation-range`.
- **단계별 SVG 일러스트(이미지 0)**: ① 씨앗(체리+안개) ② 수확(익은 체리 핸드픽 리빌) ③ 로스팅(온도-시간 곡선을 `stroke-dashoffset` scrub으로 그림 + 1차 크랙 마커) ④ 한 잔(V60 드리퍼 + 떨어지는 물방울·스팀 CSS 애니).
- **`prefers-reduced-motion`**: 모든 모션(진행바·리빌·시차·일러스트·드립·스팀·안개·bob) 정지, 내용은 정적 노출.
- 스크립트 없음(진짜 0줄). 미지원 브라우저는 `@supports (animation-timeline)`로 감지해 안내 배너 표시 + 내용·일러스트는 정적으로 노출(로스팅 곡선도 그려진 상태).

## 브라우저 요구
- Chrome/Edge 115+ 등 Scroll-driven Animations 지원 브라우저. 미지원 시 효과만 생략(콘텐츠·읽기 정상).

## 로컬 실행
`index.html`을 브라우저로 열기.
