import Script from 'next/script'

export default function Head() {
  return (
    <>
      <meta name="google-adsense-account" content="ca-pub-1194474024149121"></meta>
      <link rel="apple-touch-icon" sizes="76x76" href="/static/favicons/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/static/favicons/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/static/favicons/favicon-16x16.png" />
      <link rel="manifest" href="/static/favicons/site.webmanifest" />
      <link rel="mask-icon" href="/static/favicons/safari-pinned-tab.svg" color="#5bbad5" />
      <meta name="google-adsense-account" content="ca-pub-1194474024149121"></meta>
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="theme-color" media="(prefers-color-scheme: light)" content="#fff" />
      <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000" />
      <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <Script
        id="script-auto-ad"
        data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID}
        async
        strategy="lazyOnload"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
        crossOrigin="anonymous"
      />
    </>
  )
}
