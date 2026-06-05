import booksData from '@/data/booksData'
import Link from '@/components/Link'
import Image from 'next/image'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({
  title: 'Book',
  description: '출간한 책들 — Next.js 실전 가이드와 『AI 시대, 판단하는 개발자』.',
})

export default function BookPage() {
  return (
    <div className="py-12">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-ink">Book</h1>
        <p className="mt-3 text-ink-2">출간한 책들.</p>
      </header>
      <div className="mx-auto grid max-w-[820px] gap-5 sm:grid-cols-2">
        {booksData.map((b) => (
          <Link
            key={b.title}
            href={b.href}
            className="flex flex-col gap-4 rounded-2xl border border-line bg-surface-2 p-6 transition hover:-translate-y-0.5 hover:border-coral-soft hover:shadow-soft"
          >
            <div className="flex items-center justify-between">
              <span
                className={
                  b.status === '출간'
                    ? 'rounded-full bg-coral/10 px-2.5 py-1 text-xs font-bold text-coral-2'
                    : 'rounded-full bg-ink/5 px-2.5 py-1 text-xs font-bold text-ink-2'
                }
              >
                {b.status}
              </span>
            </div>
            {b.cover && (
              <Image
                src={b.cover}
                alt={b.title}
                width={120}
                height={171}
                className="rounded-md shadow-soft"
              />
            )}
            <div>
              <h2 className="text-lg font-bold tracking-tight text-ink">{b.title}</h2>
              <p className="mt-2 text-sm text-ink-2">{b.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
