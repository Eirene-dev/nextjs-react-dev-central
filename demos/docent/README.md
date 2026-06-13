# Docent — 근거를 보여주는 Q&A (AI×웹)

가상 제품 문서에 질문하면 **Gemini structured output**으로 답하되, 답의 각 근거를 **본문의 정확한 구절(span)**에 연결한다. 인용을 누르면 그 구절로 점프·강조. 문서에 없으면 솔직하게 “없습니다”라고 말한다(grounding).

## 아키텍처
- Vite + React. ★ **코퍼스 레지스트리**(`src/corpora.js`): `CORPORA=[{id, label, doc:[{id,text}], samples}]`. 현재 3종 — **제품(Nimbus 7) · 환불·교환 정책 · 서비스 FAQ**, 상단 탭으로 전환. `doc`이 단일 소스 — askGrounded 프롬프트 본문 · `validateCitations` 검증 기준 · 문서 패널 렌더 모두 활성 코퍼스에서. 코퍼스 추가 = 배열에 객체 하나.
- 문서는 문단마다 id를 가진다. 질문 → `responseSchema`로 `{found, answer, citations:[{source_quote, source_id}]}` JSON 강제.
- ★ **span-level 인용**: 각 인용은 문단 통째가 아니라 **본문 속 정확한 구절(`source_quote`, verbatim)** + 문단 id. UI는 그 구절만 하이라이트하고, 답 아래 번호 칩 `[1] p2 · “…”`을 인용 구절과 **색으로 연결**. 칩 클릭 → 해당 구절로 스크롤·강조.
- 샘플/실키가 **같은 `onAnswer` 경로**(→ `validateCitations`)를 탄다.
- **테마**: midnight terminal 다크 기본 + 라이트 토글(우상단). teal 액센트 유지·다크 채도↑. span 하이라이트(밝은 pill+짙은 글씨), 번호 인용 칩, 답 상태(teal/coral)는 다크/라이트 모두 가독.

## 왜 grounding이 핵심인가
- 모델 답을 그대로 믿지 않고 **본문 구절을 정확히 가리킨다**. 근거가 없으면 `found:false` → “이 문서에는 해당 내용이 없습니다.”
- **★ 환각 인용 방지(span 단위)**: 각 `source_quote`가 해당 `source_id` 문단의 **verbatim substring인지 검증** → 아니면 그 인용을 버린다(formig 소스 검증과 동형). 유효 인용 0이면 `found:false`로 강등.
- 실키에서도 시스템 프롬프트가 “본문 근거로만 답하고, 구절은 verbatim, 없으면 지어내지 말 것”을 강제.

## BYOA (Bring Your Own API key)
- 키는 **방문자 것**. `localStorage`(브라우저 전용)에만 저장되고 **어떤 서버로도 전송되지 않음**. 호출은 브라우저 → Google 직접.
- 데모는 정적 파일(`public/showcases/docent/`)이라 사이트 서버·API·키와 **완전 분리**.
- **왜 Gemini만?** `generativelanguage.googleapis.com`은 API-key 브라우저 CORS를 허용. OpenAI(`api.openai.com`)는 브라우저 CORS 미허용 → 정적 데모에서 호출 불가 → 미사용.
- 모델: `gemini-3.1-flash-lite`(데모 하드코딩, 사이트 `GEMINI_MODEL`과 무관).

## 샘플 모드(기본)
키 없이 코퍼스별 프리셋 질문으로 핵심 체험 — 각 코퍼스 **있는 질문 3 + 없는 질문 1**로 span 인용·`found:false`까지 시연. 녹화된 답을 동일 경로(→ `validateCitations`)로 재생. span 인용·검증·"없습니다"가 세 코퍼스 모두 동작.

## 로컬 실행
`npm install` → `npm run dev`(개발) / `npm run build`(배포물 = `dist/`). 루트에서 `yarn demo:sync`가 빌드 후 `public/showcases/docent/`로 복사.
