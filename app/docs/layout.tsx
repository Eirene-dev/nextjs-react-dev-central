'use client'

import { docsConfig } from '@/config/docs'
import { DocsSidebarNav } from '@/components/sidebar-nav'
import { useState } from 'react'

interface DocsLayoutProps {
  children: React.ReactNode
}

export default function DocsLayout({ children }: DocsLayoutProps) {
  const [navShow, setNavShow] = useState(false)

  const onToggleNav = () => {
    setNavShow((status) => {
      if (status) {
        document.body.style.overflow = 'auto'
      } else {
        // Prevent scrolling
        document.body.style.overflow = 'auto'
      }
      return !status
    })
  }

  return (
    <div className="flex-1 md:grid md:grid-cols-[190px_1fr] md:gap-6 lg:grid-cols-[200px_1fr] lg:gap-10">
      <button className="md:hidden" onClick={onToggleNav}>
        문서 목차
      </button>
      <aside
        style={{ display: navShow ? 'block' : 'none' }}
        className="fixed top-30 z-30 h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r py-6 pr-2 bg-white bg-opacity-90 dark:bg-gray-950 md:sticky md:block lg:py-10 md:hidden"
      >
        <DocsSidebarNav items={docsConfig.sidebarNav} />
      </aside>

      <aside className="hidden md:block">
        <DocsSidebarNav items={docsConfig.sidebarNav} />
      </aside>
      {children}
    </div>
  )
}
