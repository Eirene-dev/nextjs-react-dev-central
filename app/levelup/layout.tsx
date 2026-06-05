// archive 격리: /levelup(기존 책 페이지)은 리스타일 없이 레거시 룩 유지(design-decisions §5).
export default function LevelupLayout({ children }: { children: React.ReactNode }) {
  return <div className="legacy-theme">{children}</div>
}
