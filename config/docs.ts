import { DocsConfig } from 'types'

export const docsConfig: DocsConfig = {
  sidebarNav: [
    {
      title: 'Getting Started',
      items: [
        {
          title: 'Introduction',
          href: '/docs',
        },
      ],
    },
    {
      title: 'React',
      items: [
        {
          title: '시작하기',
          href: '/docs/react',
        },
        {
          title: '튜토리얼: 틱택토 게임',
          href: '/docs/react/tic-tac-toe',
          disabled: false,
        },
        {
          title: '설치 및 환경 설정',
          href: '/docs/react/installation',
          disabled: false,
        },
        {
          title: 'UI 구축하기',
          href: '/docs/react/describing-the-ui',
          disabled: false,
        },
        {
          title: '상호작용성 추가하기',
          href: '/docs/react/adding-interactivity',
          disabled: false,
        },
        {
          title: '상태 관리',
          href: '/docs/react/managing-state',
          disabled: false,
        },
        {
          title: '고급 기법',
          href: '/docs/react/escape-hatches',
          disabled: false,
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
