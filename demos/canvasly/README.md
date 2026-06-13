# Canvasly — UI로 답하는 AI (AI×웹)

AI가 텍스트 벽 대신 **질문에 맞는 UI 컴포넌트를 골라** 구조화된 JSON으로 내고, 웹이 그것을 레지스트리로 **점진 조립**하는 Generative UI 가상 데모.

## 아키텍처
- Vite + React. 요청 → Gemini **structured output**(`responseMimeType: application/json` + `responseSchema`) → ★ **제네릭 `components:[{type, …props}]` 배열**. AI가 질문에 맞는 컴포넌트를 **골라** 순서대로 구성(고정 스키마 아님).
- ★ **컴포넌트 레지스트리**(`src/components.jsx`): `COMPONENTS = { type → { normalize(raw), render(props) } }`. 현재 10종 — **card · timeline · checklist · table · stat · compare · step · spec · callout · gauge**. 타입 추가 = 레지스트리 한 항목 + `gemini.js` `COMPONENT_TYPES` 한 줄(App은 lookup만, if-분기 없음).
- ★ **타입별 검증/정규화**(`validateComponents`): 미지 타입·형식 불량 컴포넌트는 버린다(레지스트리 기준). props가 타입마다 달라 스키마는 타입별 필드를 서로 다른 이름으로 둔 느슨한 객체 + 앱 검증.
- 받은 배열을 **컴포넌트 단위로 점진 렌더**(`streamComponents` 480ms). 샘플/실키 모두 동일한 `validateComponents → onSection` 경로.
- 정직 노트: 점진 조립은 응답 수신 후 순차 노출(토큰 단위 SSE는 향후).

## BYOA
- 키는 방문자 것 — `localStorage`에만, 서버 전송 0, 브라우저 → Google 직접. 정적 파일이라 사이트와 분리.
- **왜 Gemini만?** 브라우저 CORS 허용(OpenAI는 불가). 모델 `gemini-3.1-flash-lite`(데모 하드코딩).

## 샘플 모드(기본)
키 없이 질문 3종으로 generativity 체험 — **서로 다른 질문이 서로 다른 컴포넌트 세트**를 낸다: 여행 계획→[card·timeline·checklist], 분기 지표→[stat·table], 사양 비교→[table·card]. 녹화 components 배열을 동일 경로(검증→순차)로 재생. (지표 샘플엔 미지 타입 1개를 넣어 검증이 버리는 것도 시연.)

## 로컬 실행
`npm install` → `npm run dev` / `npm run build`. 루트 `yarn demo:sync`로 배포.
