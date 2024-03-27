'use client'

import { docsConfig } from '@/config/docs'
import { DocsSidebarNav } from '@/components/sidebar-nav'
import { useState } from 'react'
import { Icons } from '@/components/icons'

import Script from 'next/script'

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
        document.body.style.overflow = 'hidden'
      }
      return !status
    })
  }

  return (
    <div className="flex-1 md:grid md:grid-cols-[205px_1fr] md:gap-2 lg:grid-cols-[220px_1fr] lg:gap-4">
      <button
        className="flex items-center p-1 bg-gray-100 md:hidden" // 버튼에 패딩 추가
        onClick={onToggleNav}
      >
        {navShow ? (
          <Icons.leftClose className="align-middle" />
        ) : (
          <Icons.leftOpen className="align-middle" />
        )}
        <span className="ml-2 text-lg">{navShow ? '목차 닫기' : '문서 목차'}</span>
      </button>
      <aside
        style={{ display: navShow ? 'block' : 'none' }}
        className={`${
          navShow ? 'absolute' : 'fixed'
        } top-30 z-30 h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r py-6 pr-2 bg-white bg-opacity-90 dark:bg-gray-950 md:sticky md:block lg:py-10 md:hidden`}
      >
        <DocsSidebarNav items={docsConfig.sidebarNav} onClose={onToggleNav} />
      </aside>

      <aside className="hidden md:block">
        <DocsSidebarNav items={docsConfig.sidebarNav} />
      </aside>
      {children}
    </div>
  )
}

// 'use client'

// import { docsConfig } from '@/config/docs'
// import { DocsSidebarNav } from '@/components/sidebar-nav'
// import { useState } from 'react'
// import { Icons } from '@/components/icons'

// import Script from 'next/script'

// interface DocsLayoutProps {
//   children: React.ReactNode
// }

// export default function DocsLayout({ children }: DocsLayoutProps) {
//   const [navShow, setNavShow] = useState(false)

//   const onToggleNav = () => {
//     setNavShow((status) => {
//       if (status) {
//         document.body.style.overflow = 'auto'
//       } else {
//         // Prevent scrolling
//         document.body.style.overflow = 'hidden'
//       }
//       return !status
//     })
//   }

//   return (
//     <div className="flex-1 md:grid md:grid-cols-[205px_1fr] md:gap-2 lg:grid-cols-[220px_1fr] lg:gap-4">
//       <button
//         className="flex items-center p-1 bg-gray-100 md:hidden" // 버튼에 패딩 추가
//         onClick={onToggleNav}
//       >
//         {navShow ? (
//           <Icons.leftClose className="align-middle" />
//         ) : (
//           <Icons.leftOpen className="align-middle" />
//         )}
//         <span className="ml-2 text-lg">{navShow ? '목차 닫기' : '문서 목차'}</span>
//       </button>
//       <aside
//         style={{ display: navShow ? 'block' : 'none' }}
//         className="fixed top-30 z-30 h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r py-6 pr-2 bg-white bg-opacity-90 dark:bg-gray-950 md:sticky md:block lg:py-10 md:hidden"
//       >
//         <DocsSidebarNav items={docsConfig.sidebarNav} onClose={onToggleNav} />
//       </aside>

//       <aside className="hidden md:block">
//         <DocsSidebarNav items={docsConfig.sidebarNav} />
//       </aside>
//       {children}
//     </div>
//   )
// }
