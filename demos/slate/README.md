# Slate — JS 없는 UI 레이어

툴팁·드롭다운·중첩 메뉴·컨텍스트 메뉴·다이얼로그를 자바스크립트 없이.

## 무엇을 보여주나
인터랙티브 오버레이 UI 5종을 **브라우저 기본 기능만으로** 구현. 각 카드에 그 컴포넌트의 JS 줄 수를 정직하게 표기(전부 0줄).

## 핵심 기술
- **Popover API**: `popover` 속성 + `popovertarget`/`popovertargetaction`로 토글(JS 0). 다이얼로그는 popover + `::backdrop`으로 모달처럼.
- **CSS Anchor Positioning**: `anchor-name`/`position-anchor`/`position-area`로 트리거 기준 배치.
- **`@starting-style`** + `transition`(`allow-discrete`)로 진입/퇴장 애니메이션.
- 툴팁은 popover도 없이 순수 `:hover`/`:focus` + anchor.

> 정직 노트: '컨텍스트 메뉴'는 버튼 트리거 기준이며, 실제 우클릭 좌표 추적에는 JS가 필요하므로 카드에 그 점을 명시했습니다.

## 브라우저 요구
- Popover API + CSS Anchor Positioning 지원(Chrome/Edge 125+ 권장). 미지원 시 `@supports`로 배너 표시.

## 로컬 실행
`index.html`을 브라우저로 열기.
