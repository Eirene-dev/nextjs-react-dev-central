import { DocsConfig } from 'types'

export const docsConfig: DocsConfig = {
  sidebarNav: [
    {
      title: 'Boilerplate',
      href: '/example/boilerplate',
      items: [
        {
          title: '설치',
          href: '/example/boilerplate/install',
          disabled: false,
        },
        {
          title: '설정',
          href: '/example/boilerplate/config',
          disabled: false,
        },
      ],
    },
    {
      title: 'App Playground',
      href: '/docs',
    },
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
