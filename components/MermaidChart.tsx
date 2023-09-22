'use client'

import { Mermaid } from 'mdx-mermaid/lib/Mermaid'

const MermaidChart = ({ children }) => {
  return (
    <div className="justify-center fill">
      <Mermaid chart={children} />
    </div>
  )
}

export default MermaidChart
