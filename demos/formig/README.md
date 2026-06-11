# Formig — 한 줄로 채우는 폼 (AI×웹)

자연어 한 줄을 AI가 구조화해 **예약 폼 필드를 차례로 채우는** 가상 데모.

## 아키텍처
- Vite + React. 문장 → Gemini **structured output**(`responseMimeType: application/json` + `responseSchema`)로 필드 추출 → 폼 필드를 **순차 애니메이션으로 채움**(한 번에 다 차지 않음 → "자연어가 폼을 채운다"가 보임).
- 샘플/실키 모두 동일한 `onField` 경로(필드 하나씩 set + 하이라이트).

## BYOA
- 키는 방문자 것 — `localStorage`에만, 서버 전송 0, 브라우저 → Google 직접. 정적 파일이라 사이트와 분리.
- **왜 Gemini만?** 브라우저 CORS 허용(OpenAI는 불가). 모델 `gemini-3.1-flash-lite`(데모 하드코딩).

## 샘플 모드(기본)
키 없이 예시 문장 3종(금요일 저녁/내일 점심/토요일 저녁)으로 핵심 체험. 녹화 파싱 결과를 동일 경로로 순차 재생.

## 로컬 실행
`npm install` → `npm run dev` / `npm run build`. 루트 `yarn demo:sync`로 배포.
