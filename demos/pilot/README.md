# Pilot — 말로 움직이는 웹 (AI×웹)

자연어 명령을 **Gemini function calling**으로 받아 실제 DOM/상태를 바꾸는 가상 데모.

## 아키텍처
- Vite + React. **scene 레지스트리**(`src/scenes/`) — 각 패널이 `{ tools, initialState, render, onToolCall }`를 들고 있다. 현재 패널: **상품 카탈로그 · 대시보드 · 가입 폼 · 스타일 스튜디오 · 모션 스튜디오 · 문서 편집기**(6패널, `SCENES`에 등록하면 `ALL_TOOLS`/`TOOL_OWNER`/픽스처 union에 자동 편입).
- ★ **한 캔버스**: 탭 없음. 모든 패널을 **한 화면에 동시 렌더**(데스크톱 2열·모바일 1열). 위 단일 명령창이 전체를 조종한다.
- ★ **전역 함수 라우팅**: Gemini tools = 전역 `set_theme` + 모든 패널 도구의 **union**(`ALL_TOOLS`). 도구 이름은 **전역 유일**(`catalog_*`/`dash_*` 접두사). 응답의 `functionCall`을 `TOOL_OWNER[name]`로 소유 패널에 라우팅 → 그 패널 슬라이스만 갱신. 미지의 이름은 무시(graceful).
- ★ **다중 함수 호출**: 한 응답의 `functionCall`을 **전부 배열로** 받아(`gemini.js`) **순차 적용**(`App.jsx`의 `for (const c of calls)`). 한 문장이 **여러 패널 + 테마**에 걸친다(히어로 칩: theme + catalog_sort_by + dash_highlight_quarter).
- **변화 피드백**: 바뀐 패널을 강조 플래시 + 화면 밖이면 scroll-into-view. 실행 로그 유지.
- `set_theme`은 **전역**(앱 `.app.light/.dark`), 그 외 도구는 소유 패널에 위임.
- 샘플/실키가 **같은 `onToolCall` 경로**. 픽스처는 `{label, calls:[{name,args}]}` **union**(활성 scene 개념 없음 — 도구 이름이 곧 대상 패널).

## BYOA (Bring Your Own API key)
- 키는 **방문자 것**. `localStorage`(브라우저 전용)에만 저장되고 **어떤 서버로도 전송되지 않음**. 호출은 브라우저 → Google 직접.
- 데모는 정적 파일(`public/showcases/pilot/`)이라 사이트 서버·API·키와 **완전 분리**.
- **왜 Gemini만?** `generativelanguage.googleapis.com`은 API-key 브라우저 CORS를 허용. OpenAI(`api.openai.com`)는 브라우저 CORS 미허용이라 프록시 서버 없이는 정적 데모에서 호출 불가 → 미사용.
- 모델: `gemini-3.1-flash-lite`(데모 하드코딩, 사이트 `GEMINI_MODEL`과 무관).

## 샘플 모드(기본)
키 없이 장면별 프리셋 명령으로 핵심 100% 체험(다중 도구 명령 포함). 녹화된 `calls` 배열을 동일 경로로 재생.

## 로컬 실행
`npm install` → `npm run dev`(개발) / `npm run build`(배포물 = `dist/`). 루트에서 `yarn demo:sync`가 빌드 후 `public/showcases/pilot/`로 복사.
