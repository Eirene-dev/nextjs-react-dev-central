# Sema — 의미로 찾는 검색 (AI×웹)

키워드가 안 겹쳐도 **의미가 같으면 찾는다**. 헬프센터 항목을 **Gemini 임베딩**으로 벡터화하고, 질의도 임베딩해 **브라우저에서 코사인 유사도**로 정렬한다. ⌘K 팔레트.

## 아키텍처
- Vite + React. 문서 임베딩은 **사전계산**(`scripts/embed.mjs` → `src/embeddings.json`). 런타임은 **질의만** `embedContent`로 임베딩 → 미리 저장한 문서 벡터들과 코사인 유사도 → 상위 결과.
- 샘플/실키가 **같은 `onResults` 경로**를 탄다.

## 왜 의미 검색인가
- “돈 돌려받고 싶어요” → **“환불 정책”**, “비번 까먹었어요” → **“비밀번호 재설정”**. 단어가 하나도 안 겹쳐도 의미로 매칭된다.
- 샘플 질의는 일부러 **키워드 불일치·의미 일치** 예시 위주로 구성.

## ★ 임베딩 모델 일관성 (필수)
- **사전계산(`embed.mjs`)과 런타임 질의 임베딩은 반드시 동일 모델**이어야 한다 — 둘 다 `gemini-embedding-001` 고정.
- 모델이 다르면 벡터 공간이 달라 유사도가 무의미해진다.
- `embeddings.json`에 사용 모델명을 기록한다(`{ model, dims, count, vectors }`).

## BYOA (Bring Your Own API key)
- 키는 **방문자 것**. `localStorage`(브라우저 전용)에만 저장되고 **어떤 서버로도 전송되지 않음**. 호출은 브라우저 → Google 직접.
- `embedContent`는 브라우저 CORS 허용을 확인함(POST/OPTIONS preflight 통과).
- **왜 Gemini만?** `generativelanguage.googleapis.com`은 API-key 브라우저 CORS를 허용. OpenAI(`api.openai.com`)는 브라우저 CORS 미허용 → 정적 데모에서 호출 불가 → 미사용.
- 질의 임베딩 모델: `gemini-embedding-001`(데모 하드코딩).

## 샘플 모드(기본)
키 없이 프리셋 질의 4종으로 핵심 100% 체험. **샘플은 벡터 없이도 동작** — 녹화된 질의→매칭을 동일 경로로 재생. (‘내 키로 실행’ 모드만 `embeddings.json`의 문서 벡터가 필요.)

## 로컬 실행
1. `npm install`
2. **문서 임베딩 사전계산**(‘내 키로 실행’ 모드에 필요, Gemini 키 필요):
   ```
   GEMINI_API_KEY=... node scripts/embed.mjs
   ```
   → `src/embeddings.json`의 `vectors`를 채운다. (키는 **환경변수로만**, 하드코딩 0)
3. `npm run dev`(개발) / `npm run build`(배포물 = `dist/`). 루트에서 `yarn demo:sync`가 빌드 후 `public/showcases/sema/`로 복사.

> 샘플 모드만 쓸 경우 2단계는 생략 가능 — 녹화 매칭으로 완결 동작한다.
