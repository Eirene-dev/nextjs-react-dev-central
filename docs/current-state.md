# current-state.md — reactnext-central.xyz 현재 소스 분석

> 사이트 개편(`renovation-brief.md`)의 1단계 산출물. 이 문서 하나로 현재 코드베이스의 구조·자산·제약을 파악할 수 있도록 자기충족적으로 작성됨. 후속 Claude Web 대화의 컨텍스트로 사용.

**한 줄 요약**: Timothy Lin의 `tailwind-nextjs-starter-blog v2` 템플릿을 한국어 기술 블로그로 대폭 커스터마이즈한 프로젝트. **Next.js 13.4 (App Router) + Contentlayer + MDX** 기반이며, 콘텐츠는 전부 `data/` 하위 MDX 파일이다. Vercel 배포.

---

## 1. 기술 스택

| 구분 | 내용 |
|------|------|
| 프레임워크 | **Next.js 13.4.12** (App Router, `experimental.appDir` 플래그 사용 — 구버전 방식) |
| 언어 | TypeScript 5.1, React 18.2 |
| 패키지 매니저 | **Yarn 3.6.1 (Berry, `nodeLinker: node-modules`)**. 단 `package-lock.json`도 함께 존재 → npm 흔적 혼재 |
| 콘텐츠 | **Contentlayer 0.3.4** + MDX (`@mdx-js` 2.x), `pliny` 0.1.7 (스타터 헬퍼 라이브러리) |
| 스타일링 | Tailwind 3.3 + **shadcn/ui (Radix primitives)** + `lucide-react`, `tailwind-merge`, `cva` |
| 차트/다이어그램 | chart.js + react-chartjs-2, mermaid |
| 검색 | **kbar** 로컬 검색 (`public/search.json`을 빌드 시 생성) |
| 댓글/뉴스레터 | giscus / buttondown |
| 분석/광고 | `@vercel/analytics`, `@vercel/speed-insights`, **Google AdSense**(ca-pub-1194474024149121) |
| 빌드/배포 | **Vercel** (git 연동). GitHub Actions 워크플로 없음(이슈 템플릿·FUNDING만). 최근 커밋 `gabia-vercel-setup` |

**개편 관점 코멘트**: Next 13.4 / Contentlayer 0.3.4는 모두 노후화된 핵심 의존성이다. 특히 Contentlayer는 사실상 유지보수 중단 상태라 Next 업그레이드의 최대 장애물. 이번 개편(1주일, 페이지 추가 중심)에서는 **버전 동결 + 기존 MDX 파이프라인 재사용**이 현실적이고, 대규모 업그레이드는 별도 과제로 분리 권장.

---

## 2. 디렉터리 구조 (핵심)

```
app/                  # App Router 라우트 (페이지·API·SEO 파일)
components/           # 공유 UI (Header, Footer, Card, MDXComponents, callout 등)
  ui/                 # shadcn/ui 원자 컴포넌트 (button, card, tabs ...)
layouts/             # 콘텐츠 레이아웃 (PostSimple/PostLayout/PostBanner/List.../AuthorLayout)
data/                 # ★ 모든 콘텐츠(MDX)와 사이트 데이터의 단일 소스
  blog/ docs/ example/ levelup/ archive/   # MDX 콘텐츠 (아래 4절)
  authors/            # 저자 프로필 MDX (default.mdx → /about)
  siteMetadata.js     # 사이트 전역 설정(제목·URL·analytics·search·comments)
  headerNavLinks.ts   # 상단 내비게이션 정의
  projectsData.ts     # /example 페이지 카드 데이터
  illustration/       # SVG 일러스트
config/               # docs.ts(사이드바 트리, 31KB), site.ts
lib/                  # utils, toc 헬퍼
css/ styles/          # tailwind.css(shadcn 토큰), prism, mdx, editor
public/static/        # 이미지·파비콘 (images/levelup/cover_*.png = 책 표지)
contentlayer.config.ts  # 문서 타입 정의(아래 4절)
middleware.ts         # URL 리다이렉트 테이블
```

