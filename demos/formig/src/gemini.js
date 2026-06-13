// Gemini REST(브라우저 직접 호출). 자연어 한 줄 → 폼 필드로 structured 추출.
// ★ 도메인 무관: 활성 도메인의 fields[] 에서 스키마·프롬프트·허용 키를 파생받는다(중복 없음).
// ★ 값 + 근거(source_text): 각 추출이 '원문 어느 구절에서 왔는지'를 함께 반환 → 투명성.
// 키는 방문자 것 — 서버 전송 0.
export const GEMINI_MODEL = 'gemini-3.1-flash-lite'
const endpoint = (model, key) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`

// fields[] → responseSchema. field enum 을 활성 도메인 키로 좁힌다.
function buildSchema(fields) {
  return {
    type: 'object',
    properties: {
      extractions: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            field: { type: 'string', enum: fields.map((f) => f.key) },
            value: { type: 'string', description: '정규화된 값(예: 저녁 7시→19:00, 어른 둘→2)' },
            source_text: { type: 'string', description: '원문에서 근거가 된 구절을 verbatim(원문 그대로의 substring)으로. 없으면 생략' },
          },
          required: ['field', 'value'],
        },
      },
    },
    required: ['extractions'],
  }
}

// systemPrompt(도메인) + 공통 근거 규칙 + 필드 목록.
function buildSystem(fields, systemPrompt) {
  const list = fields.map((f) => `${f.key}(${f.label})${f.opts ? ` [${f.opts.filter(Boolean).join('|')}]` : ''}`).join(', ')
  return (
    `${systemPrompt} ` +
    '각 필드마다 원문에서 근거가 된 구절(source_text)을 verbatim(원문 그대로의 substring)으로 함께 반환하라. ' +
    'source_text 는 절대 바꾸지 말고 원문에 있는 그대로 적어라. 근거가 없는 필드는 생략하라. ' +
    `추출 가능한 필드: ${list}.`
  )
}

// current(현재 폼) 가 있으면 후속 정정 컨텍스트를 더한다(언급 없는 필드는 유지, 수정/추가만 반영).
function correctionNote(fields, current) {
  if (!current) return ''
  const filled = fields.filter((f) => current[f.key] !== undefined && current[f.key] !== '')
  if (!filled.length) return ''
  const dump = filled.map((f) => `${f.key}=${current[f.key]}`).join(', ')
  return ` 현재 폼: { ${dump} }. 다음 문장은 수정/추가만 반영하고, 언급되지 않은 필드는 출력하지 마라(기존 값 유지).`
}

export async function fillForm({ apiKey, sentence, fields, systemPrompt, current = null, model = GEMINI_MODEL }) {
  const res = await fetch(endpoint(model, apiKey), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: buildSystem(fields, systemPrompt) + correctionNote(fields, current) }] },
      contents: [{ role: 'user', parts: [{ text: sentence }] }],
      generationConfig: { responseMimeType: 'application/json', responseSchema: buildSchema(fields) },
    }),
  })
  if (!res.ok) throw new Error(`Gemini API ${res.status}`)
  const data = await res.json()
  const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') || ''
  return JSON.parse(text) // { extractions: [...] }
}

// ★ 환각 근거 방지 + 도메인 키 기준. source_text 가 실제 입력 문장의 substring 인지 검증 →
//   아니면 근거는 버리고 값만(source: null). 활성 도메인에 없는 필드/빈 값 제외, 필드당 첫 값, fields 순서 정렬.
export function validateExtractions(raw, sentence, fields) {
  const keys = fields.map((f) => f.key)
  const items = Array.isArray(raw?.extractions) ? raw.extractions : []
  const hay = String(sentence).toLowerCase()
  const seen = new Set()
  const out = []
  for (const e of items) {
    if (!e || !keys.includes(e.field)) continue
    if (e.value == null || String(e.value).trim() === '') continue
    if (seen.has(e.field)) continue
    seen.add(e.field)
    let source = null
    if (typeof e.source_text === 'string' && e.source_text.trim()) {
      const st = e.source_text.trim()
      if (hay.includes(st.toLowerCase())) source = st // substring 검증 통과만 근거로 인정
    }
    out.push({ field: e.field, value: String(e.value), source })
  }
  out.sort((a, b) => keys.indexOf(a.field) - keys.indexOf(b.field))
  return out
}
