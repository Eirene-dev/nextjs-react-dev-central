'use client'

import { useState } from 'react'

import mdxMermaid from 'mdx-mermaid'
import { Mermaid } from 'mdx-mermaid/lib/Mermaid'

export default function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
      <Mermaid
        chart={`graph TD;
            A-->B;
            A-->C;
            B-->D;
            C-->D;
        `}
      />
    </div>
  )
}
