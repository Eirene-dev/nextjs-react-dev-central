'use client'

import { Mermaid } from 'mdx-mermaid/lib/Mermaid'

const MermaidChart = ({ children }) => {
  return (
    <div>
      <Mermaid chart={children} />
    </div>
  )
}

export default MermaidChart
