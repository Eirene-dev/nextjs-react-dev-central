// Gemini REST(브라우저 직접 호출 — generativelanguage API 는 API-key CORS 허용).
// ★ span-level grounding: 답 + 각 인용의 '본문 속 정확한 구절(source_quote, verbatim)' + 문단 id.
//   없으면 found:false(환각 금지). 키는 방문자 것 — 서버 전송 0.
export const GEMINI_MODEL = 'gemini-3.1-flash-lite'
const endpoint = (model, key) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`

const SCHEMA = {
  type: 'object',
  properties: {
    found: { type: 'boolean' },
    answer: { type: 'string' },
    citations: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source_quote: { type: 'string', description: '본문에서 근거가 된 정확한 구절(verbatim substring)' },
          source_id: { type: 'string', description: '그 구절이 있는 문단 id' },
        },
        required: ['source_quote', 'source_id'],
      },
    },
  },
  required: ['found', 'answer', 'citations'],
}

// doc = [{id, text}].
export async function askGrounded({ apiKey, doc, question, model = GEMINI_MODEL }) {
  const body = doc.map((p) => `[${p.id}] ${p.text}`).join('\n')
  const system =
    '아래 [문단id] 본문만을 근거로 한국어로 답하라. 근거가 있으면 found=true, answer 에 자연스러운 답, ' +
    'citations 에 각 근거를 {source_quote, source_id}로 — source_quote 는 본문에서 근거가 된 구절을 verbatim(본문 그대로의 substring)으로, source_id 는 그 구절이 있는 문단 id. ' +
    '본문에 근거가 없으면 found=false, answer 빈 문자열, citations 빈 배열. 본문에 없는 내용·구절을 지어내지 마라.'
  const res = await fetch(endpoint(model, apiKey), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: [{ role: 'user', parts: [{ text: `본문:\n${body}\n\n질문: ${question}` }] }],
      generationConfig: { responseMimeType: 'application/json', responseSchema: SCHEMA },
    }),
  })
  if (!res.ok) throw new Error(`Gemini API ${res.status}`)
  const data = await res.json()
  const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') || ''
  return JSON.parse(text)
}

// ★ 환각 인용 방지(span 단위): 각 source_quote 가 해당 source_id 문단의 verbatim substring 인지 검증.
//   아니면 그 인용 버림. 유효 인용 0이면 found=false 강등(기존 규칙 유지). 중복 제거.
export function validateCitations(raw, doc) {
  const byId = Object.fromEntries(doc.map((p) => [p.id, p.text]))
  const seen = new Set()
  const citations = []
  for (const c of Array.isArray(raw?.citations) ? raw.citations : []) {
    if (!c || !byId[c.source_id] || typeof c.source_quote !== 'string') continue
    const quote = c.source_quote.trim()
    if (!quote || !byId[c.source_id].includes(quote)) continue // verbatim substring 검증
    const key = `${c.source_id}::${quote}`
    if (seen.has(key)) continue
    seen.add(key)
    citations.push({ source_id: c.source_id, source_quote: quote })
  }
  return { found: !!raw?.found && citations.length > 0, answer: raw?.answer || '', citations }
}
