import { DocsConfig } from 'types'

export const docsConfig: DocsConfig = {
  sidebarNav: [
    {
      title: 'Getting Started',
      items: [
        {
          title: '개발 가이드 문서 개요',
          href: '/docs',
        },
        {
          title: 'Next.js 기초',
          href: '/docs/getting-started/nextjs-foundation',
          disabled: true,
        },
        {
          title: 'Next.js 첫번째 앱 만들기',
          href: '/docs/getting-started/nextjs-first-app',
          disabled: true,
        },
      ],
    },
    {
      title: 'React',
      items: [
        {
          title: 'React 시작하기',
          items: [
            {
              title: 'React 개요',
              href: '/docs/react/learn/overview',
              disabled: false,
            },
            {
              title: '빠르게 시작해 보기',
              href: '/docs/react/learn/quick-start',
              disabled: true,
            },
            {
              title: '튜토리얼: 틱택토 게임',
              href: '/docs/react/learn/tic-tac-toe',
              disabled: false,
            },
            {
              title: 'React로 생각하기',
              href: '/docs/react/learn/thinking-in-react',
              disabled: true,
            },
          ],
        },
        {
          title: '설치 및 환경 설정',
          items: [
            {
              title: '신규 프로젝트 생성',
              href: '/docs/react/installation/start-a-new-react-project',
              disabled: true,
            },
            {
              title: '기존 프로젝트 추가',
              href: '/docs/react/installation/add-react-to-an-existing-project',
              disabled: true,
            },
            {
              title: '에디터 설정',
              href: '/docs/react/installation/editor-setup',
              disabled: true,
            },
            {
              title: 'React 개발자 도구',
              href: '/docs/react/installation/react-developer-tools',
              disabled: true,
            },
          ],
        },
        {
          title: 'UI 구축하기',
          items: [
            {
              title: '첫 번째 컴포넌트',
              href: '/docs/react/describing-the-ui/your-first-component',
              disabled: true,
            },
            {
              title: '컴포넌트 가져오기/내보내기',
              href: '/docs/react/describing-the-ui/importing-and-exporting-components',
              disabled: true,
            },
            {
              title: 'JSX 기반 마크업 작성',
              href: '/docs/react/describing-the-ui/writing-markup-with-jsx',
              disabled: true,
            },
            {
              title: 'JSX 내 자바스크립트',
              href: '/docs/react/describing-the-ui/javascript-in-jsx-with-curly-braces',
              disabled: true,
            },
            {
              title: '컴포넌트에 Props 전달',
              href: '/docs/react/describing-the-ui/passing-props-to-a-component',
              disabled: true,
            },
            {
              title: '조건부 렌더링',
              href: '/docs/react/describing-the-ui/conditional-rendering',
              disabled: true,
            },
            {
              title: '리스트 렌더링',
              href: '/docs/react/describing-the-ui/rendering-lists',
              disabled: true,
            },
            {
              title: '컴포넌트의 순수성 유지',
              href: '/docs/react/describing-the-ui/keeping-components-pure',
              disabled: true,
            },
          ],
        },
        {
          title: '상호작용성 추가하기',
          items: [
            {
              title: '이벤트에 응답하기',
              href: '/docs/react/adding-interactivity/responding-to-events',
              disabled: true,
            },
            {
              title: 'State: 컴포넌트 기억 공간',
              href: '/docs/react/adding-interactivity/state-a-components-memory',
              disabled: true,
            },
            {
              title: '렌더링과 커밋',
              href: '/docs/react/adding-interactivity/render-and-commit',
              disabled: true,
            },
            {
              title: 'State를 스냅샷으로 사용',
              href: '/docs/react/adding-interactivity/state-as-a-snapshot',
              disabled: true,
            },
            {
              title: '여러 State 연속 업데이트',
              href: '/docs/react/adding-interactivity/queueing-a-series-of-state-updates',
              disabled: true,
            },
            {
              title: 'State에서 객체 업데이트',
              href: '/docs/react/adding-interactivity/updating-objects-in-state',
              disabled: true,
            },
            {
              title: 'State에서 배열 업데이트',
              href: '/docs/react/adding-interactivity/updating-arrays-in-state',
              disabled: true,
            },
          ],
        },
        {
          title: 'State 관리',
          items: [
            {
              title: '사용자 입력 State 처리',
              href: '/docs/react/managing-state/reacting-to-input-with-state',
              disabled: true,
            },
            {
              title: 'State 구조 선택',
              href: '/docs/react/managing-state/choosing-the-state-structure',
              disabled: true,
            },
            {
              title: '컴포넌트간 State 공유',
              href: '/docs/react/managing-state/sharing-state-between-components',
              disabled: true,
            },
            {
              title: 'State 보존과 재설정',
              href: '/docs/react/managing-state/preserving-and-resetting-state',
              disabled: true,
            },
            {
              title: 'Reducer: State 로직 추출',
              href: '/docs/react/managing-state/extracting-state-logic-into-a-reducer',
              disabled: true,
            },
            {
              title: 'Context: 데이터 깊이 전달',
              href: '/docs/react/managing-state/passing-data-deeply-with-context',
              disabled: true,
            },
            {
              title: 'Reducer와 Context 활용',
              href: '/docs/react/managing-state/scaling-up-with-reducer-and-context',
              disabled: true,
            },
          ],
        },
        {
          title: '고급 기법',
          items: [
            {
              title: 'Refs: 값 참조',
              href: '/docs/react/escape-hatches/your-first-component',
              disabled: true,
            },
            {
              title: 'Refs: DOM 조작',
              href: '/docs/react/escape-hatches/importing-and-exporting-components',
              disabled: true,
            },
            {
              title: 'Effect: 동기화',
              href: '/docs/react/escape-hatches/writing-markup-with-jsx',
              disabled: true,
            },
            {
              title: 'Effect: 필요성 검토',
              href: '/docs/react/escape-hatches/javascript-in-jsx-with-curly-braces',
              disabled: true,
            },
            {
              title: 'Effect: 라이프사이클',
              href: '/docs/react/escape-hatches/passing-props-to-a-component',
              disabled: true,
            },
            {
              title: 'Effect: Event를 분리',
              href: '/docs/react/escape-hatches/conditional-rendering',
              disabled: true,
            },
            {
              title: 'Effect: 종속성 제거',
              href: '/docs/react/escape-hatches/rendering-lists',
              disabled: true,
            },
            {
              title: '사용자 정의 훅: 로직 재사용',
              href: '/docs/react/escape-hatches/keeping-components-pure',
              disabled: true,
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
      items: [
        {
          title: 'Introduction',
          href: '/docs/react',
        },
      ],
    },
    {
      title: 'TypeScript',
      items: [
        {
          title: 'Introduction',
          href: '/docs/react',
        },
      ],
    },
    {
      title: 'JavaScript',
      items: [
        {
          title: 'Introduction',
          href: '/docs/react',
        },
      ],
    },
    {
      title: 'CSS',
      items: [
        {
          title: 'Introduction',
          href: '/docs/react',
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
