// 문서 임베딩 사전계산 — ITEMS 각 항목을 embedContent 로 임베딩해 src/embeddings.json 에 기록.
// ★ 키는 환경변수로만(하드코딩 0): GEMINI_API_KEY=... node scripts/embed.mjs
// ★ 런타임(src/gemini.js)과 반드시 동일 모델(gemini-embedding-001). 모델명을 결과에 기록.
import { writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { ITEMS } from '../src/items.js'

const MODEL = 'gemini-embedding-001'
const KEY = process.env.GEMINI_API_KEY
if (!KEY) {
  console.error('GEMINI_API_KEY 미설정. 예) GEMINI_API_KEY=... node scripts/embed.mjs')
  process.exit(1)
}
const ep = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:embedContent?key=${encodeURIComponent(KEY)}`

const vectors = {}
for (const it of ITEMS) {
  const res = await fetch(ep, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ model: `models/${MODEL}`, content: { parts: [{ text: `${it.title}\n${it.body}` }] } }),
  })
  if (!res.ok) { console.error(`실패 ${it.id}: ${res.status}`); process.exit(1) }
  const data = await res.json()
  vectors[it.id] = data.embedding.values
  console.log(`✓ ${it.id} (${vectors[it.id].length}d)`)
}

const out = { model: MODEL, dims: vectors[ITEMS[0].id]?.length || 0, count: ITEMS.length, vectors }
const dst = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'embeddings.json')
writeFileSync(dst, JSON.stringify(out))
console.log(`\n저장: src/embeddings.json (모델 ${MODEL}, ${out.dims}d × ${out.count})`)
