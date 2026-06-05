// archive 격리: /example(기존 예제 콘텐츠, 아직 재디자인 전)을 레거시 룩 스코프로 감싼다.
export default function ExampleLayout({ children }: { children: React.ReactNode }) {
  return <div className="legacy-theme">{children}</div>
}
