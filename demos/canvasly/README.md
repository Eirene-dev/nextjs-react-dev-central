# Canvasly — UI로 답하는 AI (AI×웹)

AI가 텍스트 벽 대신 **구조화된 JSON**을 내고, 웹이 그것을 **카드·타임라인·체크리스트로 점진 조립**하는 Generative UI 가상 데모.

## 아키텍처
- Vite + React. 요청 → Gemini **structured output**(`responseMimeType: application/json` + `responseSchema`) → 여행 계획 JSON.
- 받은 계획을 **섹션 단위로 점진 렌더**(title → 요약 → day들 → 체크리스트)해 "스트리밍처럼 컴포넌트가 쌓이는" 시각을 만든다. 샘플/실키 모두 동일한 `onSection` 경로.
- 정직 노트: 점진 조립은 응답 수신 후 섹션을 순차 노출하는 방식(토큰 단위 SSE 스트리밍은 향후). UX 목표(컴포넌트가 쌓이는 화면)는 그대로 달성.

## BYOA
- 키는 방문자 것 — `localStorage`에만, 서버 전송 0, 브라우저 → Google 직접. 정적 파일이라 사이트와 분리.
- **왜 Gemini만?** 브라우저 CORS 허용(OpenAI는 불가). 모델 `gemini-3.1-flash-lite`(데모 하드코딩).

## 샘플 모드(기본)
키 없이 완성 여행 계획 2종(부산 2박3일·제주 당일)으로 핵심 체험. 녹화 계획을 동일 경로로 점진 재생.

## 로컬 실행
`npm install` → `npm run dev` / `npm run build`. 루트 `yarn demo:sync`로 배포.
