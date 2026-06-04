// scripts/extract-golden.mjs
// Phase 0 안전망: 현재(Contentlayer) 빌드 산출물에서 "골든 매니페스트"를 추출한다.
// Velite 전환 후 이 매니페스트를 1:1 재현하는지 비교(compare-golden.mjs)해
// "기존 URL 동일 해석" 수용 기준을 기계적으로 증명한다.
//
// 선행: `npx contentlayer build` (또는 next build)로 .contentlayer/generated 가 최신이어야 한다.
// 사용: node scripts/extract-golden.mjs

import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs'
import path from 'path'
import {
  allBlogs,
  allDocs,
  allExamples,
  allLevelups,
  allAuthors,
} from '../.contentlayer/generated/index.mjs'

const OUT_DIR = 'docs/golden'

// 문서 1건에서 URL 해석에 영향을 주는 필드만 안정적으로 뽑는다.
const pick = (d) => ({
  path: d.path, // sitemap이 ${siteUrl}/${path} 로 사용 (예: blog/nextjs/foo)
  slug: d.slug, // 상세 라우트 매칭/generateStaticParams 에 사용 (예: nextjs/foo)
  draft: d.draft === true, // 정규화(undefined -> false)
  tags: Array.isArray(d.tags) ? [...d.tags].sort() : [],
})

// generateStaticParams 가 만들어내는 정적 경로 세그먼트 (page.tsx: p.slug.split('/'))
// 주의: 현재 코드는 draft 포함 전체를 정적 생성한다 (draft 제외 아님).
const staticParams = (arr) =>
  arr
    .map((d) => d.slug.split('/').join('/'))
    .sort()

const sortByPath = (a, b) => a.path.localeCompare(b.path)

const collections = {
  blog: allBlogs.map(pick).sort(sortByPath),
  docs: allDocs.map(pick).sort(sortByPath),
  example: allExamples.map(pick).sort(sortByPath),
  levelup: allLevelups.map(pick).sort(sortByPath),
}

const authors = allAuthors
  .map((a) => ({ slug: a.slug, path: a.path }))
  .sort(sortByPath)

// 빌드 부산물(이미 생성됨)도 골든에 포함
const tagData = existsSync('app/tag-data.json')
  ? JSON.parse(readFileSync('app/tag-data.json', 'utf8'))
  : null

const searchIndex = existsSync('public/search.json')
  ? JSON.parse(readFileSync('public/search.json', 'utf8'))
  : null

const manifest = {
  generatedFrom: 'contentlayer',
  counts: {
    blog: collections.blog.length,
    docs: collections.docs.length,
    example: collections.example.length,
    levelup: collections.levelup.length,
    authors: authors.length,
    // 생성 정적 라우트 수 (draft 포함, 현재 동작과 동일)
    staticRoutes: {
      blog: collections.blog.length,
      docs: collections.docs.length,
      example: collections.example.length,
      levelup: collections.levelup.length,
    },
    tagKeys: tagData ? Object.keys(tagData).length : null,
    searchEntries: searchIndex ? searchIndex.length : null,
  },
  // draft 분포(초안 노출/누락 회귀 감지용)
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
  // tag-data.json / search.json 의 키 스키마(형태) 스냅샷
  tagData,
  searchSchema: searchIndex && searchIndex[0] ? Object.keys(searchIndex[0]).sort() : null,
}

mkdirSync(OUT_DIR, { recursive: true })
writeFileSync(path.join(OUT_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2))

console.log('Golden manifest written to', path.join(OUT_DIR, 'manifest.json'))
console.log('counts:', JSON.stringify(manifest.counts))
console.log('draftCounts:', JSON.stringify(manifest.draftCounts))
