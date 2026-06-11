# Pilot — 말로 움직이는 웹 (AI×웹)

자연어 명령을 **Gemini function calling**으로 받아 실제 DOM/상태를 바꾸는 가상 데모.

## 아키텍처
- Vite + React. 명령 → `tools`(set_theme/sort_by/filter_category/scroll_to) function calling → 반환 `functionCall`을 핸들러가 받아 **실제 상태 변경**(테마·정렬·필터·스크롤).
- 샘플/실키가 **같은 `onToolCall` 경로**를 탄다(한쪽만 동작하는 일 없음).

## BYOA (Bring Your Own API key)
- 키는 **방문자 것**. `localStorage`(브라우저 전용)에만 저장되고 **어떤 서버로도 전송되지 않음**. 호출은 브라우저 → Google 직접.
- 데모는 정적 파일(`public/showcases/pilot/`)이라 사이트 서버·API·키와 **완전 분리**.
- **왜 Gemini만?** `generativelanguage.googleapis.com`은 API-key 브라우저 CORS를 허용. OpenAI(`api.openai.com`)는 브라우저 CORS 미허용이라 프록시 서버 없이는 정적 데모에서 호출 불가 → 미사용.
- 모델: `gemini-3.1-flash-lite`(데모 하드코딩, 사이트 `GEMINI_MODEL`과 무관).

## 샘플 모드(기본)
키 없이 프리셋 명령 4종으로 핵심 100% 체험. 녹화된 function_call을 동일 경로로 재생.

## 로컬 실행
`npm install` → `npm run dev`(개발) / `npm run build`(배포물 = `dist/`). 루트에서 `yarn demo:sync`가 빌드 후 `public/showcases/pilot/`로 복사.
