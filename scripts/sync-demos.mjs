// 실험 데모 동기화 — demos/{slug}/ → public/showcases/{slug}/ (단방향, demos 가 source of truth).
// ★ 화이트리스트만 처리. 기존 데모(ai-assistant/storefront/landing)는 demos/ 에 원본이 없으므로
//    이 스크립트가 절대 건드리지 않는다. 전체 미러링(public 통째 삭제) 금지 — slug 폴더 단위로만.
import { cpSync, mkdirSync, existsSync, rmSync } from 'fs'
import { join } from 'path'

const SLUGS = ['drift', 'slate', 'folio'] // 동기화 대상(여기 없는 slug 는 안전)

let synced = 0
for (const slug of SLUGS) {
  const src = join('demos', slug)
  const dest = join('public', 'showcases', slug)
  if (!existsSync(src)) {
    console.warn(`⚠ skip: ${src} 없음`)
    continue
  }
  // 이 slug 의 배포 폴더만 정리 후 재복사(다른 slug 는 손대지 않음)
  if (existsSync(dest)) rmSync(dest, { recursive: true, force: true })
  mkdirSync(dest, { recursive: true })
  // README.md 는 소스 공개용 — 배포물에는 넣지 않는다.
  cpSync(src, dest, { recursive: true, filter: (p) => !p.endsWith('README.md') })
  console.log(`✓ synced: ${src} → ${dest}`)
  synced++
}
console.log(`\n${synced}/${SLUGS.length} 데모 동기화 완료. (화이트리스트: ${SLUGS.join(', ')})`)
