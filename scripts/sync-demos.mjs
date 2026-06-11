// 실험 데모 동기화 — demos/{slug}/ → public/showcases/{slug}/ (단방향, demos 가 source of truth).
// ★ 화이트리스트만 처리. 기존 데모(ai-assistant/storefront/landing)는 demos/ 에 원본이 없으므로
//    이 스크립트가 절대 건드리지 않는다. 전체 미러링(public 통째 삭제) 금지 — slug 폴더 단위로만.
// 타입 분기: demos/{slug}/package.json 있으면 React/Vite(npm install + build → dist 복사),
//            없으면 바닐라(폴더 그대로 복사). React 데모는 vite base:'./' 로 상대 경로 서빙.
import { cpSync, mkdirSync, existsSync, rmSync } from 'fs'
import { execSync } from 'child_process'
import { join } from 'path'

const SLUGS = [
  'drift', 'slate', 'folio', // 배치 1 — 바닐라 웹 플랫폼
  'aura-one', 'vanta-ev', 'ledgr', // 배치 2 — 바닐라 스타일 연구
  'pilot', 'canvasly', 'formig', // 배치 3 — Vite+React AI×웹(BYOA)
  'docent', 'relay', 'sema', // 배치 4 — Vite+React AI×웹 2차(BYOA)
]

let synced = 0
for (const slug of SLUGS) {
  const src = join('demos', slug)
  const dest = join('public', 'showcases', slug)
  if (!existsSync(src)) {
    console.warn(`⚠ skip: ${src} 없음`)
    continue
  }

  const isReact = existsSync(join(src, 'package.json'))
  let copyFrom = src
  if (isReact) {
    // React/Vite — 격리된 npm 프로젝트. 빌드 후 dist 를 복사(루트 yarn/berry 와 독립).
    console.log(`▸ building (React): ${src}`)
    execSync('npm install --no-audit --no-fund', { cwd: src, stdio: 'inherit' })
    execSync('npm run build', { cwd: src, stdio: 'inherit' })
    copyFrom = join(src, 'dist')
  }

  // 이 slug 의 배포 폴더만 정리 후 재복사(다른 slug 는 손대지 않음)
  if (existsSync(dest)) rmSync(dest, { recursive: true, force: true })
  mkdirSync(dest, { recursive: true })
  // 바닐라는 README 제외(소스 공개용). React 는 dist 라 README 가 애초에 없음.
  cpSync(copyFrom, dest, { recursive: true, filter: (p) => !p.endsWith('README.md') })
  console.log(`✓ synced: ${copyFrom} → ${dest}`)
  synced++
}
console.log(`\n${synced}/${SLUGS.length} 데모 동기화 완료. (화이트리스트: ${SLUGS.join(', ')})`)
