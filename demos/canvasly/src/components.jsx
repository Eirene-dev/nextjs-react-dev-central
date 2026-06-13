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
