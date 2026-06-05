// archive 격리: /example(기존 예제 콘텐츠)을 레거시 룩 스코프로 감싼다. + 레거시 광고.
import LegacyAds from '@/components/LegacyAds'

export default function ExampleLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="legacy-theme">
      {children}
      <LegacyAds />
    </div>
  )
}
