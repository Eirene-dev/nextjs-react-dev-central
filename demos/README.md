# reactnext-central — 실험 데모 소스

이 폴더(`demos/`)는 [reactnext-central.xyz](https://reactnext-central.xyz) 쇼케이스 **'실험'** 틀에 올라가는 데모들의 **원본 소스**입니다.

- 각 폴더는 **프레임워크·빌드 도구·번들러 없는 바닐라 HTML/CSS/JS**로 독립 동작합니다. 그 자체가 메시지입니다.
- **로컬 실행**: 해당 폴더의 `index.html`을 브라우저로 열면 끝(서버 불필요). 일부 데모(folio)는 페이지 간 이동이 있어 `python3 -m http.server` 등 정적 서버로 여는 것을 권장합니다.
- **배포물**: `yarn demo:sync`가 `demos/{slug}/` → `public/showcases/{slug}/`로 복사합니다. **`demos/`가 source of truth**, `public/showcases/`는 생성물입니다(둘 다 깃에 커밋).
- 데모는 최신 Chromium 계열 브라우저 기준이며, 미지원 브라우저에는 `@supports` 안내 배너 + graceful 폴백을 둡니다.

## 데모 목록
| slug | 주제 | 핵심 웹 플랫폼 기술 |
|---|---|---|
| `drift` | 스크롤 내러티브 | CSS Scroll-driven Animations (`animation-timeline: scroll()/view()`) |
| `slate` | JS 없는 UI 레이어 | Popover API + CSS Anchor Positioning + `@starting-style` |
| `folio` | 갤러리 페이지 전환 | Cross-document View Transitions (`@view-transition`) |

## 라이선스
데모 소스는 학습·참고용으로 공개합니다(MIT). 가상 브랜드(Drift/Slate/Folio)와 콘텐츠는 예시입니다.
