# Folio — 갤러리 페이지 전환

정적 HTML 페이지 사이를 이동할 때 카드 이미지가 다음 페이지의 히어로로 모핑.

## 무엇을 보여주나
목록(`index.html`) → 상세(`work-a~f.html`) 이동에서, 공유된 이미지가 끊김 없이 이어지는 **교차 문서 페이지 전환**. 작품 6종. JavaScript 0줄·이미지 0(전부 CSS 그라디언트).

## 핵심 기술
- **Cross-document View Transitions**: `@view-transition { navigation: auto; }` + 공유 요소에 같은 `view-transition-name` → 브라우저가 두 문서 사이 모핑을 자동 수행.
- **다중 요소 모핑**: 작품당 3개 공유 요소가 함께 이어짐 — 이미지 카드(`.art-*`)↔히어로(`.hero.h-*`), 제목 h2(`.t-*`)↔h1, 메타(`.m-*`)↔kicker. 작품별 고유 이름(`art-/title-/meta-` × a~f)이라 **index 6카드 동시 존재해도 이름 충돌 0**.
- **`::view-transition` 커스텀 애니**: `::view-transition-group(*)`에 부드러운 ease-out(`.5s`), 제목 그룹엔 미세 떠오름 — 기본 크로스페이드보다 의도적인 전환.
- **`prefers-reduced-motion` 가드**: `@media (prefers-reduced-motion: reduce)`에서 `::view-transition-*` 애니를 정지(모션 제거). 공유 CSS라 양쪽 문서에 적용.
- **공유 스타일시트(`folio.css`)**: 모든 페이지가 `<link rel="stylesheet" href="folio.css">`로 한 파일을 참조(중복 인라인 제거). `@view-transition`이 공유 CSS에 있어 **양쪽 문서에 동시 존재** → 교차 문서 전환 성립. 작품별 차이는 body class(`.acc-*` accent)와 클래스(`.g-*` 그라디언트·`.art-*`/`.h-*` 이름)로만.
- **갤러리 필터(`:checked`, JS 0)**: 라디오 + 형제 선택자로 분류(전체·브랜드·에디토리얼·그래픽)별 카드 표시. 기본 전체 표시 → 미지원/CSS 실패 시에도 전체 노출(안전 폴백).
- **케이스스터디 상세**: 각 work에 메타 그리드(역할·분야·연도·구성) + 섹션 3개(개요·접근·결과) + 그라디언트 색면 + 풀쿼트. 레이아웃은 `folio.css` 공유 클래스(`.facts`/`.cs`/`.band`/`.pull`)로 6페이지 일관.
- 폴더 내 상대 링크로 페이지 이동. 작품 추가 = `work-*.html` + 카드 1장(폴더-복사 sync가 자동 포함).

## 브라우저 요구
- 교차 문서 View Transition 지원(Chrome/Edge 126+). **미지원 시 일반 링크로 graceful 폴백** — 이동은 정상, 전환 모핑만 생략. `@supports`로 배너 안내.

## 로컬 실행
페이지 간 이동이 있어 정적 서버 권장: `python3 -m http.server` 후 `http://localhost:8000/` 접속. (단일 `index.html` 더블클릭도 동작하나 일부 브라우저는 file:// 에서 전환 제한.)
