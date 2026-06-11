# Relay — 승인받고 움직이는 에이전트 (AI×웹)

목표를 말하면 에이전트가 **Gemini function calling**으로 다음 행동을 제안한다. 단, **각 단계는 사용자가 [실행]을 눌러야** 진행된다(승인 모드 기본). 미니 커머스에서 장바구니·쿠폰·결제 직전까지를 단계로 시연.

## 아키텍처
- Vite + React. 목표 → 멀티턴 function calling 루프. 모델이 `add_to_cart`/`set_qty`/`apply_coupon`/`go_checkout` 중 하나를 `functionCall`로 반환 → 실행 후 `functionResponse`를 `contents`에 누적 → 다음 단계 요청.
- 각 단계는 **카드**로 제시되고 타임라인에 쌓인다. 샘플/실키가 **같은 `onStep`/실행 경로**를 탄다.

## 안전 가드 (★ 핵심)
- **승인 모드 기본**: 사용자가 [실행]을 누르기 전엔 절대 자동 진행하지 않는다. (자동 모드는 명시 토글; 토글 시에도 단계 사이 지연을 두고 진행)
- **최대 6스텝** 가드 — 초과 시 중단.
- **무한루프 방지**: 직전과 **동일한 functionCall**(이름+인자)이 반복되면 중단.
- **결제는 ‘직전까지’만**: `go_checkout`은 결제 화면 단계로만 전환하며 **실제 결제 액션은 없다**(가상).

## BYOA (Bring Your Own API key)
- 키는 **방문자 것**. `localStorage`(브라우저 전용)에만 저장되고 **어떤 서버로도 전송되지 않음**. 호출은 브라우저 → Google 직접.
- 데모는 정적 파일(`public/showcases/relay/`)이라 사이트 서버·API·키와 **완전 분리**.
- **왜 Gemini만?** `generativelanguage.googleapis.com`은 API-key 브라우저 CORS를 허용. OpenAI(`api.openai.com`)는 브라우저 CORS 미허용 → 정적 데모에서 호출 불가 → 미사용.
- 모델: `gemini-3.1-flash-lite`(데모 하드코딩, 사이트 `GEMINI_MODEL`과 무관).

## 샘플 모드(기본)
키 없이 프리셋 목표 2종으로 핵심 100% 체험 — 단계 승인·타임라인·결제 직전 전환까지. 녹화된 단계 시퀀스를 동일 경로로 재생.

## 로컬 실행
`npm install` → `npm run dev`(개발) / `npm run build`(배포물 = `dist/`). 루트에서 `yarn demo:sync`가 빌드 후 `public/showcases/relay/`로 복사.
