// archive 격리: /tags(블로그 파생) 콘텐츠를 레거시 룩 스코프로 감싼다. + 레거시 광고.
import LegacyAds from '@/components/LegacyAds'

export default function TagsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="legacy-theme">
      {children}
      <LegacyAds />
    </div>
  )
}
