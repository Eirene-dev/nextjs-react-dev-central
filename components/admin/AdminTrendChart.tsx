import type { TrendPoint } from '@/lib/admin-stats'

// 30일 조회수 추이 — 가벼운 CSS 막대 차트(서버 렌더, 디자인 토큰). 인터랙션 없음.
export default function AdminTrendChart({ data }: { data: TrendPoint[] }) {
  const max = Math.max(1, ...data.map((d) => d.count))
  const total = data.reduce((s, d) => s + d.count, 0)
  const label = (iso: string) => {
    const d = new Date(iso + 'T00:00:00Z')
    return `${d.getUTCMonth() + 1}/${d.getUTCDate()}`
  }

  return (
    <div className="rounded-xl border border-line bg-surface-2 p-4">
      <div className="flex items-baseline justify-between">
        <h2 className="text-sm font-bold text-ink">최근 30일 조회수</h2>
        <span className="text-[12px] text-ink-3">합계 {total.toLocaleString('ko-KR')}</span>
      </div>
      <div className="mt-4 flex h-28 items-end gap-[2px]" role="img" aria-label="최근 30일 일별 조회수 막대 차트">
        {data.map((d) => (
          <div
            key={d.day}
            title={`${d.day} · ${d.count.toLocaleString('ko-KR')}회`}
            className="group relative flex-1 rounded-t-[2px] bg-coral/30 transition-colors hover:bg-coral"
            style={{ height: `${Math.max((d.count / max) * 100, d.count > 0 ? 4 : 1.5)}%` }}
          >
            <span className="sr-only">
              {d.day}: {d.count}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-1.5 flex justify-between text-[11px] text-ink-3">
        <span>{label(data[0]?.day ?? '')}</span>
        <span>{label(data[Math.floor(data.length / 2)]?.day ?? '')}</span>
        <span>오늘</span>
      </div>
    </div>
  )
}
