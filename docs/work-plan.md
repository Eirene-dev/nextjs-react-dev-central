# work-plan.md — reactnext-central.xyz 개편 작업 명세

> Claude Code 핸드오프 문서. 이 문서 하나로 작업 단위·우선순위·수용 기준·의존 관계를 파악할 수 있도록 작성. 결정 근거는 `design-decisions.md` 참조.

---

## 0. 한 줄 요약

튜토리얼 블로그를 **"만들고 판단한 것을 기록하는 사이트"**로 개편한다. 무게중심은 **Essays + Showcases**(Book·튜토리얼은 후순위). 홈 틀은 후보 **05**(AI 프로덕트/SaaS, 인터랙티브 데모 위젯)로 확정 — `homepage-05-final.html` 참조. 도메인·기존 콘텐츠 URL은 유지하고, 새 컨셉은 로고 기반 디자인 시스템으로 새로 만든다.

---

## 1. 현재 상태 (출발점)

- **스택**: Next 13.4 (App Router, `experimental.appDir`), Contentlayer 0.3.4(**유지보수 중단**), Tailwind 3.3 + shadcn/ui, Yarn 3 + `package-lock.json` 혼재, Vercel.
- **콘텐츠**(전부 `data/` 하위 MDX): Blog 71 + Docs 187(= `/archive` 대상), Levelup 4(Next.js 책 `/levelup/book`), Authors 2.
- **참조 산출물**: `homepage-05-final.html`(확정 홈 틀), 후보 01~04(대안 레인, 비채택).

---

## 2. 결정 요약 (상세 근거는 design-decisions.md)

| # | 영역 | 결정 |
|---|------|------|
| 1 | 전략 | 책 중심 → **Essays + Showcases 중심**. Book/judgment-dev는 후순위 |
| 2 | URL | 기존 `/blog/*`·`/docs/*` **URL 유지(301 없음)**. `/archive`는 라벨링 인덱스 + 개별 글 배너 |
| 3 | 내비 | `Book / Essays / Showcases / Archive / About`. blog/docs는 내비에서 제외, Archive로만 접근 |
| 4 | 홈 | 레거시 블로그 피드 제거, **완전 새로**(05 기반). 상세 콘텐츠 구성은 **보류**(추가 논의) |
| 5 | Book | `/levelup/book` **URL 유지**(브리프의 `/book/nextjs` 마이그레이션 대체). `/book` 인덱스는 정적 2카드 |
| 6 | judgment-dev | `/book/judgment-dev` = **MDX + 커스텀 컴포넌트** |
| 7 | 디자인 | **로고 기반** 팔레트(slate-navy + coral + cream), Pretendard + 세리프/모노, **동적 SVG**(로고 동심원 모티프) |
| 8 | 레거시 룩 | 기존 디자인은 `/archive`(blog·docs)에 **격리**. 신규 컨셉은 그 외 전 영역 |
| 9 | 저자명 | **"Pax Code"** 유지 |
| 10 | AdSense | essays/book/about 제거, **`/archive`(레거시)에만 유지** + 3중 중복 정리 |
| 11 | lab 연동 | **보류**. lab.mindvest.ai 준비되면 추가. 현재 모든 동선은 **Showcases로** |
| 12 | 의존성 | **Next 13→16 + Contentlayer 제거 = Phase 0(최우선, 단 마감 전제 확인)** |

---

## 3. 작업 단계 (Phase) — 권장 순서

### ⚠️ 선행 확인 (게이트)
- **(G1) 책 출간 D-7 마감 상태**: 여전히 하드 마감인가? 
  - **열렸다면** → Phase 0(파운데이션 마이그레이션)부터 권장(아래 순서).
  - **하드 마감이라면** → Phase 0를 **출간 후로 연기**하고, 현재 스택 위에서 Phase 1~4를 먼저 진행(원래 "동결" 안). 마이그레이션은 별도 트랙.
- **(G2) 콘텐츠 파이프라인 선택**(Phase 0 진입 전 필수): 아래 Phase 0 참조. **권장: Velite**.

---

### Phase 0 — 파운데이션: Next 16 + Contentlayer 제거 〔최대 규모·최대 리스크〕
> Contentlayer 0.3.4는 폐기되어 Next 16과 공존이 어렵다. Next 업그레이드는 사실상 파이프라인 교체를 동반한다. 새 코드(홈·essays·book)를 모던 스택 위에서 만들어 재작업을 피하기 위해 **먼저** 한다(G1 전제).

