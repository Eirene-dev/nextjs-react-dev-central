import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function SectionContainer({ children }: Props) {
  return (
    // <section className="max-w-full px-4 mx-0 sm:px-4 xl:max-w-full xl:px-4">{children}</section>

    <section className="max-w-4xl px-4 mx-auto sm:px-2 xl:max-w-6xl xl:px-0">{children}</section>

    // <section className="max-w-3xl px-4 mx-auto sm:px-6 xl:max-w-5xl xl:px-0">{children}</section>
  )
}