**개편 관점 코멘트**: `data/`가 콘텐츠의 단일 소스라는 점이 개편에 유리하다. 새 섹션(`/book`, `/essays`, `/showcases`)은 대부분 "`data/`에 새 폴더 + `contentlayer.config.ts`에 문서 타입 + `app/`에 라우트" 3단계로 추가 가능.

---

## 3. 라우팅 / 페이지 (전부 App Router, `pages/` 없음)

| 라우트 | 역할 |
|--------|------|
| `/` | 홈. `app/Main.tsx`가 최신 블로그 글 목록 렌더 |
| `/blog`, `/blog/page/[page]` | 블로그 목록(`ListLayoutWithTags`) + 페이지네이션 |
| `/blog/[...slug]` | 블로그 글 상세 |
| `/tags`, `/tags/[tag]` | 태그 인덱스/필터 |
| `/docs/[[...slug]]` (+`layout.tsx`) | 문서. `config/docs.ts`의 사이드바 트리 사용 (콘텐츠 최대) |
| `/example`, `/example/[...slug]` | 예제 프로젝트 (카드는 `projectsData.ts`) |
| `/levelup/[...slug]` | **책 소개 영역** (정적 `/levelup` 없음 — 4절) |
| `/about` | `authors/default.mdx` → `AuthorLayout`. **단 내비에서 주석 처리되어 숨김** |
| `/api/analytics`, `/api/newsletter` | web-vitals 수집 / 뉴스레터 |
| `robots.ts`, `sitemap.ts`, `feed.xml`(postbuild) | SEO 산출물 |

### `/levelup/book` 구조와 데이터 흐름 (★상세)
1. `/levelup` → `middleware.ts`가 `/levelup/book`으로 리다이렉트.
2. `/levelup/book`은 **`app/levelup/[...slug]/page.tsx`**가 처리. `slug = "book"`.
3. `contentlayer/generated`의 `allLevelups`에서 `slug === 'book'` 문서를 찾음 → **`data/levelup/book/index.mdx`** (computed `slug`는 `flattenedPath`에서 첫 세그먼트 `levelup/`를 제거 → `book`).
4. 같은 폴더에 `discussion.mdx`, `feedback.mdx`, `neon-postgres.mdx` → 각각 `/levelup/book/discussion` 등으로 노출.
5. 레이아웃은 frontmatter `layout` 필드로 선택(`PostSimple`/`PostLayout`/`PostBanner`), 기본 `PostSimple`. 본문은 `MDXLayoutRenderer` + 커스텀 `MDXComponents`로 렌더, 우측 TOC 사이드바.
6. 책 표지 이미지는 `/static/images/levelup/cover_{front,middle,back}.png`. 본문은 도서 소개·목차(`<details>`)·서점 링크로 구성.

**개편 관점 코멘트**: `/book/nextjs`는 이 흐름을 거의 그대로 옮기면 된다(문서 타입 `Levelup`→`Book`, 폴더 `data/levelup`→`data/book`, 라우트 `app/book/[...slug]`). `/about`은 이미 동작하므로 내비 주석만 해제하면 됨.

---

## 4. 콘텐츠 자산

전부 **MDX 파일**이며 Contentlayer가 빌드 타임에 타입별로 수집한다. CMS/DB 없음. `contentlayer.config.ts`에 정의된 문서 타입:

| 문서 타입 | 경로 | 개수 | 비고 |
|-----------|------|------|------|
| **Blog** | `data/blog/**` | **71** | 카테고리 = 폴더(nextjs 29, react 10, web-dev 7, nextjs-overivew 6, javascript 5, dev-env 4, web-design 4, ai 3, vercel 2, editor 1) |
| **Doc** | `data/docs/**` | **187** | 최대 자산. nextjs/react/typescript/tailwind/vercel-storage 등 |
| **Example** | `data/example/**` | 15 | |
| **Levelup** | `data/levelup/**` | 4 | 책 소개 (3절) |
| **Authors** | `data/authors/**` | 2 | `default.mdx`(Pax Code), `boilerplate.mdx` |

