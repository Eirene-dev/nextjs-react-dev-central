import { allEssays } from '@/lib/content'
import { MDXLayoutRenderer } from '@/components/MDXContent'
import { components } from '@/components/MDXComponents'
import Link from '@/components/Link'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { genPageMetadata } from 'app/seo'

export const generateStaticParams = async () => allEssays.map((e) => ({ slug: e.slug.split('/') }))

export async function generateMetadata(props: {
  params: Promise<{ slug: string[] }>
}): Promise<Metadata | undefined> {
  const params = await props.params
  const slug = decodeURI(params.slug.join('/'))
  const post = allEssays.find((e) => e.slug === slug)
  if (!post) return
  return genPageMetadata({ title: post.title, description: post.summary || post.title })
}

const ymd = (d: string | number) => {
  const dt = new Date(d)
  return `${dt.getFullYear()}.${String(dt.getMonth() + 1).padStart(2, '0')}.${String(
    dt.getDate()
  ).padStart(2, '0')}`
}

export default async function EssayPage(props: { params: Promise<{ slug: string[] }> }) {
  const params = await props.params
  const slug = decodeURI(params.slug.join('/'))
  const post = allEssays.find((e) => e.slug === slug)
  if (!post) return notFound()

  return (
    <article className="mx-auto max-w-[720px] py-12">
      <header className="mb-8">
        <Link href="/essays" className="text-sm font-semibold text-coral-2 hover:text-coral">
          ← Essays
        </Link>
        <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-ink">
          {post.title}
        </h1>
        <time className="mt-3 block font-mono text-sm text-ink-2">{ymd(post.date)}</time>
      </header>
      <div className="prose max-w-none dark:prose-invert">
        <MDXLayoutRenderer code={post.body.code} components={components} toc={post.toc} />
      </div>
    </article>
  )
}
