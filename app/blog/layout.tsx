// archive 격리: /blog 콘텐츠를 레거시 룩 스코프(.legacy-theme)로 감싼다.
// 글로벌 셸(Header/Footer)은 root layout 에 있어 이 스코프 밖 → 새 디자인 유지.
export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <div className="legacy-theme">{children}</div>
}
