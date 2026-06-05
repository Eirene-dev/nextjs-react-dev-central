import { allAuthors, type Authors } from '@/lib/content'
import { MDXLayoutRenderer } from '@/components/MDXContent'
import { components } from '@/components/MDXComponents'
import projectsData from '@/data/projectsData'
import { genPageMetadata } from 'app/seo'
import Image from 'next/image'

export const metadata = genPageMetadata({ title: 'About' })

export default async function AboutPage() {
  const author = allAuthors.find((a) => a.slug === 'default') as Authors

  return (
    <div className="py-12">
      <header className="mb-10 flex flex-col items-center gap-4 text-center">
        {author.avatar && (
          <Image
            src={author.avatar}
            alt={author.name}
            width={120}
            height={120}
            className="rounded-full"
          />
        )}
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-ink">{author.name}</h1>
          {author.occupation && <p className="mt-2 text-ink-2">{author.occupation}</p>}
        </div>
      </header>

      <div className="prose mx-auto max-w-[680px] dark:prose-invert">
        <MDXLayoutRenderer code={author.body.code} components={components} />
      </div>

      <section className="mx-auto mt-16 max-w-[820px]">
        <h2 className="mb-6 text-2xl font-extrabold tracking-tight text-ink">
          Things I&apos;ve built
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {projectsData.map((p) => (
            <a
              key={p.title}
              href={p.href}
              className="rounded-2xl border border-line bg-surface-2 p-5 transition hover:-translate-y-0.5 hover:border-coral-soft hover:shadow-soft"
            >
              <h3 className="font-bold tracking-tight text-ink">{p.title}</h3>
              <p className="mt-2 line-clamp-3 text-sm text-ink-2">{p.description}</p>
            </a>
          ))}
        </div>
      </section>
    </div>
  )
}
