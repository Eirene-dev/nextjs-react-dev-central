import { DocsConfig } from 'types'

export const docsConfig: DocsConfig = {
  sidebarNav: [
    {
      title: 'Getting Started',
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
              title: 'JavaScript에서 React로',
              href: '/docs/getting-started/nextjs-foundation/from-javascript-to-react',
              disabled: false,
            },
            {
              title: 'React에서 Next.js로',
              href: '/docs/getting-started/nextjs-foundation/from-react-to-nextjs',
              disabled: false,
            },
            {
              title: 'Next.js 동작 방식',
              href: '/docs/getting-started/nextjs-foundation/how-nextjs-works',
              disabled: false,
            },
            {
              title: 'v13.4(\'23.05): 앱 라우터',
              href: '/docs/getting-started/nextjs-foundation/app-router',
              disabled: false,
            },
          ],
        },
        {
          title: 'Next.js 첫번째 앱 만들기',
          href: '/docs/getting-started/nextjs-first-app',
          items: [
            {
              title: 'Next.js 앱 생성',
              href: '/docs/getting-started/nextjs-first-app/create-nextjs-app',
              disabled: true,
            },
            {
              title: '페이지 간 이동',
              href: '/docs/getting-started/nextjs-first-app/navigate-between-pages',
              disabled: true,
            },
            {
              title: '메타데이터/Assets/CSS',
              href: '/docs/getting-started/nextjs-first-app/assets-metadata-css',
              disabled: true,
            },
            {
              title: '데이터 가져오기',
              href: '/docs/getting-started/nextjs-first-app/data-fetching',
              disabled: true,
            },
            {
              title: '동적 라우팅',
              href: '/docs/getting-started/nextjs-first-app/dynamic-routes',
              disabled: true,
            },
            {
              title: 'API 라우팅',
              href: '/docs/getting-started/nextjs-first-app/api-routes',
              disabled: true,
            },
            {
              title: 'Next.js 앱 배포하기',
              href: '/docs/getting-started/nextjs-first-app/deploying-nextjs-app',
              disabled: true,
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
              disabled: true,
            },
            {
              title: '코어 웹 바이탈 개선',
              href: '/docs/getting-started/seo/improve',
              disabled: true,
            },
            {
              title: '코어 웹 바이탈 모니터링',
              href: '/docs/getting-started/seo/monitor',
              disabled: true,
            },
          ],
        },
      ],
    },
    {
      title: 'React',
      href: '/docs/react',
      items: [
        {
          title: 'React 시작하기',
          href: '/docs/react/learn',
          items: [
            {
              title: 'React 개요',
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
              title: 'React로 생각하기',
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
              title: 'TypeScript',
              href: '/docs/react/installation/typescript',
              disabled: true,
            },
            {
              title: 'React 개발자 도구',
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
        {
          title: '서버/클라이언트 컴포넌트',
          href: '/docs/react/server-client-components',
          disabled: false,
        },
      ],
    },
    {
      title: 'Next.js',
      href: '/docs/nextjs',
      items: [
        {
          title: 'Introduction',
          href: '/docs/nextjs',
          disabled: true,
        },
      ],
    },
    {
      title: 'TypeScript',
      href: '/docs/typescript',
      items: [
        {
          title: 'Introduction',
          href: '/docs/typescript',
          disabled: true,
        },
      ],
    },
    {
      title: 'JavaScript',
      href: '/docs/javascript',
      items: [
        {
          title: 'Introduction',
          href: '/docs/javascript',
          disabled: true,
        },
      ],
    },
    {
      title: 'CSS',
      href: '/docs/css',
      items: [
        {
          title: 'Introduction',
          href: '/docs/css',
          disabled: true,
        },
      ],
    },
    // {
    //   title: "Documentation",
    //   items: [
    //     {
    //       title: "Introduction",
    //       href: "/docs/documentation",
    //     },
    //     {
    //       title: "Contentlayer",
    //       href: "/docs/in-progress",
    //       disabled: true,
    //     },
    //     {
    //       title: "Components",
    //       href: "/docs/documentation/components",
    //     },
    //     {
    //       title: "Code Blocks",
    //       href: "/docs/documentation/code-blocks",
    //     },
    //     {
    //       title: "Style Guide",
    //       href: "/docs/documentation/style-guide",
    //     },
    //     {
    //       title: "Search",
    //       href: "/docs/in-progress",
    //       disabled: true,
    //     },
    //   ],
    // },
    // {
    //   title: "Blog",
    //   items: [
    //     {
    //       title: "Introduction",
    //       href: "/docs/in-progress",
    //       disabled: true,
    //     },
    //     {
    //       title: "Build your own",
    //       href: "/docs/in-progress",
    //       disabled: true,
    //     },
    //     {
    //       title: "Writing Posts",
    //       href: "/docs/in-progress",
    //       disabled: true,
    //     },
    //   ],
    // },
  ],
  mainNav: [
    // {
    //   title: "Documentation",
    //   href: "/docs",
    // },
    // {
    //   title: "Guides",
    //   href: "/guides",
    // },
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
