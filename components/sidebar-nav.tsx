'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { SidebarNavItem } from 'types'
import { cn } from '@/lib/utils'
import { useState } from 'react'

export interface DocsSidebarNavProps {
  items: SidebarNavItem[]
  onClose?: () => void
}

interface DocsSidebarNavItemsProps {
  items: SidebarNavItem[]
  pathname: string | null
  expanded: string[]
  handleToggle: (title: string) => void
  onClose?: () => void
}

export function DocsSidebarNav({ items, onClose }: DocsSidebarNavProps) {
  const [expanded, setExpanded] = useState<string[]>([])
  const pathname = usePathname()

  const handleToggle = (title: string) => {
    setExpanded((prev: string[]) =>
      prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]
    )
  }

  return items.length ? (
    <div className="w-full">
      {items.map((item, index) => (
        <div key={index} className={cn('pb-3')}>
          <button
            className="px-2 py-1 mb-1 text-sm font-medium rounded-md cursor-pointer"
            onClick={() => handleToggle(item.title)}
          >
            [ {item.title} ]
          </button>

          {expanded.includes(item.title) && item.items ? (
            <DocsSidebarNavItems
              items={item.items}
              pathname={pathname}
              expanded={expanded}
              handleToggle={handleToggle}
              onClose={onClose}
            />
          ) : null}
        </div>
      ))}
    </div>
  ) : null
}

export function DocsSidebarNavItems({
  items,
  pathname,
  expanded,
  handleToggle,
  onClose,
}: DocsSidebarNavItemsProps) {
  return items?.length ? (
    <div className="grid grid-flow-row text-sm auto-rows-max">
      {items.map((item, index) => {
        if (item.items) {
          return (
            <div key={index} className="pb-2">
              <button
                className="px-2 py-1 mb-1 text-sm font-medium rounded-md cursor-pointer"
                onClick={() => handleToggle(item.title)}
              >
                + {item.title}
              </button>

              {expanded.includes(item.title) && item.items ? (
                <DocsSidebarNavItems
                  items={item.items}
                  pathname={pathname}
                  expanded={expanded}
                  handleToggle={handleToggle}
                  onClose={onClose}
                />
              ) : null}
            </div>
          )
        }

        return !item.disabled && item.href ? (
          <Link
            key={index}
            href={item.href}
            className={cn('flex w-full items-center rounded-md p-2 hover:underline', {
              'bg-muted': pathname === item.href,
            })}
            target={item.external ? '_blank' : ''}
            rel={item.external ? 'noreferrer' : ''}
            onClick={onClose} // 여기에 onClose 함수를 추가합니다.
          >
            - {item.title}
          </Link>
        ) : (
          <span
            key={index}
            className="flex items-center w-full p-2 rounded-md cursor-not-allowed opacity-60"
          >
            - {item.title}
          </span>
        )
      })}
    </div>
  ) : null
}
