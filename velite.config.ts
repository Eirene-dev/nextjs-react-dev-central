import { defineConfig, defineCollection, s } from 'velite'
import path from 'path'
import { writeFileSync, mkdirSync } from 'fs'
import GithubSlugger from 'github-slugger'
import readingTime from 'reading-time'
// Remark/Rehype — contentlayer.config.ts 와 동일 구성
import remarkMath from 'remark-math'
import { remarkCodeTitles, remarkImgToJsx, extractTocHeadings } from 'pliny/mdx-plugins/index.js'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeKatex from 'rehype-katex'
import rehypeCitation from 'rehype-citation'
import rehypePrismPlus from 'rehype-prism-plus'
import rehypePresetMinify from 'rehype-preset-minify'

const root = process.cwd()
const siteUrl = 'https://reactnext-central.xyz'
const socialBanner = '/static/images/twitter-card.png'

// contentlayer flattenedPath/slug 규칙 재현:
//   path  = <컬렉션폴더>/<나머지> (index·확장자 제거)  ← s.path() 가 'blog/x/index' 형태로 줌
//   slug  = path 에서 첫 세그먼트 제거
const computePaths = (stem: string) => {
  const p = stem.replace(/\/index$/, '').replace(/^index$/, '')
  const slug = p.split('/').slice(1).join('/')
  return { path: p, slug, slugAsParams: slug }
}

const postFields = {
  title: s.string(),
  date: s.isodate(),
  tags: s.array(s.string()).default([]),
  lastmod: s.isodate().optional(),
  draft: s.boolean().optional(),
  summary: s.string().optional(),
  images: s.union([s.string(), s.array(s.string())]).optional(),
  authors: s.array(s.string()).optional(),
  layout: s.string().optional(),
  bibliography: s.string().optional(),
  canonicalUrl: s.string().optional(),
  // 원본/컴파일 + 파일 메타
  rawBody: s.raw(),
  code: s.mdx(),
  stem: s.path(),
}

const makePostTransform = (type: string) => (data: any, { meta }: any) => {
  const { rawBody, code, stem, ...rest } = data
  const { path: docPath, slug, slugAsParams } = computePaths(stem)
  const filePath = path.relative(path.join(root, 'data'), meta.path)
  return {
    ...rest,
    path: docPath,
    slug,
    slugAsParams,
    filePath,
    type,
    readingTime: readingTime(rawBody),
    toc: extractTocHeadings(rawBody),
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: data.title,
      datePublished: data.date,
      dateModified: data.lastmod || data.date,
      description: data.summary,
      image: data.images ? (Array.isArray(data.images) ? data.images[0] : data.images) : socialBanner,
      url: `${siteUrl}/${docPath}`,
      author: data.authors,
    },
    body: { code, raw: rawBody },
  }
}

const allBlogs = defineCollection({
  name: 'Blog',
  pattern: 'blog/**/*.mdx',
  schema: s.object(postFields).transform(makePostTransform('Blog')),
})
const allDocs = defineCollection({
  name: 'Doc',
  pattern: 'docs/**/*.mdx',
  schema: s.object(postFields).transform(makePostTransform('Doc')),
})
const allExamples = defineCollection({
  name: 'Example',
  pattern: 'example/**/*.mdx',
  schema: s.object(postFields).transform(makePostTransform('Example')),
})
const allLevelups = defineCollection({
  name: 'Levelup',
  pattern: 'levelup/**/*.mdx',
  schema: s.object(postFields).transform(makePostTransform('Levelup')),
})

const allAuthors = defineCollection({
  name: 'Authors',
  pattern: 'authors/**/*.mdx',
  schema: s
    .object({
      name: s.string(),
      avatar: s.string().optional(),
      occupation: s.string().optional(),
      company: s.string().optional(),
      email: s.string().optional(),
      twitter: s.string().optional(),
      linkedin: s.string().optional(),
      github: s.string().optional(),
      layout: s.string().optional(),
      rawBody: s.raw(),
      code: s.mdx(),
      stem: s.path(),
    })
    .transform((data: any) => {
      const { rawBody, code, stem, ...rest } = data
      const { path: docPath, slug, slugAsParams } = computePaths(stem)
      return { ...rest, path: docPath, slug, slugAsParams, body: { code, raw: rawBody } }
    }),
})

// contentlayer onSuccess 재현: app/tag-data.json (블로그 태그, draft 제외) + public/search.json (kbar)
const buildDerivedFiles = (data: any) => {
  const { allBlogs, allDocs, allExamples, allLevelups } = data

  // createTagCount(allBlogs) 동일 — 블로그 태그만, draft 제외
  const tagCount: Record<string, number> = {}
  allBlogs.forEach((file: any) => {
    if (file.tags && file.draft !== true) {
      file.tags.forEach((tag: string) => {
        const t = GithubSlugger.slug(tag)
        tagCount[t] = (tagCount[t] || 0) + 1
      })
    }
  })
  writeFileSync('./app/tag-data.json', JSON.stringify(tagCount))

  // createSearchIndex 동일 — coreContent(=body 제거) 후 blog>docs>example>levelup 순, 각 date desc 정렬
  const sortPosts = (arr: any[]) =>
    [...arr].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  const core = (d: any) => {
    const { body, ...rest } = d
    return rest
  }
  const combined = [
    ...sortPosts(allBlogs).map(core),
    ...sortPosts(allDocs).map(core),
    ...sortPosts(allExamples).map(core),
    ...sortPosts(allLevelups).map(core),
  ]
  mkdirSync('public', { recursive: true })
  writeFileSync('public/search.json', JSON.stringify(combined))
}

export default defineConfig({
  root: 'data',
  output: { data: '.velite', assets: 'public/static/velite', base: '/static/velite/', clean: false },
  collections: { allBlogs, allDocs, allExamples, allLevelups, allAuthors },
  prepare: buildDerivedFiles,
  mdx: {
    // contentlayer 파리티: 상대 링크를 로컬 에셋으로 복사하지 않음(velite 기본 true → ENOENT 방지).
    // gfm 은 velite 내장(기본 on)이라 remarkGfm 을 따로 넣지 않는다.
    copyLinkedFiles: false,
    remarkPlugins: [remarkCodeTitles, remarkMath, remarkImgToJsx],
    rehypePlugins: [
      rehypeSlug,
      rehypeAutolinkHeadings,
      rehypeKatex,
      [rehypeCitation, { path: path.join(root, 'data') }],
      [rehypePrismPlus, { defaultLanguage: 'js', ignoreMissing: true }],
      rehypePresetMinify,
    ],
  },
})
