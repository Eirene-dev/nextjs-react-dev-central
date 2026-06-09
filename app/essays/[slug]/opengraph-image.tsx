import { ImageResponse } from 'next/og'
import { getPublishedEssayBySlug } from '@/lib/essay-drafts'
import siteMetadata from '@/data/siteMetadata'

// 자동 OG 이미지 — 1200×630 브랜드 카드. 한글은 satori 기본 라틴 폰트로 깨지므로 Pretendard OTF 직접 제공.
// (next/og 는 woff2 미지원 → otf 사용.) published 글만 의미, 폰트 실패 시 사이트 기본 이미지로 폴백.
export const runtime = 'nodejs'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = '에세이 — ReactNext Central'

const FONT_URL =
  'https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/public/static/Pretendard-Bold.otf'

function decodeSlug(s: string): string {
  try {
    return decodeURIComponent(s)
  } catch {
    return s
  }
}

export default async function Image(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params
  const essay = await getPublishedEssayBySlug(decodeSlug(slug))
  const title = essay?.title || '에세이'
  // 설명(메타) — 카드에 맞게 길면 말줄임. 전체 OTF 로드라 한글 글자 빠짐 없음.
  const excerptRaw = (essay?.excerpt || '').trim()
  const excerpt = excerptRaw.length > 120 ? excerptRaw.slice(0, 120).trimEnd() + '…' : excerptRaw

  let fontData: ArrayBuffer | null = null
  try {
    fontData = await fetch(FONT_URL).then((r) => (r.ok ? r.arrayBuffer() : null))
  } catch {
    fontData = null
  }
  // 폰트 로드 실패 → 사이트 기본 OG 이미지로 폴백
  if (!fontData) {
    return fetch(new URL(siteMetadata.socialBanner, siteMetadata.siteUrl))
  }

  const cream = '#F4EFE6'
  const ink = '#202F42'
  const ink2 = '#4E5E72'
  const coral = '#D2583D'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: cream,
          padding: '72px 80px',
          fontFamily: 'Pretendard',
        }}
      >
        {/* 상단 브랜드 라벨 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 18, height: 18, borderRadius: 9, background: coral }} />
          <div style={{ fontSize: 28, color: ink2, letterSpacing: '-0.01em' }}>
            ReactNext Central · 에세이
          </div>
        </div>

        {/* 제목 + 설명 */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', gap: 28 }}>
          <div
            style={{
              fontSize: 68,
              lineHeight: 1.2,
              color: ink,
              letterSpacing: '-0.02em',
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
              overflow: 'hidden',
            }}
          >
            {title}
          </div>
          {excerpt && (
            <div
              style={{
                fontSize: 30,
                lineHeight: 1.5,
                color: ink2,
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 3,
                overflow: 'hidden',
              }}
            >
              {excerpt}
            </div>
          )}
        </div>

        {/* 하단 코랄 악센트 + 저자/사이트 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ width: 96, height: 6, borderRadius: 3, background: coral }} />
          <div style={{ fontSize: 26, color: ink2 }}>Pax Code · reactnext-central.xyz</div>
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: 'Pretendard', data: fontData, weight: 700, style: 'normal' }] }
  )
}
