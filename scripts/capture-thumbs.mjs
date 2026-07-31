// 쇼케이스 썸네일 캡처 — 1280x860 스크린샷을 public/static/showcases/{slug}.png 로.
// 실험(로컬): public/showcases/{slug} 를 정적 서빙 후 캡처.
//   node scripts/capture-thumbs.mjs docent relay sema
// 실물(외부): slug=URL 형태로 주면 그 URL을 직접 캡처(뷰포트·대기·출력 규약 동일).
//   node scripts/capture-thumbs.mjs dodream=https://dodream-showcase.vercel.app/
import { createServer } from 'http'
import { readFile } from 'fs/promises'
import { join, extname } from 'path'
import puppeteer from 'puppeteer'

const args = process.argv.slice(2)
if (!args.length) { console.error('슬러그를 지정하세요'); process.exit(1) }

// "slug" → 로컬 데모, "slug=https://..." → 외부 URL.
const targets = args.map((a) => {
  const i = a.indexOf('=')
  return i === -1 ? { slug: a, url: null } : { slug: a.slice(0, i), url: a.slice(i + 1) }
})

const root = join(process.cwd(), 'public')
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml' }

const server = createServer(async (req, res) => {
  try {
    let p = decodeURIComponent(req.url.split('?')[0])
    if (p.endsWith('/')) p += 'index.html'
    const buf = await readFile(join(root, p))
    res.writeHead(200, { 'content-type': MIME[extname(p)] || 'application/octet-stream' })
    res.end(buf)
  } catch { res.writeHead(404); res.end('nf') }
})

await new Promise((r) => server.listen(0, r))
const port = server.address().port
const browser = await puppeteer.launch({ args: ['--no-sandbox'] })
const page = await browser.newPage()
await page.setViewport({ width: 1280, height: 860, deviceScaleFactor: 1 })

for (const { slug, url } of targets) {
  await page.goto(url ?? `http://localhost:${port}/showcases/${slug}/index.html`, { waitUntil: 'networkidle0' })
  await new Promise((r) => setTimeout(r, 700))
  await page.screenshot({ path: `public/static/showcases/${slug}.png` })
  console.log(`✓ ${slug}.png`)
}

await browser.close()
server.close()
