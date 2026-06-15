import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import showcasesData from '@/data/showcasesData'
import ExperimentNarrative from '@/components/showcases/narrative/ExperimentNarrative'
import { genPageMetadata } from 'app/seo'

// 실험 서사형 인트로 — SSG. 내러티브가 있는 슬러그만 사전 생성(나머지 실험 카드는 정적 데모로 직행).
// dynamicParams=false → 목록의 다른 실험 카드는 여전히 정적 데모(/showcases/{slug}/index.html)로 직행.
const NARRATIVE_SLUGS = ['aura-one', 'vanta-ev', 'ledgr']

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
  return genPageMetadata({ title: `${s.title} — 실험`, description: s.blurb })
}

export default async function ExperimentNarrativePage(props: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await props.params
  const decoded = decodeSlug(slug)
  const s = showcasesData.find((d) => d.slug === decoded)
  if (!s || s.tier !== 'experiment' || !NARRATIVE_SLUGS.includes(decoded)) notFound()

  return <ExperimentNarrative slug={decoded} title={s.title} demoHref={s.href} />
}
