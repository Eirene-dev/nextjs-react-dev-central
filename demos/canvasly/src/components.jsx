// 컴포넌트 레지스트리 — 타입 → { normalize(raw): props|null, render(props) }.
// 타입 추가 = 이 객체에 한 항목 + gemini.js COMPONENT_TYPES 에 한 줄. App 은 lookup 만(if-분기 없음).
// normalize: 타입별 props 검증/정규화. 형식 불량이면 null → validateComponents 가 버린다(환각/오형식 방지).

function Card({ title, body }) {
  return (
    <div className="sec card pop">
      {title && <h2>{title}</h2>}
      {body && <p className="body">{body}</p>}
    </div>
  )
}

function Timeline({ items }) {
  return (
    <div className="sec tl pop">
      <ul className="timeline">
        {items.map((it, j) => (
          <li key={j}><span className="t">{it.time}</span><span className="p"><b>{it.label}</b>{it.note ? ` · ${it.note}` : ''}</span></li>
        ))}
      </ul>
    </div>
  )
}

function Checklist({ items }) {
  return (
    <div className="sec check pop">
      <div className="checks">{items.map((c, j) => <label key={j}><input type="checkbox" /> {c}</label>)}</div>
    </div>
  )
}

function Table({ columns, rows }) {
  return (
    <div className="sec table pop">
      <table className="gtable">
        <thead><tr>{columns.map((c, j) => <th key={j}>{c}</th>)}</tr></thead>
        <tbody>{rows.map((r, i) => <tr key={i}>{r.map((cell, j) => <td key={j}>{cell}</td>)}</tr>)}</tbody>
      </table>
    </div>
  )
}

