import { MetadataRoute } from 'next'
import { allBlogs, allDocs, allExamples, allLevelups } from '@/lib/content'
import { listPublishedEssays } from '@/lib/essay-drafts'
import siteMetadata from '@/data/siteMetadata'

// DB(발행 에세이) 의존 → 동적. 초안/비공개는 listPublishedEssays 가 제외.
export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = siteMetadata.siteUrl

  const essays = await listPublishedEssays()
  const essayRoutes = essays.map((e) => ({
    url: `${siteUrl}/essays/${e.slug}`,
    lastModified: e.updatedAt || e.publishedAt || undefined,
  }))
  const blogRoutes = allBlogs.map((post) => ({
    url: `${siteUrl}/${post.path}`,
    lastModified: post.lastmod || post.date,
  }))

  const docsRoutes = allDocs.map((post) => ({
    url: `${siteUrl}/${post.path}`,
    lastModified: post.lastmod || post.date,
  }))

  const exampleRoutes = allExamples.map((post) => ({
    url: `${siteUrl}/${post.path}`,
    lastModified: post.lastmod || post.date,
  }))

  const levelupRoutes = allLevelups.map((post) => ({
    url: `${siteUrl}/${post.path}`,
    lastModified: post.lastmod || post.date,
  }))

  const routes = ['', 'essays', 'blog', 'docs', 'example', 'tags', 'levelup'].map((route) => ({
    url: `${siteUrl}/${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes, ...essayRoutes, ...blogRoutes, ...docsRoutes, ...exampleRoutes, ...levelupRoutes]
}
