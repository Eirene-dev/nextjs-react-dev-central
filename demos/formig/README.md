# Formig — 한 줄로 채우는 폼 (AI×웹)

자연어 한 줄을 AI가 구조화해 **예약 폼 필드를 차례로 채우는** 가상 데모.

## 아키텍처
- Vite + React. 문장 → Gemini **structured output**(`responseMimeType: application/json` + `responseSchema`)로 필드 추출 → 폼 필드를 **순차 애니메이션으로 채움**(한 번에 다 차지 않음 → "자연어가 폼을 채운다"가 보임).
- ★ **추출 투명성(값 + 근거)**: 스키마가 `extractions:[{field, value, source_text}]` — 각 필드를 채운 **원문 구절(source_text)** 을 함께 받아, 입력 문장 위에 그 구절을 **필드별 색으로 하이라이트**하고 필드 옆에 `← '구절'` 배지로 잇는다. 순차 채움과 동기(필드가 차는 순간 그 근거가 문장에서 켜짐).
- ★ **환각 근거 방지**: 반환된 `source_text`가 실제 입력 문장의 substring인지 검증(`validateExtractions`) → 아니면 근거는 버리고 값만 채움.
- 샘플/실키 모두 동일 경로: `validateExtractions`(substring 검증) → `streamFill`의 `onField(field, value, source)`.

## BYOA
- 키는 방문자 것 — `localStorage`에만, 서버 전송 0, 브라우저 → Google 직접. 정적 파일이라 사이트와 분리.
- **왜 Gemini만?** 브라우저 CORS 허용(OpenAI는 불가). 모델 `gemini-3.1-flash-lite`(데모 하드코딩).

## 샘플 모드(기본)
키 없이 예시 문장 3종(금요일 저녁/내일 점심/토요일 저녁)으로 핵심 체험. 녹화된 `{field,value,source_text}`를 동일 경로(검증→순차)로 재생 — 문장 하이라이트·근거 배지 동일. (첫 문장의 알레르기는 source_text가 원문 substring이 아니라 근거가 버려지고 값만 채워지는 검증 시연.)

## 로컬 실행
`npm install` → `npm run dev` / `npm run build`. 루트 `yarn demo:sync`로 배포.
