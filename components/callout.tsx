import { cn } from '@/lib/utils'

import { Info } from 'lucide-react'

interface CalloutProps {
  icon?: string
  children?: React.ReactNode
  type?: 'default' | 'warning' | 'danger' | 'page' | 'app'
}

export function Callout({ children, icon, type = 'default', ...props }: CalloutProps) {
  return (
    <div
      className={cn({
        'my-1 items-start border p-2 overflow-hidden shadow-md': type !== 'page' && type !== 'app',
        'border-red-900 bg-red-50 border-l-4 rounded-md': type === 'danger',
        'border-yellow-900 bg-yellow-50 border-l-4 rounded-md': type === 'warning',
        'border-none shadow-none p-1 my-1': type === 'page' || type === 'app',
        'bg-orange-50': type === 'page',
        'bg-green-50': type === 'app',
      })}
      {...props}
    >
      {icon && (
        <span
          className={cn('mr-0 text-2xl', {
            'ml-0 mt-0 text-gray-400': type === 'page' || type === 'app',
          })}
        >
          <div className="flex items-center">
            <span className="p-1 mr-0">
              <Info />
            </span>
            <span>{icon}</span>
          </div>
        </span>
      )}
      <div className="mb-0">{children}</div>
    </div>
  )
}
