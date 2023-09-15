import { cn } from '@/lib/utils'

interface CalloutProps {
  icon?: string
  children?: React.ReactNode
  type?: 'default' | 'warning' | 'danger' | 'page' | 'app'
}

export function Callout({ children, icon, type = 'default', ...props }: CalloutProps) {
  return (
    <div
      className={cn({
        'my-4 items-start border p-4 overflow-hidden shadow-md': type !== 'page' && type !== 'app',
        'border-red-900 bg-red-50 border-l-4 rounded-md': type === 'danger',
        'border-yellow-900 bg-yellow-50 border-l-4 rounded-md': type === 'warning',
        'border-none shadow-none p-1 my-2': (type === 'page' || type === 'app'),
        'bg-orange-50': type === 'page',
        'bg-green-50': type === 'app',
      })}
      {...props}
    >
      {icon && (
        <span 
          className={cn("mr-4 text-2xl", {
            'ml-2 text-gray-400': (type === 'page' || type === 'app')
          })}
        >
          {icon}
        </span>
      )}
      <div>{children}</div>
    </div>
  )
}
