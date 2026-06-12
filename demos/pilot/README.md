# Pilot — 말로 움직이는 웹 (AI×웹)

자연어 명령을 **Gemini function calling**으로 받아 실제 DOM/상태를 바꾸는 가상 데모.

## 아키텍처
- Vite + React. **scene 레지스트리**(`src/scenes/`) — 각 장면이 `{ tools, initialState, render, onToolCall, samples, chips }`를 들고 있고, 탭으로 전환하면 함께 교체된다. 현재 장면: **상품 카탈로그 · 대시보드**.
- 명령 → 활성 장면의 `tools` function calling → 반환 `functionCall`들을 핸들러가 받아 **실제 상태 변경**.
- ★ **다중 함수 호출**: 한 응답의 `functionCall`을 **전부 배열로** 받아(`gemini.js`) **순차 적용**한다(`App.jsx`의 `for (const c of calls)`). 한 명령이 도구 2~3개를 부른다(예: "전자제품만 가격 낮은 순으로, 다크모드" → filter + sort + theme).
- `set_theme`은 **전역**(앱 `.app.light/.dark`), 그 외 도구는 장면에 위임.
- 샘플/실키가 **같은 `onToolCall` 경로**를 탄다(한쪽만 동작하는 일 없음). 샘플 픽스처도 `calls:[]` 배열이라 다중 호출을 동일하게 재생.

## BYOA (Bring Your Own API key)
- 키는 **방문자 것**. `localStorage`(브라우저 전용)에만 저장되고 **어떤 서버로도 전송되지 않음**. 호출은 브라우저 → Google 직접.
- 데모는 정적 파일(`public/showcases/pilot/`)이라 사이트 서버·API·키와 **완전 분리**.
- **왜 Gemini만?** `generativelanguage.googleapis.com`은 API-key 브라우저 CORS를 허용. OpenAI(`api.openai.com`)는 브라우저 CORS 미허용이라 프록시 서버 없이는 정적 데모에서 호출 불가 → 미사용.
- 모델: `gemini-3.1-flash-lite`(데모 하드코딩, 사이트 `GEMINI_MODEL`과 무관).

## 샘플 모드(기본)
키 없이 장면별 프리셋 명령으로 핵심 100% 체험(다중 도구 명령 포함). 녹화된 `calls` 배열을 동일 경로로 재생.

## 로컬 실행
`npm install` → `npm run dev`(개발) / `npm run build`(배포물 = `dist/`). 루트에서 `yarn demo:sync`가 빌드 후 `public/showcases/pilot/`로 복사.