function Stat({ metrics }) {
  return (
    <div className="sec stat pop">
      <div className="metrics">
        {metrics.map((m, j) => (
          <div className="metric" key={j}>
            <div className="ml">{m.label}</div>
            <div className="mv">{m.value}</div>
            {m.delta && <div className={`md ${m.delta.startsWith('-') ? 'down' : 'up'}`}>{m.delta}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}

function Compare({ options, rows }) {
  return (
    <div className="sec compare pop">
      <table className="gtable cmp">
        <thead><tr><th></th>{options.map((o, j) => <th key={j}>{o}</th>)}</tr></thead>
        <tbody>{rows.map((r, i) => (
          <tr key={i}><th className="rl">{r.label}</th>{r.values.map((v, j) => <td key={j}>{v}</td>)}</tr>
        ))}</tbody>
      </table>
    </div>
  )
}

function Step({ steps }) {
  return (
    <div className="sec step pop">
      <ol className="steps">
        {steps.map((s, j) => (
          <li key={j}><span className="sn">{j + 1}</span><span className="sb"><b>{s.title}</b>{s.detail ? <span className="sd">{s.detail}</span> : null}</span></li>
        ))}
      </ol>
    </div>
  )
}

function Spec({ specs }) {
  return (
    <div className="sec spec pop">
      <dl className="specs">
        {specs.map((s, j) => (
          <div className="specrow" key={j}><dt>{s.label}</dt><dd>{s.value}</dd></div>
        ))}
      </dl>
    </div>
  )
}

function Callout({ variant, title, body }) {
  const icon = variant === 'warn' ? '⚠' : variant === 'tip' ? '💡' : 'ℹ'
  return (
    <div className={`sec callout pop cv-${variant}`}>
      <div className="co-row"><span className="co-ic">{icon}</span><div>
        {title && <b className="co-t">{title}</b>}
        {body && <p className="co-b">{body}</p>}
      </div></div>
    </div>
  )
}

function Gauge({ label, value, num, max }) {
  const ratio = max > 0 && !Number.isNaN(num) ? Math.max(0, Math.min(1, num / max)) : 0
  return (
    <div className="sec gauge pop">
      <div className="ga-head"><span className="ga-l">{label}</span><span className="ga-v">{value}</span></div>
      <div className="ga-track"><div className="ga-fill" style={{ width: `${(ratio * 100).toFixed(1)}%` }} /></div>
    </div>
  )
}

export const COMPONENTS = {
  card: {
    normalize: (c) => (c.title || c.body) ? { title: c.title || '', body: c.body || '' } : null,
    render: (p) => <Card {...p} />,
  },
  timeline: {
    normalize: (c) => {
      const arr = Array.isArray(c.timeline_items) ? c.timeline_items.filter((it) => it && it.label) : []
      return arr.length ? { items: arr.map((it) => ({ time: it.time || '', label: String(it.label), note: it.note || '' })) } : null
    },
    render: (p) => <Timeline {...p} />,
  },
  checklist: {
    normalize: (c) => {
      const arr = Array.isArray(c.checklist_items) ? c.checklist_items.filter((x) => typeof x === 'string' && x.trim()) : []
      return arr.length ? { items: arr } : null
    },
    render: (p) => <Checklist {...p} />,
  },
  table: {
    normalize: (c) => {
      if (!Array.isArray(c.columns) || !c.columns.length || !Array.isArray(c.rows)) return null
      return { columns: c.columns.map(String), rows: c.rows.filter(Array.isArray).map((r) => r.map((x) => (x == null ? '' : String(x)))) }
    },
    render: (p) => <Table {...p} />,
  },
  stat: {
    normalize: (c) => {
      const arr = Array.isArray(c.metrics) ? c.metrics.filter((m) => m && m.label && m.value != null) : []
      return arr.length ? { metrics: arr.map((m) => ({ label: String(m.label), value: String(m.value), delta: m.delta ? String(m.delta) : '' })) } : null
    },
    render: (p) => <Stat {...p} />,
  },
  compare: {
    normalize: (c) => {
      if (!Array.isArray(c.options) || !c.options.length || !Array.isArray(c.compare_rows)) return null
      const rows = c.compare_rows
        .filter((r) => r && r.label && Array.isArray(r.values))
        .map((r) => ({ label: String(r.label), values: r.values.map((x) => (x == null ? '' : String(x))) }))
      return rows.length ? { options: c.options.map(String), rows } : null
    },
    render: (p) => <Compare {...p} />,
  },
  step: {
    normalize: (c) => {
      const arr = Array.isArray(c.steps) ? c.steps.filter((s) => s && s.title) : []
      return arr.length ? { steps: arr.map((s) => ({ title: String(s.title), detail: s.detail ? String(s.detail) : '' })) } : null
    },
    render: (p) => <Step {...p} />,
  },
  spec: {
    normalize: (c) => {
      const arr = Array.isArray(c.specs) ? c.specs.filter((s) => s && s.label && s.value != null) : []
      return arr.length ? { specs: arr.map((s) => ({ label: String(s.label), value: String(s.value) })) } : null
    },
    render: (p) => <Spec {...p} />,
  },
  callout: {
    normalize: (c) => {
      if (!c.title && !c.body) return null
      const variant = ['info', 'warn', 'tip'].includes(c.variant) ? c.variant : 'info'
      return { variant, title: c.title || '', body: c.body || '' }
    },
    render: (p) => <Callout {...p} />,
  },
  gauge: {
    normalize: (c) => {
      if (c.value == null || String(c.value).trim() === '') return null
      const num = parseFloat(String(c.value).replace(/[^0-9.\-]/g, ''))
      const max = parseFloat(String(c.max)) || 100
      return { label: String(c.label || ''), value: String(c.value), num, max }
    },
    render: (p) => <Gauge {...p} />,
  },
}

// ★ 레지스트리 기준 검증: 미지 type 또는 normalize 실패(형식 불량)는 버린다. → [{type, props}]
export function validateComponents(rawComponents) {
  const arr = Array.isArray(rawComponents) ? rawComponents : []
  const out = []
  for (const c of arr) {
    if (!c || !COMPONENTS[c.type]) continue // 미지 타입 버림
    const props = COMPONENTS[c.type].normalize(c)
    if (!props) continue // 형식 불량 버림
    out.push({ type: c.type, props })
  }
  return out
}
