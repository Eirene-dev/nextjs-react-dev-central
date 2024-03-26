'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { SidebarNavItem } from 'types'
import { cn } from '@/lib/utils'
import { useState } from 'react'

import { ChevronRight, ChevronDown, Plus, Minus, ChevronsRight } from 'lucide-react'

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
  isButtonVisible: boolean
}

export function DocsSidebarNav({ items, onClose }: DocsSidebarNavProps) {
  const [expanded, setExpanded] = useState<string[]>([])
  const pathname = usePathname()
  const [isButtonVisible, setIsButtonVisible] = useState(true) // 버튼의 보임/안 보임 상태

  const handleToggle = (title: string) => {
    setExpanded((prev: string[]) =>
      prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]
    )

    // 버튼을 클릭하면 3초 후에 버튼을 숨기는 타이머 설정
    setTimeout(() => {
      setIsButtonVisible(false)
    }, 3000)
  }

  return items.length ? (
    <div className="w-full">
      {items.map((item, index) => (
        <div key={index} className={cn('pb-3')}>
          <div className="flex items-center">
            <button
              className="px-0 py-1 text-lg font-medium rounded-md cursor-pointer md:text-sm"
              onClick={() => handleToggle(item.title)}
            >
              {expanded.includes(item.title) ? (
                <ChevronDown size={18} strokeWidth={1} />
              ) : (
                <ChevronRight size={18} strokeWidth={1} />
              )}
            </button>
            {isButtonVisible && (
              <button
                className="px-0 py-1 text-lg font-medium rounded-md cursor-pointer md:text-sm"
                onClick={() => handleToggle(item.title)}
              >
                {expanded.includes(item.title) ? (
                  <span className="inline-block px-1 py-0 text-xs text-pink-600 bg-gray-100 rounded-md">
                    축소
                  </span>
                ) : (
                  <span className="inline-block px-1 py-0 text-xs text-pink-600 bg-white border border-pink-600 rounded-md">
                    확대
                  </span>
                )}
              </button>
            )}
            {item.href ? (
              <Link
                href={item.href}
                className={cn(
                  'text-lg md:text-sm flex items-center rounded-md p-2 hover:underline',
                  {
                    'bg-muted': pathname === item.href,
                  }
                )}
                target={item.external ? '_blank' : ''}
                rel={item.external ? 'noreferrer' : ''}
                onClick={onClose}
              >
                <span className="font-semibold text-pink-600">{item.title}</span>
              </Link>
            ) : (
              <span className="flex items-center p-2 text-lg rounded-md md:text-sm">
                [ {item.title} ]
              </span>
            )}
          </div>

          {expanded.includes(item.title) && item.items ? (
            <DocsSidebarNavItems
              items={item.items}
              pathname={pathname}
              expanded={expanded}
              handleToggle={handleToggle}
              onClose={onClose}
              isButtonVisible={isButtonVisible}
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
  isButtonVisible,
}: DocsSidebarNavItemsProps) {
  return items?.length ? (
    <div className="grid grid-flow-row text-lg md:text-sm auto-rows-max">
      {items.map((item, index) => {
        if (item.items) {
          return (
            <div key={index} className="pb-2">
              <div className="flex items-center">
                <button
                  className="px-2 py-1 text-lg font-medium rounded-md cursor-pointer md:text-sm"
                  onClick={() => handleToggle(item.title)}
                >
                  {expanded.includes(item.title) ? (
                    <Minus size={13} strokeWidth={1} />
                  ) : (
                    <Plus size={13} strokeWidth={1} />
                  )}
                </button>
                {isButtonVisible && (
                  <button
                    className="px-0 py-1 text-lg font-medium rounded-md cursor-pointer md:text-sm"
                    onClick={() => handleToggle(item.title)}
                  >
                    {expanded.includes(item.title) ? (
                      <span className="inline-block px-1 py-0 text-xs text-pink-600 bg-gray-100 rounded-md">
                        축소
                      </span>
                    ) : (
                      <span className="inline-block px-1 py-0 text-xs text-pink-600 bg-white border border-pink-600 rounded-md">
                        확대
                      </span>
                    )}
                  </button>
                )}
                {item.href ? (
                  <Link
                    href={item.href}
                    className={cn(
                      'text-lg md:text-sm flex items-center rounded-md p-1 hover:underline',
                      {
                        'bg-muted': pathname === item.href,
                      }
                    )}
                    target={item.external ? '_blank' : ''}
                    rel={item.external ? 'noreferrer' : ''}
                    onClick={onClose}
                  >
                    <span className="font-semibold text-pink-400">{item.title} </span>
                  </Link>
                ) : (
                  <span className="flex items-center p-1 text-lg rounded-md md:text-sm">
                    [ {item.title} ]
                  </span>
                )}
              </div>
              {expanded.includes(item.title) && item.items ? (
                <DocsSidebarNavItems
                  items={item.items}
                  pathname={pathname}
                  expanded={expanded}
                  handleToggle={handleToggle}
                  onClose={onClose}
                  isButtonVisible={isButtonVisible}
                />
              ) : null}
            </div>
          )
        }

        return !item.disabled && item.href ? (
          <Link
            key={index}
            href={item.href}
            className={cn('flex items-center w-full p-2 pl-4 rounded-md hover:underline', {
              'bg-muted': pathname === item.href,
            })}
            target={item.external ? '_blank' : ''}
            rel={item.external ? 'noreferrer' : ''}
            onClick={onClose}
          >
            <ChevronsRight size={12} strokeWidth={1} className="mr-2" /> {item.title}
          </Link>
        ) : (
          <span
            key={index}
            className="flex items-center w-full p-2 pl-4 rounded-md cursor-not-allowed opacity-60"
          >
            <ChevronsRight size={12} strokeWidth={1} className="mr-2" /> {item.title}
          </span>
        )
      })}
    </div>
  ) : null
}
