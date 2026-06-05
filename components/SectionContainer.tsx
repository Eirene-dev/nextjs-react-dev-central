import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function SectionContainer({ children }: Props) {
  // homepage-05-final.html .wrap: max-width 1180px, 좌우 28px(px-7).
  return <section className="mx-auto max-w-[1180px] px-5 sm:px-7">{children}</section>
}
