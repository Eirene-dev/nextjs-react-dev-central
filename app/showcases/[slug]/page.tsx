import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import showcasesData from '@/data/showcasesData'
import ShowcaseNarrative from '@/components/showcases/narrative/ShowcaseNarrative'
import { genPageMetadata } from 'app/seo'

// 쇼케이스 서사형 상세 — SSG. narrative 를 가진 슬러그만 사전 생성(실험·실물 공통).
// 목록은 데이터에서 파생 — 손유지 목록을 따로 두지 않는다(ShowcaseNarrative 의 REGISTRY 와 짝).
// dynamicParams=false → narrative 없는 실험 카드는 여전히 정적 데모(/showcases/{slug}/index.html)로 직행.
const NARRATIVE_SLUGS = showcasesData.filter((s) => s.narrative).map((s) => s.slug)

// 브레드크럼·메타데이터에 쓰는 틀 라벨.
const TIER_LABEL = { built: '실물', experiment: '실험' } as const

export const dynamicParams = false
export const generateStaticParams = () => NARRATIVE_SLUGS.map((slug) => ({ slug }))

function decodeSlug(s: string): string {
  try {
    return decodeURIComponent(s)
  } catch {
    return s
  }
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await props.params
  const s = showcasesData.find((d) => d.slug === decodeSlug(slug))
  if (!s) return {}
  return genPageMetadata({ title: `${s.title} — ${TIER_LABEL[s.tier]}`, description: s.blurb })
}

export default async function ShowcaseNarrativePage(props: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await props.params
  const decoded = decodeSlug(slug)
  const s = showcasesData.find((d) => d.slug === decoded)
  if (!s || !s.narrative || !NARRATIVE_SLUGS.includes(decoded)) notFound()

  // 실험은 정적 데모 경로, 실물은 외부 운영 URL로 진입한다.
  const demoHref = s.tier === 'built' ? s.url : s.href

  return <ShowcaseNarrative slug={decoded} title={s.title} demoHref={demoHref} />
}
