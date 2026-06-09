import 'css/essay-reading.css'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from '@/components/Link'
import { getPublishedEssayBySlug } from '@/lib/essay-drafts'
import EssayBody from '@/components/essays/EssayBody'
import siteMetadata from '@/data/siteMetadata'

// 공개 읽기 — 발행된 글만(없거나 비공개 → 404). 색인 대상(noindex 아님).
// 읽기 컨트롤·각주는 4·5단계.
export const dynamic = 'force-dynamic'

const AUTHOR = '주민호'
const essayUrl = (slug: string) => `${siteMetadata.siteUrl}/essays/${slug}`

const fmtDate = (d: Date | string) => {
  const dt = new Date(d)
  return `${dt.getFullYear()}년 ${dt.getMonth() + 1}월 ${dt.getDate()}일`
}

// 한글 slug 는 URL 인코딩되어 도착할 수 있음 — 디코드(이미 디코드면 % 없어 무영향).
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
  const decoded = decodeSlug(slug)
  const essay = await getPublishedEssayBySlug(decoded)
  if (!essay) return {} // 비공개/없음 — 페이지에서 notFound

  const url = essayUrl(decoded)
  const description = essay.excerpt ?? undefined
  // og:image / twitter:image 는 opengraph-image.tsx(파일 컨벤션, 커밋 2)가 자동 주입.
  return {
    title: essay.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: essay.title,
      description,
      type: 'article',
      url,
      siteName: siteMetadata.title,
      publishedTime: essay.publishedAt ? new Date(essay.publishedAt).toISOString() : undefined,
      modifiedTime: essay.updatedAt ? new Date(essay.updatedAt).toISOString() : undefined,
      authors: [AUTHOR],
    },
    twitter: { card: 'summary_large_image', title: essay.title, description },
  }
}

export default async function EssayReadingPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params
  const decoded = decodeSlug(slug)
  const essay = await getPublishedEssayBySlug(decoded)
  if (!essay) notFound() // 비공개·없는 slug

  const url = essayUrl(decoded)
  // JSON-LD(BlogPosting) — published 글만. image 는 동적 OG(커밋 2 파일 컨벤션 URL).
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: essay.title,
    description: essay.excerpt ?? undefined,
    datePublished: essay.publishedAt ? new Date(essay.publishedAt).toISOString() : undefined,
    dateModified: essay.updatedAt ? new Date(essay.updatedAt).toISOString() : undefined,
    author: { '@type': 'Person', name: AUTHOR },
    image: `${url}/opengraph-image`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    publisher: { '@type': 'Organization', name: siteMetadata.title },
  }

  return (
    <div className="mx-auto min-w-0 max-w-[680px] px-5 py-12 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link href="/essays" className="text-sm font-semibold text-coral-2 hover:text-coral">
        ← 에세이
      </Link>

      <article className="essay-prose mt-8 min-w-0">
        <h1 className="text-3xl sm:text-[2.4rem]">{essay.title || '(제목 없음)'}</h1>
        {essay.publishedAt && (
          <div className="essay-meta mt-3">{fmtDate(essay.publishedAt)}</div>
        )}
        <hr className="essay-rule" />
        <div className="essay-body min-w-0">
          <EssayBody>{essay.body}</EssayBody>
        </div>
        <p className="essay-end" aria-hidden>
          ❦
        </p>
      </article>

      {/* 읽기 글꼴: 고운바탕(한글 unicode-range 청크로 브라우저가 필요분만 로드). 이 페이지에서만. */}
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Gowun+Batang:wght@400;700&display=swap"
      />
    </div>
  )
}
