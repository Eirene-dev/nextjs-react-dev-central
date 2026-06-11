# Docent — 근거를 보여주는 Q&A (AI×웹)

가상 제품 문서에 질문하면 **Gemini structured output**으로 답하되, 답의 **근거 문단을 본문에서 하이라이트**한다. 문서에 없으면 솔직하게 “없습니다”라고 말한다(grounding).

## 아키텍처
- Vite + React. 문서는 문단마다 id(`p1`…`p6`)를 가진다. 질문 → `responseSchema`로 `{found, answer, source_ids[]}` JSON 강제 → 핸들러가 `source_ids`를 받아 해당 문단으로 **스크롤 + 하이라이트**.
- 샘플/실키가 **같은 `onAnswer` 경로**를 탄다.

## 왜 grounding이 핵심인가
- 모델 답을 그대로 믿지 않고 **본문 근거를 가리킨다**. 근거가 없으면 `found:false` → “이 문서에는 해당 내용이 없습니다.”
- **환각 id 방지**: 반환된 `source_ids`를 실제 존재하는 문단 id로 **필터링**한 뒤에만 하이라이트(없는 id는 버림).
- 실키에서도 시스템 프롬프트가 “본문 근거로만 답하고, 없으면 지어내지 말 것”을 강제.

## BYOA (Bring Your Own API key)
- 키는 **방문자 것**. `localStorage`(브라우저 전용)에만 저장되고 **어떤 서버로도 전송되지 않음**. 호출은 브라우저 → Google 직접.
- 데모는 정적 파일(`public/showcases/docent/`)이라 사이트 서버·API·키와 **완전 분리**.
- **왜 Gemini만?** `generativelanguage.googleapis.com`은 API-key 브라우저 CORS를 허용. OpenAI(`api.openai.com`)는 브라우저 CORS 미허용 → 정적 데모에서 호출 불가 → 미사용.
- 모델: `gemini-3.1-flash-lite`(데모 하드코딩, 사이트 `GEMINI_MODEL`과 무관).

## 샘플 모드(기본)
키 없이 프리셋 질문 4종으로 핵심 100% 체험 — **있는 질문 3 + 없는 질문 1**(방수등급)로 `found:false`까지 시연. 녹화된 답을 동일 경로로 재생.

## 로컬 실행
`npm install` → `npm run dev`(개발) / `npm run build`(배포물 = `dist/`). 루트에서 `yarn demo:sync`가 빌드 후 `public/showcases/docent/`로 복사.
