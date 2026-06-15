# Folio — 갤러리 페이지 전환

정적 HTML 페이지 사이를 이동할 때 카드 이미지가 다음 페이지의 히어로로 모핑.

## 무엇을 보여주나
목록(`index.html`) → 상세(`work-a~f.html`) 이동에서, 공유된 이미지가 끊김 없이 이어지는 **교차 문서 페이지 전환**. 작품 6종. JavaScript 0줄·이미지 0(전부 CSS 그라디언트).

## 핵심 기술
- **Cross-document View Transitions**: `@view-transition { navigation: auto; }` + 공유 요소에 같은 `view-transition-name`(art-a~f) → 브라우저가 두 문서 사이 모핑을 자동 수행. 카드(`.art-*`) ↔ 상세 히어로(`.hero.h-*`)가 같은 이름으로 매칭.
- **공유 스타일시트(`folio.css`)**: 모든 페이지가 `<link rel="stylesheet" href="folio.css">`로 한 파일을 참조(중복 인라인 제거). `@view-transition`이 공유 CSS에 있어 **양쪽 문서에 동시 존재** → 교차 문서 전환 성립. 작품별 차이는 body class(`.acc-*` accent)와 클래스(`.g-*` 그라디언트·`.art-*`/`.h-*` 이름)로만.
- 폴더 내 상대 링크로 페이지 이동. 작품 추가 = `work-*.html` + 카드 1장(폴더-복사 sync가 자동 포함).

## 브라우저 요구
- 교차 문서 View Transition 지원(Chrome/Edge 126+). **미지원 시 일반 링크로 graceful 폴백** — 이동은 정상, 전환 모핑만 생략. `@supports`로 배너 안내.

## 로컬 실행
페이지 간 이동이 있어 정적 서버 권장: `python3 -m http.server` 후 `http://localhost:8000/` 접속. (단일 `index.html` 더블클릭도 동작하나 일부 브라우저는 file:// 에서 전환 제한.)
