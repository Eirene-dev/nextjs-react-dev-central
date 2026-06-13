// Gemini REST(브라우저 직접 호출). ★ 제네릭 Generative UI: AI 가 질문에 맞는 컴포넌트들을 골라
// components:[{type, ...props}] 배열로 반환 → 앱이 레지스트리로 렌더. 키는 방문자 것 — 서버 전송 0.
export const GEMINI_MODEL = 'gemini-3.1-flash-lite'
const endpoint = (model, key) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`

// 스키마 enum(컴포넌트 타입) — src/components.jsx 의 레지스트리 키와 일치 유지(추가 시 양쪽 한 줄씩).
export const COMPONENT_TYPES = ['card', 'timeline', 'checklist', 'table', 'stat', 'compare', 'step', 'spec', 'callout', 'gauge']

// props 는 타입마다 다르다. anyOf 대신 — 타입별 필드를 '서로 다른 이름'으로 둔 느슨한 객체(컬렉션 충돌 회피).
// 모델은 type 에 맞는 필드만 채우고, 앱(validateComponents)이 타입별로 검증·정규화한다.
const COMPONENT_ITEM = {
  type: 'object',
  properties: {
    type: { type: 'string', enum: COMPONENT_TYPES },
    // card
    title: { type: 'string' },
    body: { type: 'string' },
    // timeline
    timeline_items: {
      type: 'array',
      items: { type: 'object', properties: { time: { type: 'string' }, label: { type: 'string' }, note: { type: 'string' } }, required: ['label'] },
    },
    // checklist
    checklist_items: { type: 'array', items: { type: 'string' } },
    // table
    columns: { type: 'array', items: { type: 'string' } },
    rows: { type: 'array', items: { type: 'array', items: { type: 'string' } } },
    // stat
    metrics: {
      type: 'array',
      items: { type: 'object', properties: { label: { type: 'string' }, value: { type: 'string' }, delta: { type: 'string' } }, required: ['label', 'value'] },
    },
    // compare (A vs B 전용 매트릭스)
    options: { type: 'array', items: { type: 'string' } },
    compare_rows: {
      type: 'array',
      items: { type: 'object', properties: { label: { type: 'string' }, values: { type: 'array', items: { type: 'string' } } }, required: ['label', 'values'] },
    },
    // step (순서 있는 절차)
    steps: {
      type: 'array',
      items: { type: 'object', properties: { title: { type: 'string' }, detail: { type: 'string' } }, required: ['title'] },
    },
    // spec (키-값 스펙)
    specs: {
      type: 'array',
      items: { type: 'object', properties: { label: { type: 'string' }, value: { type: 'string' } }, required: ['label', 'value'] },
    },
    // callout (강조 노트)
    variant: { type: 'string', enum: ['info', 'warn', 'tip'] },
    // gauge (진행/비율) — label/value/max 는 card/stat 와 겹치지 않는 top-level
    label: { type: 'string' },
    value: { type: 'string' },
    max: { type: 'string' },
  },
  required: ['type'],
}

const SCHEMA = {
  type: 'object',
  properties: { components: { type: 'array', items: COMPONENT_ITEM } },
  required: ['components'],
}

const SYSTEM =
  '너는 답을 텍스트 벽이 아니라 UI 컴포넌트로 구성하는 보조자다. 질문에 가장 맞는 컴포넌트들을 골라 순서대로 components 배열로 구성하라. ' +
  '가용 컴포넌트와 props: ' +
  'card{title, body}, ' +
  'timeline{timeline_items:[{time,label,note}]}, ' +
  'checklist{checklist_items:[문자열]}, ' +
  'table{columns:[문자열], rows:[[문자열]]}, ' +
  'stat{metrics:[{label,value,delta}]}, ' +
  'compare{options:[문자열], compare_rows:[{label, values:[문자열]}]}, ' +
  'step{steps:[{title, detail}]}, ' +
  'spec{specs:[{label, value}]}, ' +
  'callout{variant: info|warn|tip, title, body}, ' +
  'gauge{label, value, max}. ' +
  '각 컴포넌트는 type 과 그 type 에 해당하는 필드만 채운다. A vs B 비교는 compare(전용 매트릭스), 일반 표는 table, ' +
  '지표·수치는 stat, 진행률·비율은 gauge, 순서 있는 절차·로드맵은 step, 키-값 사양은 spec, 강조·주의·팁은 callout, ' +
  '일정은 timeline, 준비물·할 일은 checklist, 요약·설명은 card 를 선택하라. 한국어로.'

export async function generateComponents({ apiKey, prompt, model = GEMINI_MODEL }) {
  const res = await fetch(endpoint(model, apiKey), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM }] },
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json', responseSchema: SCHEMA },
    }),
  })
  if (!res.ok) throw new Error(`Gemini API ${res.status}`)
  const data = await res.json()
  const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') || ''
  return JSON.parse(text) // { components: [...] }
}
