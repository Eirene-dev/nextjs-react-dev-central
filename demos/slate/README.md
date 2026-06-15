# Slate — JS 없는 UI 레이어

툴팁·드롭다운·중첩 메뉴·컨텍스트 메뉴·다이얼로그를 자바스크립트 없이.

## 무엇을 보여주나
인터랙티브 UI 9종(툴팁·드롭다운·중첩·컨텍스트·다이얼로그·아코디언·탭·토글/세그먼트·드로어)을 **브라우저 기본 기능만으로** 구현. 각 카드에 그 컴포넌트의 JS 줄 수를 정직하게 표기(전부 0줄).

## 핵심 기술
- **Popover API**: `popover` 속성 + `popovertarget`/`popovertargetaction`로 토글(JS 0). 다이얼로그·드로어는 popover + `::backdrop`으로 모달처럼.
- **CSS Anchor Positioning**: `anchor-name`/`position-anchor`/`position-area`로 트리거 기준 배치.
- **`position-try-fallbacks`(가장자리 플립)**: 뷰포트 끝에서 공간이 없으면 메뉴가 자동으로 뒤집힘(`flip-inline`/`flip-block`). popover는 top layer라 `position: fixed`로 뷰포트 기준 평가. 미지원 시 고정 위치 폴백.
- **`@starting-style`** + `transition`(`allow-discrete`)로 진입/퇴장 애니메이션(드로어는 `translateX` 슬라이드).
- **`<details>`/`<summary>`** + `interpolate-size: allow-keywords` + `::details-content`로 아코디언 높이 애니(미지원 시 네이티브 즉시 토글).
- **`:checked`** 라디오/체크박스 + 인접 선택자로 탭·토글 스위치·세그먼트 컨트롤.
- 툴팁은 popover도 없이 순수 `:hover`/`:focus` + anchor.

> 정직 노트: '컨텍스트 메뉴'는 버튼 트리거 기준이며, 실제 우클릭 좌표 추적에는 JS가 필요하므로 카드에 그 점을 명시했습니다.

## 브라우저 요구
- Popover API + CSS Anchor Positioning 지원(Chrome/Edge 125+ 권장). 가장자리 플립(`position-try`)·아코디언 높이 애니(`interpolate-size`)는 128~129+에서 동작하며, 미지원 브라우저는 `@supports`로 폴백(고정 위치·네이티브 토글)하고 배너 표시.

## 로컬 실행
`index.html`을 브라우저로 열기.
