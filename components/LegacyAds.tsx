import Script from 'next/script'

// 레거시(아카이브) 콘텐츠 전용 AdSense — /blog·/docs·/tags·/example 섹션 레이아웃에서만 사용.
// 새 영역(홈·essays·showcases·archive 인덱스·about·book·데모)에는 절대 포함하지 않는다.
// 레거시 페이지 1회 방문 시 섹션 레이아웃 하나만 적용 → 로더 스크립트 1회 로드(중복 없음).
export default function LegacyAds() {
  return (
    <>
      <Script
        id="adsbygoogle-init"
        async
        strategy="afterInteractive"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1194474024149121"
        crossOrigin="anonymous"
      />
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client="ca-pub-1194474024149121"
        data-ad-slot="3651755184"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
      <Script id="adsbygoogle-push" strategy="afterInteractive">
        {`(adsbygoogle = window.adsbygoogle || []).push({});`}
      </Script>
    </>
  )
}
