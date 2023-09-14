import 'css/prism.css'
import 'katex/dist/katex.css'

import PageTitle from '@/components/PageTitle'
import { components } from '@/components/MDXComponents'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { sortPosts, coreContent } from 'pliny/utils/contentlayer'
import { allDocs, allAuthors } from 'contentlayer/generated'
import type { Authors, Doc } from 'contentlayer/generated'
import PostSimple from '@/layouts/PostSimple'
import PostLayout from '@/layouts/PostLayout'
import PostBanner from '@/layouts/PostBanner'
import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'
import { DashboardTableOfContents } from '@/components/toc'
import { getTableOfContents } from '@/lib/toc'

const isProduction = process.env.NODE_ENV === 'production'
const defaultLayout = 'PostSimple'
const layouts = {
  PostSimple,
  PostLayout,
  PostBanner,
}

export const generateStaticParams = async () => {
  const paths = allDocs.map((p) => ({ slug: p.slug.split('/') }))

  return paths
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string[] }
}): Promise<Metadata | undefined> {
  let slug = ''
  if (params.slug) {
    slug = decodeURI(params.slug.join('/'))
  } else {
    slug = '/'
  }
  const post = allDocs.find((p) => p.slug === slug)
  const authorList = post?.authors || ['default']
  const authorDetails = authorList.map((author) => {
    const authorResults = allAuthors.find((p) => p.slug === author)
    return coreContent(authorResults as Authors)
  })
  if (!post) {
    return
  }

  const publishedAt = new Date(post.date).toISOString()
  const modifiedAt = new Date(post.lastmod || post.date).toISOString()
  const authors = authorDetails.map((author) => author.name)
  let imageList = [siteMetadata.socialBanner]
  if (post.images) {
    imageList = typeof post.images === 'string' ? [post.images] : post.images
  }
  const ogImages = imageList.map((img) => {
    return {
      url: img.includes('http') ? img : siteMetadata.siteUrl + img,
    }
  })

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      siteName: siteMetadata.title,
      locale: 'en_US',
      type: 'article',
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      url: './',
      images: ogImages,
      authors: authors.length > 0 ? authors : [siteMetadata.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
      images: imageList,
    },
  }
}

export default async function Page({ params }: { params: { slug: string[] } }) {
  let slug = ''
  if (params.slug) {
    slug = decodeURI(params.slug.join('/'))
  } else {
    slug = 'getting-started'
  }
  const sortedPosts = sortPosts(allDocs) as Doc[]
  const postIndex = sortedPosts.findIndex((p) => p.slug === slug)
  const prev = coreContent(sortedPosts[postIndex + 1])
  const next = coreContent(sortedPosts[postIndex - 1])
  const post = sortedPosts.find((p) => p.slug === slug) as Doc
  const authorList = post?.authors || ['default']
  const authorDetails = authorList.map((author) => {
    const authorResults = allAuthors.find((p) => p.slug === author)
    return coreContent(authorResults as Authors)
  })
  const mainContent = coreContent(post)
  const jsonLd = post.structuredData
  jsonLd['author'] = authorDetails.map((author) => {
    return {
      '@type': 'Person',
      name: author.name,
    }
  })

  const Layout = layouts[post.layout || defaultLayout]
  const toc = await getTableOfContents(post.body.raw)

  return (
    <>
      {isProduction && post && 'draft' in post && post.draft === true ? (
        <div className="mt-24 text-center">
          <PageTitle>
            Under Construction{' '}
            <span role="img" aria-label="roadwork sign">
              🚧
            </span>
          </PageTitle>
        </div>
      ) : (
        <>
          <main className="relative py-6 lg:gap-10 lg:py-10 xl:grid xl:grid-cols-[1fr_140px]">
            <div className="w-full min-w-0 mx-auto">
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
              />
              <Layout content={mainContent} authorDetails={authorDetails} next={next} prev={prev}>
                <MDXLayoutRenderer code={post.body.code} components={components} toc={post.toc} />
              </Layout>
            </div>
            <div className="hidden text-sm xl:block">
              <div className="sticky top-16 -mt-10 max-h-[calc(var(--vh)-4rem)] overflow-y-auto pt-10">
                <DashboardTableOfContents toc={toc} />
              </div>
            </div>
          </main>
        </>
      )}
    </>
  )
}
