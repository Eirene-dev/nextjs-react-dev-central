// 장면 B — 대시보드. 도구 이름은 전역 유일(dash_ 접두사). 경량 SVG 차트(라이브러리 없음).
const KPIS = [
  { label: '매출', value: '₩128.4M', delta: '+12.4%' },
  { label: '주문', value: '3,210', delta: '+5.1%' },
  { label: '전환율', value: '2.8%', delta: '-0.3%' },
]
const DATASETS = {
  ytd: { labels: ['Q1', 'Q2', 'Q3', 'Q4'], values: [42, 55, 48, 71] },
  quarter: { labels: ['1월', '2월', '3월'], values: [18, 22, 31] },
  month: { labels: ['W1', 'W2', 'W3', 'W4'], values: [6, 9, 7, 11] },
}
const QIDX = { q1: 0, q2: 1, q3: 2, q4: 3 }

function Chart({ chartType, highlight, range, legend }) {
  const W = 360, H = 180, PADX = 30, PADY = 26
  const { labels, values } = DATASETS[range] || DATASETS.ytd
  const n = values.length
  const max = Math.max(...values, 1)
  const plotH = H - 2 * PADY
  const hi = QIDX[highlight] ?? -1
  const y = (v) => H - PADY - (v / max) * plotH
  const px = (i) => (n === 1 ? W / 2 : PADX + (i * (W - 2 * PADX)) / (n - 1))
  const pts = values.map((v, i) => `${px(i)},${y(v)}`).join(' ')

  return (
    <svg className="chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="분기 차트">
      <line x1={PADX} y1={H - PADY} x2={W - PADX} y2={H - PADY} stroke="var(--line)" strokeWidth="1" />
      {chartType === 'bar' &&
        values.map((v, i) => {
          const slot = (W - 2 * PADX) / n
          const bw = slot * 0.56
          const bx = PADX + i * slot + (slot - bw) / 2
          const on = hi === i
          return <rect key={i} x={bx} y={y(v)} width={bw} height={H - PADY - y(v)} rx="3" fill="var(--brand)" opacity={hi < 0 || on ? 1 : 0.4} />
        })}
      {chartType === 'area' && (
        <polygon points={`${PADX},${H - PADY} ${pts} ${W - PADX},${H - PADY}`} fill="var(--brand)" opacity="0.22" />
      )}
      {(chartType === 'line' || chartType === 'area') && (
        <>
          <polyline points={pts} fill="none" stroke="var(--brand)" strokeWidth="2.5" strokeLinejoin="round" />
          {values.map((v, i) => (
            <circle key={i} cx={px(i)} cy={y(v)} r={hi === i ? 5.5 : 3} fill="var(--brand)" stroke="var(--card)" strokeWidth="1.5" />
          ))}
        </>
      )}
      {labels.map((l, i) => {
        const cx = chartType === 'bar' ? PADX + (i + 0.5) * ((W - 2 * PADX) / n) : px(i)
        return <text key={i} x={cx} y={H - 8} textAnchor="middle" fontSize="11" fill="var(--ink2)">{l}</text>
      })}
      {legend && (
        <g>
          <rect x={PADX} y={6} width="10" height="10" rx="2" fill="var(--brand)" />
          <text x={PADX + 16} y={15} fontSize="11" fill="var(--ink2)">매출(분기)</text>
        </g>
      )}
    </svg>
  )
}

export const dashboard = {
  id: 'dashboard',
  label: '대시보드',
  chips: ['선 그래프로', '범례 숨기고 막대로'],
  tools: [
    { name: 'dash_set_chart_type', description: '차트 종류 변경', parameters: { type: 'object', properties: { type: { type: 'string', enum: ['bar', 'line', 'area'] } }, required: ['type'] } },
    { name: 'dash_highlight_quarter', description: '특정 분기 강조(none 이면 해제)', parameters: { type: 'object', properties: { quarter: { type: 'string', enum: ['q1', 'q2', 'q3', 'q4', 'none'] } }, required: ['quarter'] } },
    { name: 'dash_set_range', description: '대시보드 기간 범위 변경', parameters: { type: 'object', properties: { period: { type: 'string', enum: ['ytd', 'quarter', 'month'] } }, required: ['period'] } },
    { name: 'dash_toggle_legend', description: '차트 범례 표시/숨김', parameters: { type: 'object', properties: { show: { type: 'boolean' } }, required: ['show'] } },
  ],
  initialState: { chartType: 'bar', highlight: 'none', range: 'ytd', legend: true },
  onToolCall(name, args, dispatch) {
    if (name === 'dash_set_chart_type') dispatch({ chartType: args.type })
    else if (name === 'dash_highlight_quarter') dispatch({ highlight: args.quarter || 'none' })
    else if (name === 'dash_set_range') dispatch({ range: args.period })
    else if (name === 'dash_toggle_legend') dispatch({ legend: !!args.show })
  },
  render(state) {
    return (
      <>
        <div className="kpis">
          {KPIS.map((k) => (
            <div className="kpi" key={k.label}>
              <div className="kl">{k.label}</div>
              <div className="kv">{k.value}</div>
              <div className={`kd ${k.delta.startsWith('-') ? 'down' : 'up'}`}>{k.delta}</div>
            </div>
          ))}
        </div>
        <div className="state">
          <span>차트 <b>{state.chartType}</b></span>
          <span>기간 <b>{state.range}</b></span>
          <span>강조 <b>{state.highlight}</b></span>
          <span>범례 <b>{state.legend ? '표시' : '숨김'}</b></span>
        </div>
        <div className="chartwrap">
          <Chart {...state} />
        </div>
      </>
    )
  },
}
