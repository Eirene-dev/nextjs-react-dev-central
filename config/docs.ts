import { DocsConfig } from 'types'

export const docsConfig: DocsConfig = {
  sidebarNav: [
    {
      title: '시작하기',
      href: '/docs',
      items: [
        {
          title: 'Next.js 기초',
          href: '/docs/getting-started/nextjs-foundation',
          items: [
            {
              title: 'Next.js 개요',
              href: '/docs/getting-started/nextjs-foundation/about-nextjs',
              disabled: false,
            },
            {
              title: '앱 라우터',
              href: '/docs/getting-started/nextjs-foundation/app-router',
              disabled: false,
            },
            {
              title: '설치하기',
              href: '/docs/getting-started/nextjs-foundation/installation',
              disabled: false,
            },
            {
              title: '프로젝트 구조',
              href: '/docs/getting-started/nextjs-foundation/project-structure',
              disabled: false,
            },
          ],
        },
        {
          title: '리액트 기초',
          href: '/docs/getting-started/react-foundation',
          items: [
            {
              title: '리액트 기초와 시작하기',
              href: '/docs/getting-started/react-foundation/basics',
              disabled: false,
            },
            {
              title: '컴포넌트와 데이터 관리',
              href: '/docs/getting-started/react-foundation/components',
              disabled: false,
            },
            {
              title: 'Next.js로의 전환과 심화',
              href: '/docs/getting-started/react-foundation/with-nextjs',
              disabled: false,
            },
          ],
        },
        {
          title: 'Next.js 풀스택 앱 만들기',
          href: '/docs/getting-started/nextjs-fullstack-app',
          items: [
            {
              title: '기본 설정 및 스타일링',
              href: '/docs/getting-started/nextjs-fullstack-app/getting-started-and-styling',
              disabled: false,
            },
            {
              title: '레이아웃 및 라우팅',
              href: '/docs/getting-started/nextjs-fullstack-app/layouts-and-routing',
              disabled: false,
            },
            {
              title: '데이터 생성과 가져오기',
              href: '/docs/getting-started/nextjs-fullstack-app/data-management',
              disabled: false,
            },
            {
              title: '렌더링',
              href: '/docs/getting-started/nextjs-fullstack-app/rendering',
              disabled: false,
            },
            {
              title: '고급 데이터 처리',
              href: '/docs/getting-started/nextjs-fullstack-app/data-mutation',
              disabled: false,
            },
            {
              title: '에러처리 및 접근성',
              href: '/docs/getting-started/nextjs-fullstack-app/error-handling-accessibility',
              disabled: false,
            },
            {
              title: '인증 및 메타데이터',
              href: '/docs/getting-started/nextjs-fullstack-app/auth-and-metadata',
              disabled: false,
            },
          ],
        },
        {
          title: '검색 엔진 최적화',
          href: '/docs/getting-started/seo',
          items: [
            {
              title: 'SEO 소개',
              href: '/docs/getting-started/seo/introduction-to-seo',
              disabled: false,
            },
            {
              title: '크롤링 및 색인화',
              href: '/docs/getting-started/seo/crawling-and-indexing',
              disabled: false,
            },
            {
              title: '렌더링 및 랭킹',
              href: '/docs/getting-started/seo/rendering-and-ranking',
              disabled: false,
            },
            {
              title: '웹 성능 & 코어 웹 바이탈',
              href: '/docs/getting-started/seo/web-performance',
              disabled: false,
            },
            {
              title: '코어 웹 바이탈 개선',
              href: '/docs/getting-started/seo/improve',
              disabled: false,
            },
            {
              title: '코어 웹 바이탈 모니터링',
              href: '/docs/getting-started/seo/monitor',
              disabled: false,
            },
          ],
        },
      ],
    },
    {
      title: 'Next.js',
      href: '/docs/nextjs',
      items: [
        {
          title: '라우팅',
          href: '/docs/nextjs/routing',
          items: [
            {
              title: '라우트 정의하기',
              href: '/docs/nextjs/routing/defining-routes',
              disabled: false,
            },
            {
              title: '페이지와 레이아웃',
              href: '/docs/nextjs/routing/pages-and-layouts',
              disabled: false,
            },
            {
              title: '링크 생성 및 내비게이션',
              href: '/docs/nextjs/routing/linking-and-navigating',
              disabled: false,
            },
            {
              title: '라우트 그룹',
              href: '/docs/nextjs/routing/route-groups',
              disabled: false,
            },
            {
              title: '동적 라우트',
              href: '/docs/nextjs/routing/dynamic-routes',
              disabled: false,
            },
            {
              title: '로딩 UI 및 스트리밍',
              href: '/docs/nextjs/routing/loading-ui-and-streaming',
              disabled: false,
            },
            {
              title: '오류 처리',
              href: '/docs/nextjs/routing/error-handling',
              disabled: false,
            },
            {
              title: '병렬 라우트',
              href: '/docs/nextjs/routing/parallel-routes',
              disabled: false,
            },
            {
              title: '라우트 가로채기',
              href: '/docs/nextjs/routing/intercepting-routes',
              disabled: false,
            },
            {
              title: '라우트 핸들러',
              href: '/docs/nextjs/routing/route-handlers',
              disabled: false,
            },
            {
              title: '미들웨어',
              href: '/docs/nextjs/routing/middleware',
              disabled: false,
            },
            {
              title: '프로젝트 구성',
              href: '/docs/nextjs/routing/colocation',
              disabled: false,
            },
            {
              title: '국제화',
              href: '/docs/nextjs/routing/internationalization',
              disabled: false,
            },
          ],
        },
        {
          title: '데이터 가져오기',
          href: '/docs/nextjs/data-fetching',
          items: [
            {
              title: '데이터 페칭/캐싱/재검증',
              href: '/docs/nextjs/data-fetching/fetching-caching-and-revalidating',
              disabled: false,
            },
            {
              title: '데이터 페칭 패턴',
              href: '/docs/nextjs/data-fetching/patterns',
              disabled: false,
            },
            {
              title: '폼과 변이',
              href: '/docs/nextjs/data-fetching/forms-and-mutations',
              disabled: false,
            },
          ],
        },
        {
          title: '렌더링',
          href: '/docs/nextjs/rendering',
          items: [
            {
              title: '서버 컴포넌트',
              href: '/docs/nextjs/rendering/server-components',
              disabled: false,
            },
            {
              title: '클라이언트 컴포넌트',
              href: '/docs/nextjs/rendering/client-components',
              disabled: false,
            },
            {
              title: '서버/클라이언트 조합 패턴',
              href: '/docs/nextjs/rendering/composition-patterns',
              disabled: false,
            },
            {
              title: '엣지와 Node.js 런타임',
              href: '/docs/nextjs/rendering/edge-and-nodejs-runtimes',
              disabled: false,
            },
          ],
        },
        {
          title: '캐싱',
          href: '/docs/nextjs/caching',
          items: [
            {
              title: 'Request 메모이제이션',
              href: '/docs/nextjs/caching/request-memoization',
              disabled: false,
            },
            {
              title: '데이터 캐시',
              href: '/docs/nextjs/caching/data-cache',
              disabled: false,
            },
            {
              title: '전체 라우트 캐시',
              href: '/docs/nextjs/caching/full-route-cache',
              disabled: false,
            },
            {
              title: '라우터 캐시',
              href: '/docs/nextjs/caching/router-cache',
              disabled: false,
            },
            {
              title: '캐싱 영향 주는 APIs',
              href: '/docs/nextjs/caching/affecting-api',
              disabled: false,
            },
          ],
        },
        {
          title: '스타일링',
          href: '/docs/nextjs/styling',
          items: [
            {
              title: 'CSS 모듈',
              href: '/docs/nextjs/styling/css-modules',
              disabled: false,
            },
            {
              title: 'Tailwind CSS',
              href: '/docs/nextjs/styling/tailwind-css',
              disabled: false,
            },
            {
              title: 'CSS-in-JS',
              href: '/docs/nextjs/styling/css-in-js',
              disabled: false,
            },
            {
              title: 'Sass',
              href: '/docs/nextjs/styling/sass',
              disabled: false,
            },
          ],
        },
        {
          title: '최적화',
          href: '/docs/nextjs/optimizing',
          items: [
            {
              title: '이미지',
              href: '/docs/nextjs/optimizing/images',
              disabled: false,
            },
            {
              title: '폰트',
              href: '/docs/nextjs/optimizing/fonts',
              disabled: false,
            },
            {
              title: '스크립트',
              href: '/docs/nextjs/optimizing/scripts',
              disabled: false,
            },
            {
              title: '메타데이터',
              href: '/docs/nextjs/optimizing/metadata',
              disabled: false,
            },
            {
              title: '정적 자산',
              href: '/docs/nextjs/optimizing/static-assets',
              disabled: false,
            },
            {
              title: '지연 로딩',
              href: '/docs/nextjs/optimizing/lazy-loading',
              disabled: false,
            },
            {
              title: '측정/분석',
              href: '/docs/nextjs/optimizing/analytics',
              disabled: false,
            },
            {
              title: 'OpenTelemetry',
              href: '/docs/nextjs/optimizing/open-telemetry',
              disabled: false,
            },
            {
              title: 'Instrumentation',
              href: '/docs/nextjs/optimizing/instrumentation',
              disabled: false,
            },
          ],
        },
        {
          title: '환경 설정',
          href: '/docs/nextjs/configuring',
          items: [
            {
              title: '타입스크립트',
              href: '/docs/nextjs/configuring/typescript',
              disabled: false,
            },
            {
              title: 'ESLint',
              href: '/docs/nextjs/configuring/eslint',
              disabled: false,
            },
            {
              title: '환경 변수',
              href: '/docs/nextjs/configuring/environment-variables',
              disabled: false,
            },
            {
              title: '모듈 경로',
              href: '/docs/nextjs/configuring/absolute-imports-and-module-aliases',
              disabled: false,
            },
            {
              title: 'MDX',
              href: '/docs/nextjs/configuring/mdx',
              disabled: false,
            },
            {
              title: 'src/ 디렉터리',
              href: '/docs/nextjs/configuring/src-directory',
              disabled: false,
            },
            {
              title: '드래프트 모드',
              href: '/docs/nextjs/configuring/draft-mode',
              disabled: false,
            },
            {
              title: '콘텐츠 보안 정책',
              href: '/docs/nextjs/configuring/content-security-policy',
              disabled: false,
            },
          ],
        },
        {
          title: '테스팅',
          href: '/docs/nextjs/testing',
          items: [
            {
              title: 'Vitest',
              href: '/docs/nextjs/testing/vitest',
              disabled: false,
            },
            {
              title: 'Jest',
              href: '/docs/nextjs/testing/jest',
              disabled: false,
            },
            {
              title: 'Playwright',
              href: '/docs/nextjs/testing/playwright',
              disabled: false,
            },
            {
              title: 'Cypress',
              href: '/docs/nextjs/testing/cypress',
              disabled: false,
            },
          ],
        },
        {
          title: '사용자 인증',
          href: '/docs/nextjs/authentication',
          items: [
            {
              title: '인증',
              href: '/docs/nextjs/authentication/authentication',
              disabled: false,
            },
            {
              title: '권한 부여',
              href: '/docs/nextjs/authentication/authorization',
              disabled: false,
            },
            {
              title: '세션 관리',
              href: '/docs/nextjs/authentication/session-management',
              disabled: false,
            },
          ],
        },
        {
          title: '배포',
          href: '/docs/nextjs/deploying',
          items: [
            {
              title: '정적 내보내기',
              href: '/docs/nextjs/deploying/static-exports',
              disabled: false,
            },
          ],
        },
        {
          title: '업그레이드',
          href: '/docs/nextjs/upgrading',
          items: [
            {
              title: '코드 변환도구',
              href: '/docs/nextjs/upgrading/codemods',
              disabled: false,
            },
            {
              title: '앱 라우터 마이그레이션',
              href: '/docs/nextjs/upgrading/app-router-migration',
              disabled: false,
            },
          ],
        },
      ],
    },
    {
      title: '리액트',
      href: '/docs/react',
      items: [
        {
          title: '리액트 시작하기',
          href: '/docs/react/learn',
          items: [
            {
              title: '리액트 개요',
              href: '/docs/react/learn/overview',
              disabled: false,
            },
            {
              title: '빠르게 시작해 보기',
              href: '/docs/react/learn/quick-start',
              disabled: false,
            },
            {
              title: '튜토리얼: 틱택토 게임',
              href: '/docs/react/learn/tic-tac-toe',
              disabled: false,
            },
            {
              title: '리액트로 생각하기',
              href: '/docs/react/learn/thinking-in-react',
              disabled: false,
            },
          ],
        },
        {
          title: '설치 및 환경 설정',
          href: '/docs/react/installation',
          items: [
            {
              title: '신규 프로젝트 생성',
              href: '/docs/react/installation/start-a-new-react-project',
              disabled: false,
            },
            {
              title: '기존 프로젝트 추가',
              href: '/docs/react/installation/add-react-to-an-existing-project',
              disabled: false,
            },
            {
              title: '에디터 설정',
              href: '/docs/react/installation/editor-setup',
              disabled: false,
            },
            {
              title: '타입스크립트',
              href: '/docs/react/installation/typescript',
              disabled: false,
            },
            {
              title: '리액트 개발자 도구',
              href: '/docs/react/installation/react-developer-tools',
              disabled: false,
            },
          ],
        },
        {
          title: 'UI 구축하기',
          href: '/docs/react/describing-the-ui',
          items: [
            {
              title: '첫 번째 컴포넌트',
              href: '/docs/react/describing-the-ui/your-first-component',
              disabled: false,
            },
            {
              title: '컴포넌트 가져오기/내보내기',
              href: '/docs/react/describing-the-ui/importing-and-exporting-components',
              disabled: false,
            },
            {
              title: 'JSX 기반 마크업 작성',
              href: '/docs/react/describing-the-ui/writing-markup-with-jsx',
              disabled: false,
            },
            {
              title: 'JSX 내 자바스크립트',
              href: '/docs/react/describing-the-ui/javascript-in-jsx-with-curly-braces',
              disabled: false,
            },
            {
              title: '컴포넌트에 Props 전달',
              href: '/docs/react/describing-the-ui/passing-props-to-a-component',
              disabled: false,
            },
            {
              title: '조건부 렌더링',
              href: '/docs/react/describing-the-ui/conditional-rendering',
              disabled: false,
            },
            {
              title: '리스트 렌더링',
              href: '/docs/react/describing-the-ui/rendering-lists',
              disabled: false,
            },
            {
              title: '컴포넌트의 순수성 유지',
              href: '/docs/react/describing-the-ui/keeping-components-pure',
              disabled: false,
            },
          ],
        },
        {
          title: '상호작용성 추가하기',
          href: '/docs/react/adding-interactivity',
          items: [
            {
              title: '이벤트에 응답하기',
              href: '/docs/react/adding-interactivity/responding-to-events',
              disabled: false,
            },
            {
              title: 'State: 컴포넌트 기억 공간',
              href: '/docs/react/adding-interactivity/state-a-components-memory',
              disabled: false,
            },
            {
              title: '렌더링과 커밋',
              href: '/docs/react/adding-interactivity/render-and-commit',
              disabled: false,
            },
            {
              title: 'State를 스냅샷으로 사용',
              href: '/docs/react/adding-interactivity/state-as-a-snapshot',
              disabled: false,
            },
            {
              title: '여러 State 연속 업데이트',
              href: '/docs/react/adding-interactivity/queueing-a-series-of-state-updates',
              disabled: false,
            },
            {
              title: 'State에서 객체 업데이트',
              href: '/docs/react/adding-interactivity/updating-objects-in-state',
              disabled: false,
            },
            {
              title: 'State에서 배열 업데이트',
              href: '/docs/react/adding-interactivity/updating-arrays-in-state',
              disabled: false,
            },
          ],
        },
        {
          title: 'State 관리',
          href: '/docs/react/managing-state',
          items: [
            {
              title: '사용자 입력 State 처리',
              href: '/docs/react/managing-state/reacting-to-input-with-state',
              disabled: false,
            },
            {
              title: 'State 구조 선택',
              href: '/docs/react/managing-state/choosing-the-state-structure',
              disabled: false,
            },
            {
              title: '컴포넌트간 State 공유',
              href: '/docs/react/managing-state/sharing-state-between-components',
              disabled: false,
            },
            {
              title: 'State 보존과 재설정',
              href: '/docs/react/managing-state/preserving-and-resetting-state',
              disabled: false,
            },
            {
              title: 'Reducer: State 로직 추출',
              href: '/docs/react/managing-state/extracting-state-logic-into-a-reducer',
              disabled: false,
            },
            {
              title: 'Context: 데이터 깊이 전달',
              href: '/docs/react/managing-state/passing-data-deeply-with-context',
              disabled: false,
            },
            {
              title: 'Reducer와 Context 활용',
              href: '/docs/react/managing-state/scaling-up-with-reducer-and-context',
              disabled: false,
            },
          ],
        },
        {
          title: '고급 기법',
          href: '/docs/react/escape-hatches',
          items: [
            {
              title: 'Refs: 값 참조',
              href: '/docs/react/escape-hatches/referencing-values-with-refs',
              disabled: false,
            },
            {
              title: 'Refs: DOM 조작',
              href: '/docs/react/escape-hatches/manipulating-the-dom-with-refs',
              disabled: false,
            },
            {
              title: 'Effect: 동기화',
              href: '/docs/react/escape-hatches/synchronizing-with-effects',
              disabled: false,
            },
            {
              title: 'Effect: 필요성 검토',
              href: '/docs/react/escape-hatches/you-might-not-need-an-effect',
              disabled: false,
            },
            {
              title: 'Effect: 라이프사이클',
              href: '/docs/react/escape-hatches/lifecycle-of-reactive-effects',
              disabled: false,
            },
            {
              title: 'Effect: Event를 분리',
              href: '/docs/react/escape-hatches/separating-events-from-effects',
              disabled: false,
            },
            {
              title: 'Effect: 종속성 제거',
              href: '/docs/react/escape-hatches/removing-effect-dependencies',
              disabled: false,
            },
            {
              title: '사용자 정의 훅: 로직 재사용',
              href: '/docs/react/escape-hatches/reusing-logic-with-custom-hooks',
              disabled: false,
            },
          ],
        },
      ],
    },
    {
      title: '타입스크립트',
      href: '/docs/typescript',
      items: [
        {
          title: 'TS 기초',
          href: '/docs/typescript/basics',
          items: [
            {
              title: '시작하기',
              href: '/docs/typescript/basics/get-started',
              disabled: false,
            },
            {
              title: '기본기 다지기',
              href: '/docs/typescript/basics/basics',
              disabled: false,
            },
            {
              title: '자주 사용되는 타입',
              href: '/docs/typescript/basics/everyday-types',
              disabled: false,
            },
            {
              title: '타입 좁히기',
              href: '/docs/typescript/basics/narrowing',
              disabled: false,
            },
            {
              title: '함수 타입',
              href: '/docs/typescript/basics/more-on-functions',
              disabled: false,
            },
            {
              title: '객체 타입',
              href: '/docs/typescript/basics/object-types',
              disabled: false,
            },
            {
              title: '타입 다루기',
              href: '/docs/typescript/basics/type-manipulation',
              disabled: false,
            },
            {
              title: '모듈',
              href: '/docs/typescript/basics/modules',
              disabled: false,
            },
          ],
        },
        {
          title: '리액트를 위한 TS',
          href: '/docs/typescript/react',
          items: [
            {
              title: '컴포넌트 속성 타입',
              href: '/docs/typescript/react/typing-component-props',
              disabled: false,
            },
            {
              title: '함수 컴포넌트',
              href: '/docs/typescript/react/function-components',
              disabled: false,
            },
            {
              title: '훅',
              href: '/docs/typescript/react/hooks',
              disabled: false,
            },
            {
              title: '클래스 컴포넌트',
              href: '/docs/typescript/react/class-components',
              disabled: false,
            },
            {
              title: 'defaultProps 타입',
              href: '/docs/typescript/react/typing-defaultprops',
              disabled: false,
            },
            {
              title: '폼과 이벤트',
              href: '/docs/typescript/react/forms-and-events',
              disabled: false,
            },
            {
              title: '컨텍스트',
              href: '/docs/typescript/react/context',
              disabled: false,
            },
            {
              title: 'forwardRef/createRef',
              href: '/docs/typescript/react/forwardref-and-createref',
              disabled: false,
            },
            {
              title: '포털',
              href: '/docs/typescript/react/portals',
              disabled: false,
            },
            {
              title: '에러 경계',
              href: '/docs/typescript/react/error-boundaries',
              disabled: false,
            },
          ],
        },
      ],
    },
    {
      title: 'Tailwind CSS',
      href: '/docs/tailwind-css',
      items: [
        {
          title: '핵심 개념',
          href: '/docs/tailwind-css/core-concepts',
          items: [
            {
              title: '유틸리티 중심',
              href: '/docs/tailwind-css/core-concepts/utility-first',
              disabled: false,
            },
            {
              title: '호버, 포커스, 상태',
              href: '/docs/tailwind-css/core-concepts/hover-focus-and-other-states',
              disabled: false,
            },
            {
              title: '반응형 디자인',
              href: '/docs/tailwind-css/core-concepts/responsive-design',
              disabled: false,
            },
            {
              title: '다크 모드',
              href: '/docs/tailwind-css/core-concepts/dark-mode',
              disabled: false,
            },
            {
              title: '스타일 재사용',
              href: '/docs/tailwind-css/core-concepts/reusing-styles',
              disabled: false,
            },
            {
              title: '사용자 정의 스타일',
              href: '/docs/tailwind-css/core-concepts/adding-custom-styles',
              disabled: false,
            },
            {
              title: '함수와 지시어',
              href: '/docs/tailwind-css/core-concepts/functions-and-directives',
              disabled: false,
            },
          ],
        },
      ],
    },
    {
      title: 'Vercel 스토리지',
      href: '/docs/vercel-storage',
      items: [
        {
          title: 'KV',
          href: '/docs/vercel-storage/kv',
          items: [
            {
              title: '시작하기',
              href: '/docs/vercel-storage/kv/quick-start',
              disabled: false,
            },
            {
              title: 'SDK 레퍼런스',
              href: '/docs/vercel-storage/kv/sdk-reference',
              disabled: false,
            },
            {
              title: 'Rest API',
              href: '/docs/vercel-storage/kv/rest-api',
              disabled: false,
            },
          ],
        },
        {
          title: 'Postgres',
          href: '/docs/vercel-storage/postgres',
          items: [
            {
              title: '시작하기',
              href: '/docs/vercel-storage/postgres/quick-start',
              disabled: false,
            },
            {
              title: 'SDK 레퍼런스',
              href: '/docs/vercel-storage/postgres/sdk-reference',
              disabled: false,
            },
            {
              title: 'ORM 사용',
              href: '/docs/vercel-storage/postgres/using-an-orm',
              disabled: false,
            },
          ],
        },
        {
          title: 'Blob',
          href: '/docs/vercel-storage/blob',
          items: [
            {
              title: '서버 업로드 가이드',
              href: '/docs/vercel-storage/blob/server-upload',
              disabled: false,
            },
            {
              title: '클라이언트 업로드 가이드',
              href: '/docs/vercel-storage/blob/client-upload',
              disabled: false,
            },
            {
              title: 'SDK 레퍼런스',
              href: '/docs/vercel-storage/blob/using-blob-sdk',
              disabled: false,
            },
          ],
        },
        {
          title: 'Edge Config',
          href: '/docs/vercel-storage/edge-config',
          items: [
            {
              title: '시작하기',
              href: '/docs/vercel-storage/edge-config/quick-start',
              disabled: false,
            },
            {
              title: '사용 방법',
              href: '/docs/vercel-storage/edge-config/using-edge-config',
              disabled: false,
            },
            {
              title: 'Vercel API로 관리',
              href: '/docs/vercel-storage/edge-config/vercel-api',
              disabled: false,
            },
            {
              title: 'SDK 레퍼런스',
              href: '/docs/vercel-storage/edge-config/edge-config-sdk',
              disabled: false,
            },
          ],
        },
      ],
    },
  ],
  mainNav: [
    {
      title: 'Blog',
      href: '/blog',
    },
    {
      title: 'Documentation',
      href: '/docs',
    },
  ],
}
