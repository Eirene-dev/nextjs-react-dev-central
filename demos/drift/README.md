# Drift — 원두의 여정

가상 커피 브랜드의 스크롤 내러티브 한 페이지.

## 무엇을 보여주나
스크롤만으로 진행되는 6단계 스토리텔링(씨앗→수확→발효·건조→로스팅→그라인딩→한 잔) — 상단 진행 바, 텍스트 떠오름(rise), 이미지 시차(parallax), **단계별 SVG 커피 일러스트**, **스크롤 스크럽 숫자 카운터**, **여정에 따라 흐르는 색**, **단어별 리빌 인터루드**, **가로 스크롤 테이스팅 노트 스트립**. **전부 CSS/SVG, JavaScript 0줄·이미지 자산 0.**

## 핵심 기술
- **CSS Scroll-driven Animations**: 진행 바 = `animation-timeline: scroll(root block)`, 섹션 reveal·시차·일러스트·카운터·단어 리빌 = `animation-timeline: view()` + `animation-range`.
- **단계별 SVG 일러스트(이미지 0)**: ① 씨앗(체리+안개) ② 수확(핸드픽 리빌) ③ 발효·건조(아프리칸 베드 리빌) ④ 로스팅(온도-시간 곡선을 `stroke-dashoffset` scrub으로 그림 + 1차 크랙) ⑤ 그라인딩(그라인더 + 떨어지는 가루) ⑥ 한 잔(V60 드리퍼 + 물방울·스팀).
- **스크럽 카운터(`@property <integer>`, JS 0)**: `@property`로 등록한 정수 변수를 `view()`로 0→값 스크럽 + `counter-reset`/`content: counter()`로 렌더 — 해발고도 1600m·자연건조 18일·로스팅 210°C·추출 92°C.
- **색상 전환(`@property <color>`, JS 0)**: `scroll(root block)`로 `--flow`(하이랜드 그린→로스팅 브라운→테라코타)를 스크럽, 섹션 번호·스펙 숫자 색이 여정 따라 흐름.
- **단어별 리빌**: 인터루드 문장을 단어 `<span>`마다 다른 `animation-range`로 순차 등장(다크 밴드 = 명암 리듬).
- **가로 스크롤 스트립(`sticky` + `view-timeline`, JS 0)**: 테이스팅 노트 카드(베리·다크초콜릿·시트러스·캐러멜·꽃향·견과, SVG 아이콘)가 세로 스크롤에 맞춰 가로로 흐름 — `sticky` 핀 + 트랙 `translateX`를 섹션 `view-timeline`으로 스크럽, `overflow: hidden`으로 페이지 가로 오버플로 0. 미지원/`reduced-motion` 시 네이티브 가로 스크롤(스와이프)로 정적 노출.
- **`prefers-reduced-motion`**: 모든 모션(진행바·리빌·시차·일러스트·드립·스팀·안개·카운터·색 전환·단어·bob) 정지 — 카운터는 최종값, 색은 정적, 내용은 그대로 노출.
- 스크립트 없음(진짜 0줄). 미지원 브라우저는 `@supports (animation-timeline)`로 감지해 안내 배너 표시 + 내용·일러스트는 정적으로 노출(로스팅 곡선은 그려진 상태, 카운터는 최종 숫자, 색은 고정).

## 브라우저 요구
- Chrome/Edge 115+ 등 Scroll-driven Animations 지원 브라우저. 미지원 시 효과만 생략(콘텐츠·읽기 정상).

## 로컬 실행
`index.html`을 브라우저로 열기.
