// scripts/extract-golden-velite.mjs
// Velite 출력(.velite/*.json)에서 골든과 동일 구조의 매니페스트를 추출 → docs/golden/manifest.velite.json
// 선행: `velite build` 로 .velite/*.json + app/tag-data.json + public/search.json 생성.
// 사용: node scripts/extract-golden-velite.mjs

import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'fs'
import path from 'path'

const read = (p) => JSON.parse(readFileSync(p, 'utf8'))
const allBlogs = read('.velite/allBlogs.json')
const allDocs = read('.velite/allDocs.json')
const allExamples = read('.velite/allExamples.json')
const allLevelups = read('.velite/allLevelups.json')
const allAuthors = read('.velite/allAuthors.json')

const pick = (d) => ({
  path: d.path,
  slug: d.slug,
  draft: d.draft === true,
  tags: Array.isArray(d.tags) ? [...d.tags].sort() : [],
})
const staticParams = (arr) => arr.map((d) => d.slug.split('/').join('/')).sort()
const sortByPath = (a, b) => a.path.localeCompare(b.path)

const collections = {
  blog: allBlogs.map(pick).sort(sortByPath),
  docs: allDocs.map(pick).sort(sortByPath),
  example: allExamples.map(pick).sort(sortByPath),
  levelup: allLevelups.map(pick).sort(sortByPath),
}
const authors = allAuthors.map((a) => ({ slug: a.slug, path: a.path })).sort(sortByPath)

const tagData = existsSync('app/tag-data.json') ? read('app/tag-data.json') : null
const searchIndex = existsSync('public/search.json') ? read('public/search.json') : null

const manifest = {
  generatedFrom: 'velite',
  counts: {
    blog: collections.blog.length,
    docs: collections.docs.length,
    example: collections.example.length,
    levelup: collections.levelup.length,
    authors: authors.length,
    staticRoutes: {
      blog: collections.blog.length,
      docs: collections.docs.length,
      example: collections.example.length,
      levelup: collections.levelup.length,
    },
    tagKeys: tagData ? Object.keys(tagData).length : null,
    searchEntries: searchIndex ? searchIndex.length : null,
  },
  draftCounts: Object.fromEntries(
    Object.entries(collections).map(([k, v]) => [k, v.filter((d) => d.draft).length])
  ),
  collections,
  authors,
  staticParams: {
    blog: staticParams(allBlogs),
    docs: staticParams(allDocs),
    example: staticParams(allExamples),
    levelup: staticParams(allLevelups),
  },
  tagData,
  searchSchema: searchIndex && searchIndex[0] ? Object.keys(searchIndex[0]).sort() : null,
}

mkdirSync('docs/golden', { recursive: true })
writeFileSync(path.join('docs/golden', 'manifest.velite.json'), JSON.stringify(manifest, null, 2))
console.log('Velite manifest written to docs/golden/manifest.velite.json')
console.log('counts:', JSON.stringify(manifest.counts))
console.log('draftCounts:', JSON.stringify(manifest.draftCounts))
