import 'css/tailwind.css'
import 'pliny/search/algolia.css'

import { JetBrains_Mono } from 'next/font/google'
// import { Analytics, AnalyticsConfig } from 'pliny/analytics.js'
import { SearchProvider, SearchConfig } from 'pliny/search/index.js'
import Header from '@/components/Header'
import SectionContainer from '@/components/SectionContainer'
import Footer from '@/components/Footer'
import siteMetadata from '@/data/siteMetadata'
import { ThemeProviders } from './theme-providers'
import { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
// import { SpeedInsights } from "@vercel/speed-insights/next"
import { WebVitals } from '@/app/api/analytics/web-vitals'

// 기술 라벨/코드용 모노. 본문 Pretendard 는 jsdelivr CDN(아래 head <link>)로 로드.
const jetbrains_mono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    default: siteMetadata.title,
    template: `%s | ${siteMetadata.title}`,
  },
  description: siteMetadata.description,
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: './',
    siteName: siteMetadata.title,
    images: [siteMetadata.socialBanner],
    locale: 'ko-KR',
    type: 'website',
  },
  alternates: {
    canonical: './',
    types: {
      'application/rss+xml': `${siteMetadata.siteUrl}/feed.xml`,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    title: siteMetadata.title,
    card: 'summary_large_image',
    images: [siteMetadata.socialBanner],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang={siteMetadata.language}
      className={`${jetbrains_mono.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        {/* 본문 폰트: Pretendard (한국어 가독성) — jsdelivr CDN */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css"
        />
      </head>
      <link rel="apple-touch-icon" sizes="76x76" href="/static/favicons/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/static/favicons/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/static/favicons/favicon-16x16.png" />
      <link rel="manifest" href="/static/favicons/site.webmanifest" />
      <link rel="mask-icon" href="/static/favicons/safari-pinned-tab.svg" color="#5bbad5" />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="theme-color" media="(prefers-color-scheme: light)" content="#fff" />
      <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000" />
      <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
      <body className="bg-background font-sans text-foreground antialiased">
        <ThemeProviders>
          {/* 글로벌 셸: Header/Footer 는 풀폭(자체 내부 wrap), 본문만 SectionContainer(1180px) */}
          <SearchProvider searchConfig={siteMetadata.search as SearchConfig}>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="mb-auto">
                <SectionContainer>{children}</SectionContainer>
              </main>
              <Footer />
            </div>
          </SearchProvider>
        </ThemeProviders>
        <Analytics />
        <WebVitals />
      </body>
    </html>
  )
}