- **분류 방식**: 카테고리는 폴더 구조로, 태그는 frontmatter `tags`(빌드 시 `app/tag-data.json` 집계).
- **`data/archive/`** (12 MDX): 폴더는 존재하나 **`contentlayer.config.ts`에 문서 타입으로 등록되지 않음 → 라우팅·노출 안 됨(고아 콘텐츠)**. (5절·7절 참조)
- **이미지/미디어**: `public/static/images/**`에 정적 보관, MDX에서 절대경로 참조. `remarkImgToJsx`로 `<Image>` 변환.

**개편 관점 코멘트**: 브리프가 보존하려는 `/archive`의 "기존 기술 블로그"는 사실상 **`data/blog`(71편) + `data/docs`(187편)**다. 이미 존재하는 `data/archive/` 폴더와 이름이 겹치므로 정리 필요(7·오픈이슈). `/essays`는 `Blog`를 복제한 새 문서 타입으로 쉽게 추가 가능.

---

## 5. 디자인 시스템

- **방식**: Tailwind 유틸리티 우선 + shadcn/ui(Radix). 토큰은 `css/tailwind.css`에 HSL CSS 변수(`--background`, `--foreground`, `--border` 등)로 정의, `tailwind.config.js`가 매핑.
- **색상**: `primary = colors.pink`(핑크 500). 본문 강조는 blue/indigo/yellow 혼용(`StyledComponents.tsx`, `callout.tsx`). → **브리프의 "네이비 박스 디자인 시스템"은 현재 존재하지 않음(신규 방향).**
- **타이포그래피**: `Space_Grotesk`(Google Font, `--font-space-grotesk`) + `@tailwindcss/typography` prose.
- **공통 컴포넌트 위치**: `components/Header.tsx`(로고+내비+검색+테마+모바일), `Footer.tsx`, `LayoutWrapper.tsx`, `SectionContainer.tsx`, `Card.tsx`, `Link.tsx`, `Image.tsx`, `MDXComponents.tsx`(MDX 매핑), `Tag.tsx`, `ThemeSwitch.tsx`, `toc.tsx`.
- **반응형**: Tailwind 브레이크포인트(sm/md/lg/xl). 모바일은 `MobileNav.tsx`.
- **다크모드**: `next-themes` + `darkMode: 'class'`, 기본 `system`.

**개편 관점 코멘트**: 레이아웃 골격(Header/Footer/Section/Card/MDX 매핑)은 그대로 재사용 가능. 다만 "네이비 박스 + 손글씨 일러스트" 톤은 새 토큰/일러스트가 필요하다 — `primary` 팔레트 교체와 신규 컴포넌트(예: NavyBox)로 접근. AdSense·핑크 강조 등 "튜토리얼 사이트" 흔적은 미니멀 방향과 충돌.

---

## 6. 재사용 평가 (개편 구조: `/book`, `/essays`, `/showcases`, `/archive`, About)

**그대로 사용**
- 레이아웃 골격: `Header`, `Footer`, `SectionContainer`, `LayoutWrapper`, `ThemeSwitch`
- MDX 파이프라인 전체: Contentlayer + `MDXComponents` + `PostSimple`/`PostLayout`, TOC, prism
- `Card`(쇼케이스/책 그리드용), `Link`, `Image`, kbar 검색
- `AuthorLayout` → About 페이지(이미 동작)

**약간 수정**
- `/book` ← `levelup/[...slug]` 복제·리네이밍 + `/book/judgment-dev` 추가
- `/archive` ← `data/blog`(+선택적 `data/docs`)를 "Archive" 라벨로 분리 표시(레이아웃에 배지/안내 추가)
- `/essays` ← `Blog` 닮은 신규 문서 타입 + 전용 목록 레이아웃
- `headerNavLinks.ts` 전면 교체(홈/블로그/태그/문서/예제/레벨업 → book/essays/showcases/archive/about)
- About ← `projectsData.ts`를 "Things I've built" 인벤토리로 확장

**신규 제작**
- `/showcases` 인터랙티브 데모(현재 라이브 데모 프레임워크 없음 — 카드 그리드만 존재)
- 네이비 박스 디자인 시스템 토큰 + 손글씨 일러스트 자산
- `/book/judgment-dev` 책 소개 페이지, lab.mindvest.ai 교차 링크

**개편 관점 코멘트**: 신규 작업의 80%는 "기존 레이아웃 + 새 콘텐츠/내비/토큰" 조합으로 처리 가능. 진짜 새로 만들 것은 `/showcases`의 인터랙티브 부분과 디자인 토큰뿐.

