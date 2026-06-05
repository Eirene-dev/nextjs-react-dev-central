// scripts/preview-qa.mjs — Vercel 프리뷰 런타임(클라이언트 렌더) 검수
// 정적 페치로 안 잡히는 것: mermaid SVG, kbar 검색, 라이트/다크 토글, giscus iframe
// 사용: node scripts/preview-qa.mjs <preview-url>
import puppeteer from 'puppeteer'

const U = process.argv[2]
if (!U) { console.error('usage: node scripts/preview-qa.mjs <url>'); process.exit(2) }

const results = []
const ok = (name, pass, detail = '') => { results.push({ name, pass, detail }); console.log(`${pass ? '✓' : '✗'} ${name}${detail ? ' — ' + detail : ''}`) }

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] })
try {
  const page = await browser.newPage()
  page.setDefaultTimeout(30000)
  await page.setViewport({ width: 1280, height: 900 })

  // 1) mermaid: <MermaidChart> → .mermaid 컨테이너에 SVG 가 클라이언트 렌더되는가
  try {
    await page.goto(`${U}/blog/web-dev/web-rendering-understanding`, { waitUntil: 'networkidle2' })
    await page.waitForSelector('.mermaid svg', { timeout: 25000 })
    const svgCount = await page.$$eval('.mermaid svg', els => els.length)
    ok('mermaid SVG 렌더', svgCount > 0, `${svgCount} svg`)
  } catch (e) { ok('mermaid SVG 렌더', false, String(e).slice(0, 80)) }

  // 2) 라이트/다크 토글: html.class 가 바뀌는가
  try {
    await page.goto(`${U}/`, { waitUntil: 'networkidle2' })
    await page.waitForSelector('button[aria-label="Toggle Dark Mode"]')
    const before = await page.$eval('html', el => el.className)
    await page.click('button[aria-label="Toggle Dark Mode"]')
    await new Promise(r => setTimeout(r, 500))
    const after = await page.$eval('html', el => el.className)
    const changed = before !== after && (after.includes('dark') || before.includes('dark'))
    ok('라이트/다크 토글', changed, `'${before}' → '${after}'`)
  } catch (e) { ok('라이트/다크 토글', false, String(e).slice(0, 80)) }

  // 3) kbar 검색(Cmd+K / 검색버튼): 모달 열림 + 인덱스 검색 결과 노출
  try {
    await page.goto(`${U}/`, { waitUntil: 'networkidle2' })
    await page.waitForSelector('button[aria-label="Search"]')
    await page.click('button[aria-label="Search"]')
    await page.waitForSelector('input', { visible: true, timeout: 8000 })
    // kbar 검색 input 에 입력 → 알려진 글 제목 일부가 결과로 뜨는지
    await page.keyboard.type('서버', { delay: 20 })
    await new Promise(r => setTimeout(r, 1200))
    const bodyText = await page.evaluate(() => document.body.innerText)
    const hasResults = /서버|Server|렌더|컴포넌트|Next/i.test(bodyText)
    ok('kbar 검색 동작', hasResults, hasResults ? '검색 결과 노출 확인' : '결과 텍스트 미검출')
  } catch (e) { ok('kbar 검색 동작', false, String(e).slice(0, 80)) }

  // 4) giscus 댓글 iframe 로드(블로그 상세, 프리뷰 origin 기준)
  try {
    await page.goto(`${U}/blog/web-design/styling-in-nextjs`, { waitUntil: 'networkidle2' })
    await page.waitForSelector('iframe.giscus-frame, iframe[src*="giscus"]', { timeout: 25000 })
    const giscusSrc = await page.$eval('iframe.giscus-frame, iframe[src*="giscus"]', el => el.src)
    ok('giscus 댓글 iframe 로드', !!giscusSrc, giscusSrc.slice(0, 60))
  } catch (e) { ok('giscus 댓글 iframe 로드', false, String(e).slice(0, 80)) }

  // 5) 보너스: 다크모드 가독성/이미지 — 아카이브 docs 페이지 이미지가 실제 로드되는가(naturalWidth>0)
  try {
    await page.goto(`${U}/docs/getting-started`, { waitUntil: 'networkidle2' })
    const imgOk = await page.evaluate(() => {
      const imgs = [...document.querySelectorAll('img')]
      if (!imgs.length) return 'no-img'
      return imgs.some(i => i.naturalWidth > 0) ? 'loaded' : 'broken'
    })
    ok('docs 이미지 실제 로드', imgOk === 'loaded' || imgOk === 'no-img', imgOk)
  } catch (e) { ok('docs 이미지 실제 로드', false, String(e).slice(0, 80)) }

} finally {
  await browser.close()
}

const failed = results.filter(r => !r.pass)
console.log(`\n=== ${results.length - failed.length}/${results.length} 통과 ===`)
process.exit(failed.length ? 1 : 0)
