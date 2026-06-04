import * as runtime from 'react/jsx-runtime'
import type { MDXComponents } from 'mdx/types'

// Velite 가 컴파일한 MDX(function-body)를 실행하는 렌더러.
// contentlayer + pliny 의 MDXLayoutRenderer 를 대체한다(동일 이름/시그니처로 import 만 교체).
//
// 컴파일 코드는 arguments[0] 로 jsx 런타임을 받고 { default: MDXContent } 를 반환한다.
// 일부 MDX 는 ESM import 를 포함 → function-body 에서 `await import(...)` 로 컴파일되므로
// 일반 Function 이 아닌 AsyncFunction 으로 실행해야 한다(렌더러를 async 서버 컴포넌트로).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor as new (
  body: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => (scope: Record<string, unknown>) => Promise<{ default: React.ComponentType<any> }>

// use* 네이밍을 피해 hooks 규칙 오탐 방지(실제 훅 아님).
const getMDXComponent = async (code: string) => {
  const fn = new AsyncFunction(code)
  return (await fn({ ...runtime })).default
}

interface MDXProps {
  code: string
  components?: MDXComponents
  // MDX 본문에서 props.toc 등으로 접근하는 추가 prop 전달용
  [key: string]: unknown
}

export async function MDXLayoutRenderer({ code, components, ...rest }: MDXProps) {
  const Component = await getMDXComponent(code)
  return <Component components={components} {...rest} />
}

export default MDXLayoutRenderer