**작업**
1. Next 13.4 → 16 업그레이드 (`experimental.appDir` 제거, async request API/캐싱 기본값 변경 반영). `next-devtools-mcp`로 업그레이드 자동화 활용 가능.
2. Contentlayer 제거 → **새 콘텐츠 파이프라인**으로 교체. 후보:
   - **Velite (권장)** — Contentlayer 계열, Zod 스키마, 타입 생성, `data/` 컬렉션 모델이 유사해 마이그레이션이 가장 기계적.
   - next-mdx-remote / `@next/mdx` — Vercel 백업, 제어 큼, 셋업 많음.
   - contentlayer2 — 드롭인 포크(최소 변경)이나 Contentlayer 계열이라 "완전 제거" 의도와 불일치 → 비권장.
3. 기존 MDX 컬렉션 마이그레이션: Blog(71) + Docs(187) + Levelup(book) + Authors → 새 파이프라인. (archive는 동결 콘텐츠라 1회 마이그레이션으로 충분)
4. Yarn 3 표준화 + `package-lock.json` 제거. pliny/mdx-js 등 동반 의존성 정리.

**수용 기준**
- 기존 모든 URL이 **이전과 동일하게 해석**된다(`/blog/*`, `/docs/*`, `/levelup/book`).
- archive 글이 정상 렌더된다(MDX·이미지·코드 하이라이트 포함).
- `next build` 통과, Vercel 배포 정상.
- `middleware.ts`의 **기존 블로그 리다이렉트 35건 보존**(matcher 포함).
- `sitemap.ts`·`feed.xml`·`search.json` 재생성되고 기존 URL을 포함한다.

**리스크/롤백**: 전 사이트·258개 글·빌드·배포에 영향. **별도 PR**, 머지 전 staging 검증, 롤백 브랜치 유지.

---

### Phase 1 — 디자인 시스템 (로고 기반 토큰 + 글로벌 셸)
**의존**: Phase 0(모던 스택 위에서). G1=하드마감이면 현재 스택 위에서 진행.

**작업**
1. 색 토큰: 기존 CSS 변수 방식 유지, 값 교체. **slate-navy(잉크) + coral(액센트) + warm cream(서피스)**, 다크 = 딥 네이비. 시맨틱 토큰(`--ink/--accent/--surface/--coral/--line`). **핑크 제거**.
2. 폰트: 본문 **Pretendard**(jsdelivr), 기술 라벨 **JetBrains Mono**, (필요 시 세리프 1종). 기존 Space Grotesk 제거.
3. **동적 SVG 모티프**(로고 동심원) 컴포넌트화 — hero/섹션/카드 재사용. (정밀 일러스트는 출시 후)
4. 글로벌 셸 **새로**: Header(새 내비 + 로고 + 검색/메뉴), Footer, Section/Layout. 골격 구조만 재사용, 시각 전면 교체. 로고 자산은 `Logo_RNC.png` 사용.

**수용 기준**: `homepage-05-final.html`의 색/타이포/모티프/셸과 시각적으로 일치. 라이트/다크 토글 동작. 모바일(380px) 가독성(본문 16–18px, 줄간 1.7–1.8, 읽기 폭 ~680–720px, 탭 타깃 ≥44px).

---

### Phase 2 — 홈 + 섹션 구조 (05 기반)
**의존**: Phase 1.

**작업**
1. **홈**(`app/Main.tsx` 폐기 후 새로): 05 기반. 단 홈의 **최종 콘텐츠 구성은 보류**(G3) — 우선 05 구조(hero + 데모 위젯 + 피처 3 + Showcases 프리뷰 + Essays 프리뷰 + Book 후순위 스트립 + 쇼케이스 유도 배너)로 구현하고, 세부 카피/배치는 추후 확정.
2. **내비 교체**: `headerNavLinks` → `Book / Essays / Showcases / Archive / About`.
3. **`/essays`**: 신규 컬렉션(파이프라인) + 인덱스/상세 레이아웃(에디토리얼 톤). 첫 글 1편(아래 5절).
4. **`/showcases`**: 갤러리 셸 — tailwindcss.com/showcase 형태(프리뷰 카드 그리드 + **카테고리 필터**: 전체/정보형/게시판/커머스/AI 통합/대시보드). 초기엔 빈/소량 상태 OK.
5. **`/archive`**: 기존 `ListLayoutWithTags` 재사용 → `allBlogs`(+선택 `allDocs`) 목록 + **Archive 배너**. 개별 blog/docs 글 레이아웃에 **"아카이브" 배너** 조건부 추가. **URL은 유지**.
6. **`/about`**: 기존 `AuthorLayout` + `authors/default.mdx` **주석 해제**해 노출. "Things I've built" 인벤토리 확장.
7. **`/book` 인덱스**: 정적 2카드(`booksData`). Next.js 책 → `/levelup/book`, judgment-dev → `/book/judgment-dev`. `/levelup/book`에 **"← Book" 브레드크럼**만 추가(리스타일 없음). `/levelup` → `/book` 301(redirect map + matcher 둘 다).
8. **`/book/judgment-dev`**: 스텁(Phase 4에서 채움).