---

## 7. 마이그레이션 고려사항

- **URL 리다이렉트**: `/levelup/book` → `/book/nextjs`, `/levelup` → `/book`(현재 `/levelup`→`/levelup/book`) 301 추가 필요. `middleware.ts`에 이미 redirect 테이블(블로그 35건)이 있어 같은 패턴으로 확장 가능. **단 `matcher`가 redirect 키로 한정되어 있어 새 항목도 키에 추가해야 작동.**
- **깨질 내부 링크**: `headerNavLinks.ts`, MDX 본문 내 `/levelup`·`/blog` 절대경로, `config/docs.ts` 사이드바, `search.json`(재생성됨), `structuredData`/`sitemap`의 `flattenedPath` 기반 URL.
- **SEO**: `sitemap.ts`·`feed.xml`는 빌드 시 재생성. 기존 블로그 35개 리다이렉트는 archive 이동 시 **반드시 보존**. 필요 시 `canonicalUrl` frontmatter 활용.
- **노후 의존성**: Next 13.4(현재 15 대비 매우 구버전, `experimental.appDir` 잔존), Contentlayer 0.3.4(유지보수 중단), pliny 0.1.7, mdx-js 2 — 개편 중 업그레이드는 위험, 동결 권장.

**개편 관점 코멘트**: 도메인 유지 + 콘텐츠 보존이 목표이므로 리다이렉트 정확성이 SEO 자산 보존의 핵심. middleware 테이블 확장 + matcher 갱신을 체크리스트화할 것.

---

## 8. 주요 발견 / 의외의 발견

1. **`data/archive/` 폴더가 이미 존재하지만 Contentlayer에 미등록 → 어디에서도 렌더되지 않는 고아 콘텐츠**(12 MDX). 브리프의 `/archive`와 이름이 충돌하므로 의도 확인 필요.
2. **"기존 기술 블로그"의 실체는 blog 71편 + docs 187편**으로, docs가 압도적으로 크다. 브리프는 docs를 명시하지 않음 — 이 거대 자산의 처리 방침이 미정.
3. **책 소개가 "Levelup"이라는 별도 문서 타입**으로 관리되고, `index` 외에 `discussion/feedback/neon-postgres` 하위 글이 딸려 있음.
4. **AdSense 스크립트가 `app/layout.tsx`에 3번 중복 삽입**되어 있음. 미니멀·콘텐츠 중심 방향과 상충 → 정리 후보.
5. `/about`은 완성되어 동작하지만 내비에서 주석 처리되어 숨겨져 있음(즉시 노출 가능).
6. 패키지 매니저가 **Yarn 3 + `package-lock.json` 혼재**.
7. CSP/`headers()`가 주석 처리되어 비활성, AdSense용 도메인만 메모로 남아 있음.

---

## 9. 오픈 이슈 (다음 단계에서 결정 필요)

1. **`/archive` 범위**: blog(71)만 archive할지, docs(187)·example(15)까지 포함할지? docs는 최대 SEO 자산인데 브리프 미언급 — 유지/아카이브/삭제 중 결정.
2. **기존 `data/archive/` 폴더(고아 12편)** 처리: 신규 `/archive`로 흡수 vs 폐기?
3. **`/docs` 섹션 존치 여부**: 187편을 그대로 둘지, archive 라벨로 묶을지.
4. **AdSense 유지 여부**: 수익 vs 미니멀 톤. 유지 시 위치/빈도 정리.
5. **`/showcases` 구현 방식**: 실제 라이브 데모 임베드 vs 스크린샷+`lab.mindvest.ai` 링크?
6. **`/book/judgment-dev` 형식**: nextjs 책처럼 MDX 단일 페이지 vs 전용 디자인 페이지?
7. **의존성 업그레이드 시점**: 개편 중 동결 vs 개편 후 Next/Contentlayer 마이그레이션 별도 트랙?
8. **콘텐츠 언어/저자 정합성**: `siteMetadata` 저자가 "Pax Code", 브리프는 "주민호(Pax)" — 브랜딩 톤 통일 필요.
