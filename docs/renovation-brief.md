# reactnext-central.xyz 사이트 개편 — 배경 문서

이 문서는 사이트 개편 작업의 큰 그림을 정리한 것입니다.
Claude Code 및 후속 Claude Web 대화에서 참조용으로 사용됩니다.

---

## 1. 현재 상황

- **도메인**: reactnext-central.xyz
- **성격**: Next.js + AI 관련 예제 코드와 트렌드를 다루는 기술 블로그
- **기존 책 페이지**: `/levelup/book` (2025년 출간된 Next.js 관련 책 소개)

## 2. 개편의 동기

LLM(Claude, GPT 등)이 코드 생성과 튜토리얼 영역을 빠르게 대체하면서, 기존 "튜토리얼 + 예제 코드" 모델의 효용이 줄고 있습니다.

이번에 출간 예정인 책 *"AI 시대, 판단하는 개발자"* 의 thesis와 정합한 방향으로 사이트를 재정의합니다. 즉, **"튜토리얼 사이트" → "저자의 작업과 판단을 기록하는 곳"** 으로 전환합니다.

**AI 시대에 가치가 떨어진 것**
- "어떻게 만드는가" 류의 튜토리얼
- API 사용법, 신기능 소개
- 표준 패턴 코드 예제 (CRUD, 인증 등)

**AI 시대에 오히려 가치가 올라간 것**
- 판단과 취향 (무엇을, 왜 선택하는가)
- 트레이드오프 분석
- 실패한 경험과 그 이유
- 도메인 간 종합 (AI + 핀테크 + 개발자 커리어)
- 인터랙티브 결과물 (보여줄 수 있는 것)
- 신뢰 가능한 저자의 목소리

## 3. 새 구조

| 경로 | 역할 |
|------|------|
| `/book` | 출간한 책들 (Next.js 책 + judgment-dev) |
| `/essays` | 개인 에세이 (AI의 도움이나 글이 아닌, 저자 본인의 생각) |
| `/showcases` | 웹/AI 관련 인터랙티브 데모, 템플릿, 패턴 |
| `/archive` | 기존 기술 블로그 콘텐츠 보존 (SEO 자산) |
| `/about` 또는 root | 자기 소개 + Things I've built 리스트 |

## 4. 디자인 방향

- 책 본문과 일관된 톤 (네이비 박스 디자인 시스템)
- 미니멀, 콘텐츠 중심
- 모바일 우선 가독성
- 화이트보드 마커 스타일의 손글씨 일러스트로 책과 시각적 연결

## 5. 콘텐츠 출처 / 작업 범위 (1주일 내)

- **`/book` (2권)**: 기존 `/levelup/book`을 `/book/nextjs`로 마이그레이션, 새 책은 `/book/judgment-dev`
- **`/essays` (1-2편)**: 첫 글 후보 — "왜 나는 내 기술 블로그를 다시 생각하게 되었는가"
- **`/showcases` (5-7개)**: lab.mindvest.ai의 기존 도구들(VocaBook, SentenceBook, PromptCraft, ScriptLens, MirrorNote, MindVest Stock)에서 핵심 UI 패턴을 standalone 형태로 추출
- **`/archive`**: 기존 기술 블로그 글 그대로 보존하되 Archive 라벨링으로 분리 표시
- **About**: 자기 소개 + 짧은 프로젝트 인벤토리

## 6. 외부 연결 / 책과의 관계

- 출간 책의 소개 페이지: `reactnext-central.xyz/book/judgment-dev`
- 책 안에서 노출되는 도구 URL: `lab.mindvest.ai/judgment-dev` (단일 URL)
- 두 사이트 양방향 교차 링크 (책 페이지 ↔ 도구 페이지)
- 책 표지·본문 디자인의 톤을 사이트 디자인에 반영

## 7. 비목표 (하지 않을 것)

- ❌ 기존 콘텐츠 삭제 → `/archive`로 보존
- ❌ 도메인 변경 → reactnext-central.xyz 유지
- ❌ 새로운 튜토리얼 추가 → 시대 흐름과 반대
- ❌ `/case-studies` 섹션 신설 → essays에서 자라게 둠
- ❌ 완벽한 리브랜딩 → 기존 자산 최대 활용

## 8. 저자 / 브랜드 컨텍스트

- 저자: 주민호 (Pax)
- 전 Samsung 16년, 현재 MindVest.ai 창업자
- 저서: Next.js 책 (2025년 출간), *AI 시대, 판단하는 개발자* (출간 예정)
- 톤: 직접적 산문, 판단과 경험 중심, 과한 형식 지양

## 9. 후속 단계

1. **(현재 단계)** Claude Code에서 현재 소스 분석 → `current-state.md` 작성
2. 새 Claude Web 대화에서 `renovation-brief.md` + `current-state.md`를 컨텍스트로 구체 작업 계획 수립
3. Claude Code에서 실제 마이그레이션 / 신규 페이지 작성
4. 책 출간일 기준 D-7까지 작업 완료, D-3까지 검수 마무리