# Formig — 한 줄로 채우는 폼 (AI×웹)

자연어 한 줄을 AI가 구조화해 **예약 폼 필드를 차례로 채우는** 가상 데모.

## 아키텍처
- Vite + React. 문장 → Gemini **structured output**(`responseMimeType: application/json` + `responseSchema`)로 필드 추출 → 폼 필드를 **순차 애니메이션으로 채움**(한 번에 다 차지 않음 → "자연어가 폼을 채운다"가 보임).
- ★ **도메인 레지스트리**(`src/domains.js`): `DOMAINS=[{id,label,fields,systemPrompt,samples}]`. 현재 **식당 예약 · 배송 주문 · 채용 지원** 3종, 상단 탭으로 전환. `fields[]`가 **단일 소스** — 폼 렌더 · gemini 프롬프트/스키마(`field` enum) · `validateExtractions` 허용 키 · `streamFill` 순서를 모두 fields에서 파생(3곳 중복 제거). 도메인 추가 = 배열에 객체 하나.
- ★ **추출 투명성(값 + 근거)**: 스키마가 `extractions:[{field, value, source_text}]` — 각 필드를 채운 **원문 구절(source_text)** 을 함께 받아, 입력 문장 위에 그 구절을 **필드별 색으로 하이라이트**하고 필드 옆에 `← '구절'` 배지로 잇는다. 순차 채움과 동기(필드가 차는 순간 그 근거가 문장에서 켜짐).
- ★ **환각 근거 방지**: 반환된 `source_text`가 실제 입력 문장의 substring인지 검증(`validateExtractions`) → 아니면 근거는 버리고 값만 채움.
- ★ **후속 정정(머지)**: 폼을 초기화하지 않고 **언급된 필드만 갱신**. 실키는 현재 폼을 프롬프트 컨텍스트로 전달("수정/추가만 반영, 나머지 유지"). 정정된 필드만 새 `source_text`로 **재하이라이트** → 무엇이 왜 바뀌었는지 보임. (`새로` 버튼으로 명시적 초기화.)
- **테마**: midnight terminal 다크 기본 + 라이트 토글(우상단). 그린 액센트 유지, 다크에서 채도↑. 근거 하이라이트·배지는 다크/라이트 모두 또렷하게 명도 조정.
- 샘플/실키 모두 동일 경로: `validateExtractions`(substring 검증) → `streamFill`의 `onField(field, value, source)`.

## BYOA
- 키는 방문자 것 — `localStorage`에만, 서버 전송 0, 브라우저 → Google 직접. 정적 파일이라 사이트와 분리.
- **왜 Gemini만?** 브라우저 CORS 허용(OpenAI는 불가). 모델 `gemini-3.1-flash-lite`(데모 하드코딩).

## 샘플 모드(기본)
키 없이 도메인별 예시 문장으로 핵심 체험. 녹화된 `{field,value,source_text}`를 동일 경로(검증→순차)로 재생 — 문장 하이라이트·근거 배지가 세 도메인 모두 동작. (예약 첫 문장의 알레르기는 source_text가 원문 substring이 아니라 근거가 버려지고 값만 채워지는 검증 시연.)

## 로컬 실행
`npm install` → `npm run dev` / `npm run build`. 루트 `yarn demo:sync`로 배포.
