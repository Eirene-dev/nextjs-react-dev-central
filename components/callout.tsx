import { cn } from '@/lib/utils'

interface CalloutProps {
  icon?: string
  children?: React.ReactNode
  type?: 'default' | 'warning' | 'danger' | 'page' | 'app'
}

export function Callout({ children, icon, type = 'default', ...props }: CalloutProps) {
  return (
    <div
      className={cn('my-6 items-start border p-4 overflow-hidden shadow-md', {
        'border-red-900 bg-red-50 border-l-4 rounded-md': type === 'danger',
        'border-yellow-900 bg-yellow-50 border-l-4 rounded-md': type === 'warning',
        'border-dashed border-gray-200 bg-orange-50': type === 'page',
        'border-dashed border-gray-200 bg-green-50': type === 'app',
      })}
      {...props}
    >
      {icon && <span className="mr-4 text-2xl">{icon}</span>}
      <div>{children}</div>
    </div>
  )
}
