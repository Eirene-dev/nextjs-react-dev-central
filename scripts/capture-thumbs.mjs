// 데모 썸네일 캡처 — public/showcases/{slug} 를 정적 서빙 후 1280x860 스크린샷.
// 사용: node scripts/capture-thumbs.mjs docent relay sema
import { createServer } from 'http'
import { readFile } from 'fs/promises'
import { join, extname } from 'path'
import puppeteer from 'puppeteer'

const slugs = process.argv.slice(2)
if (!slugs.length) { console.error('슬러그를 지정하세요'); process.exit(1) }

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

for (const slug of slugs) {
  await page.goto(`http://localhost:${port}/showcases/${slug}/index.html`, { waitUntil: 'networkidle0' })
  await new Promise((r) => setTimeout(r, 700))
  await page.screenshot({ path: `public/static/showcases/${slug}.png` })
  console.log(`✓ ${slug}.png`)
}

await browser.close()
server.close()
