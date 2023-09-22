'use client'

import React, { useState } from 'react'
import { MinusSquare, PlusSquare } from 'lucide-react'

type ToggleContentProps = {
  title: string
  children: React.ReactNode
}

const ToggleContent: React.FC<ToggleContentProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="p-2 rounded-md bg-gray-50">
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center">
        {isOpen ? (
          <MinusSquare size={18} strokeWidth={2} />
        ) : (
          <PlusSquare size={18} strokeWidth={2} />
        )}
        <span className="ml-2">{isOpen ? '숨기기: ' : '자세히: '}</span>
        <span className="ml-2 font-bold">{title}</span>
      </button>
      {isOpen && <div className="mt-2 content">{children}</div>}
    </div>
  )
}

export default ToggleContent
