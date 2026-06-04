// scripts/compare-golden.mjs
// Phase 0 검증: 골든 매니페스트(contentlayer) vs 새 매니페스트(velite)를 비교한다.
// "기존 URL 동일 해석" + draft/태그/정적라우트 수 보존을 기계적으로 증명.
//
// 사용: node scripts/compare-golden.mjs
//   기본 비교: docs/golden/manifest.json (golden) vs docs/golden/manifest.velite.json (new)
// 불일치가 있으면 비제로 종료코드로 끝난다(CI/수동 게이트용).

import { readFileSync, existsSync } from 'fs'

const GOLDEN = process.argv[2] || 'docs/golden/manifest.json'
const NEW = process.argv[3] || 'docs/golden/manifest.velite.json'

if (!existsSync(GOLDEN) || !existsSync(NEW)) {
  console.error(`✗ manifest 없음: ${!existsSync(GOLDEN) ? GOLDEN : NEW}`)
  process.exit(2)
}

const g = JSON.parse(readFileSync(GOLDEN, 'utf8'))
const n = JSON.parse(readFileSync(NEW, 'utf8'))

const problems = []

// 1) 정렬된 문자열 배열 비교 (path|draft|tags 시그니처)
const sig = (d) => `${d.path}\tdraft=${d.draft}\ttags=[${d.tags.join(',')}]`
function diffCollection(name) {
  const gset = new Set((g.collections[name] || []).map(sig))
  const nset = new Set((n.collections[name] || []).map(sig))
  const missing = [...gset].filter((x) => !nset.has(x)) // golden엔 있는데 new에 없음
  const extra = [...nset].filter((x) => !gset.has(x)) // new에만 있음
  if (missing.length) problems.push(`[${name}] 누락 ${missing.length}건:\n   - ${missing.slice(0, 10).join('\n   - ')}`)
  if (extra.length) problems.push(`[${name}] 추가/변형 ${extra.length}건:\n   + ${extra.slice(0, 10).join('\n   + ')}`)
}

// 2) 정적 라우트(slug) 세트 비교
function diffStaticParams(name) {
  const gset = new Set(g.staticParams[name] || [])
  const nset = new Set(n.staticParams[name] || [])
  const missing = [...gset].filter((x) => !nset.has(x))
  const extra = [...nset].filter((x) => !gset.has(x))
  if (missing.length) problems.push(`[staticParams:${name}] 누락 ${missing.length}건: ${missing.slice(0, 10).join(', ')}`)
  if (extra.length) problems.push(`[staticParams:${name}] 추가 ${extra.length}건: ${extra.slice(0, 10).join(', ')}`)
}

for (const c of ['blog', 'docs', 'example', 'levelup']) {
  diffCollection(c)
  diffStaticParams(c)
}

// 3) 카운트 비교
function eqCount(label, a, b) {
  if (a !== b) problems.push(`[count:${label}] golden=${a} new=${b}`)
}
eqCount('blog', g.counts.blog, n.counts.blog)
eqCount('docs', g.counts.docs, n.counts.docs)
eqCount('example', g.counts.example, n.counts.example)
eqCount('levelup', g.counts.levelup, n.counts.levelup)
eqCount('authors', g.counts.authors, n.counts.authors)
eqCount('tagKeys', g.counts.tagKeys, n.counts.tagKeys)
eqCount('searchEntries', g.counts.searchEntries, n.counts.searchEntries)

// 4) draft 분포
for (const c of ['blog', 'docs', 'example', 'levelup']) {
  eqCount(`draft:${c}`, g.draftCounts[c], n.draftCounts[c])
}

// 5) tag-data.json 키 세트 비교 (태그 목록 보존)
if (g.tagData && n.tagData) {
  const gk = new Set(Object.keys(g.tagData))
  const nk = new Set(Object.keys(n.tagData))
  const missing = [...gk].filter((x) => !nk.has(x))
  const extra = [...nk].filter((x) => !gk.has(x))
  if (missing.length) problems.push(`[tagData] 누락 태그 ${missing.length}: ${missing.slice(0, 15).join(', ')}`)
  if (extra.length) problems.push(`[tagData] 추가 태그 ${extra.length}: ${extra.slice(0, 15).join(', ')}`)
  // 카운트 값까지 비교
  for (const k of gk) {
    if (nk.has(k) && g.tagData[k] !== n.tagData[k])
      problems.push(`[tagData:${k}] count golden=${g.tagData[k]} new=${n.tagData[k]}`)
  }
}

// 6) search.json 스키마(키 형태) 비교
if (g.searchSchema && n.searchSchema) {
  const gs = JSON.stringify(g.searchSchema)
  const ns = JSON.stringify(n.searchSchema)
  if (gs !== ns) problems.push(`[searchSchema] 불일치\n   golden=${gs}\n   new=${ns}`)
}

if (problems.length) {
  console.error(`✗ 골든 비교 실패 — ${problems.length}개 문제:\n`)
  console.error(problems.join('\n\n'))
  process.exit(1)
}

console.log('✓ 골든 비교 통과 — path/slug/draft/태그/정적라우트/search 스키마가 contentlayer와 동일')