**수용 기준**: 새 내비 동작, 모든 섹션 라우트 200, archive URL 불변·배너 노출, 홈에 레거시 피드 없음, lab 실링크 없음(쇼케이스로 동선).

---

### Phase 3 — Showcases 데모 채우기 〔콘텐츠 우선순위 1〕
**의존**: Phase 2(갤러리 셸).

**작업**
1. 다양한 도메인 standalone 데모 **5~10개**(Claude Code): 정보형 / 게시판 / 커머스 / AI 통합 등.
2. 표시 방식: 각 데모 = **스타일 격리된 내부 라우트**(데모별 디자인이 사이트 토큰과 충돌하지 않도록 route group/스코프 분리) + 갤러리에 **프리뷰 카드 + 카테고리 태그 + "데모 보기"**.
3. 카테고리 필터(클라이언트측) 연결.

**수용 기준**: 갤러리에서 카테고리 필터 동작, 각 데모 라우트 정상·모바일 대응, 데모 스타일이 메인 디자인 시스템을 오염시키지 않음.

---

### Phase 4 — `/book/judgment-dev` 책 페이지
**의존**: Phase 1·2. **입력**: `AI_시대_판단하는_개발자_260506.pdf`(본문·목차·추천사·정오표 추출).

**작업**: MDX + 커스텀 컴포넌트로 슬롯 구성 — 소개, 구매 링크, 추천사, 정오표/체인지로그 블록, 보너스 자료 카드. (lab 도구 링크 슬롯은 자리만, **현재 비활성**.)

**수용 기준**: 출시 품질 시각 + 정오표/보너스가 MDX로 쉽게 편집 가능.

---

### Phase 5 — 마무리 / 청소 / SEO 검증
1. AdSense: essays/book/about/home **제거**, `/archive`에만 유지 + **3중 중복 제거**. CSP/`headers()` 메모 정리.
2. 리다이렉트 최종 점검(`/levelup`→`/book` 등, matcher 동기화), 기존 35건 보존 확인.
3. `sitemap`/`feed`/`search.json` 재검증, 깨진 내부 링크(절대경로 `/levelup`·`/blog`, `config/docs.ts`) 점검.
4. 라이트하우스/모바일 검수.

---

## 4. 의존 관계 / 병렬 구간

```
Phase 0 (파운데이션) ──▶ Phase 1 (디자인 시스템) ──▶ Phase 2 (홈+섹션 구조)
                                                        │
                                          ┌─────────────┼─────────────┐
                                          ▼             ▼             ▼
                                   Phase 3(데모)   Phase 4(book)   Phase 5(청소)*
```
- **직렬**: 0 → 1 → 2.
- **병렬 가능**: Phase 2 이후 3·4는 병렬. *Phase 5의 일부(AdSense/CSP/Yarn 정리)는 Phase 0~2와 병행 가능.
- G1=하드마감 시: Phase 0를 맨 뒤(출시 후)로 빼고 1→2→3→4를 현재 스택에서 진행.

## 5. 작업 단위(PR/세션) 권장

| 세션 | 범위 | 산출물 |
|------|------|--------|
| S0 | Phase 0 전체 | Next16+파이프라인 PR(별도, 신중) |
| S1 | Phase 1 | 디자인 토큰 + 글로벌 셸 PR |
| S2 | Phase 2a | 홈(05) + 내비 |
| S3 | Phase 2b | essays/showcases 셸/archive/about/book 인덱스 + 리다이렉트 |
| S4 | Phase 3 | 데모 (2~3개씩 분할 PR) |
| S5 | Phase 4 | judgment-dev |
| S6 | Phase 5 | 청소/SEO |

## 6. 일정 (열린 타임라인 가정)

마감이 열렸다는 가정 하에 **상대 규모**로 분할(절대 일자 아님): Phase 0(大, 단독) → Phase 1(中) → Phase 2(大) → Phase 3(中, 분할) → Phase 4(中) → Phase 5(小). **G1 확정 후** 일정을 절대화할 것.

## 7. 오픈 이슈 (결정 보류)

1. **(G1) 책 출간 D-7 마감 상태** — Phase 0 선후를 가른다(최우선 확인).
2. **(G2) 콘텐츠 파이프라인** — Velite(권장) vs next-mdx-remote.
3. **C1** `data/archive/` 고아 12편 — 제목 추출 후 편입/폐기.
4. **C2/C3** docs/blog 트래픽·언어 구성 — archive 범위(docs 포함 여부) 미세조정.
5. **홈 최종 콘텐츠 구성**(2-3) — 별도 논의.
6. **tiptap + DB CMS** — 출간 후 별도 트랙(정적 MDX/Velite vs DB+tiptap 갈림길).