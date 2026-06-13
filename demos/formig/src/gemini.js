// Gemini REST(브라우저 직접 호출). 자연어 한 줄 → 예약 폼 필드로 structured 추출.
// ★ 값 + 근거(source_text): 각 추출이 '원문 어느 구절에서 왔는지'를 함께 반환 → 투명성.
// 키는 방문자 것 — 서버 전송 0.
export const GEMINI_MODEL = 'gemini-3.1-flash-lite'
const endpoint = (model, key) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`

// 폼 필드 키(추출 enum). App 의 FIELDS 와 동일 순서.
export const FIELD_KEYS = ['date', 'time', 'adults', 'children', 'seat', 'course', 'allergy', 'name', 'phone', 'request']

// 값 + 근거 배열. 값은 정규화하되 source_text 는 원문 substring 그대로.
const SCHEMA = {
  type: 'object',
  properties: {
    extractions: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          field: { type: 'string', enum: FIELD_KEYS },
          value: { type: 'string', description: '정규화된 값(예: 저녁 7시→19:00, 어른 둘→2)' },
          source_text: { type: 'string', description: '원문에서 근거가 된 구절을 verbatim(원문 그대로)으로. 없으면 생략' },
        },
        required: ['field', 'value'],
      },
    },
  },
  required: ['extractions'],
}

const SYSTEM =
  '예약 문장에서 폼 필드를 추출하라. 각 필드마다 원문에서 근거가 된 구절(source_text)을 verbatim(원문 그대로의 substring)으로 함께 반환하라. ' +
  '값(value)은 정규화하되(저녁 7시→19:00, 어른 둘→2), source_text 는 절대 바꾸지 말고 원문에 있는 그대로 적어라. 근거가 없는 필드는 생략하라.'

export async function fillForm({ apiKey, sentence, model = GEMINI_MODEL }) {
  const res = await fetch(endpoint(model, apiKey), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM }] },
      contents: [{ role: 'user', parts: [{ text: sentence }] }],
      generationConfig: { responseMimeType: 'application/json', responseSchema: SCHEMA },
    }),
  })
  if (!res.ok) throw new Error(`Gemini API ${res.status}`)
  const data = await res.json()
  const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') || ''
  return JSON.parse(text) // { extractions: [...] }
}

// ★ 환각 근거 방지: source_text 가 실제 입력 문장의 substring 인지 검증.
//   아니면 그 매핑(근거)은 버리고 값만 채운다(source: null). 알 수 없는 필드/빈 값은 제외, 필드당 첫 값 채택.
export function validateExtractions(raw, sentence) {
  const items = Array.isArray(raw?.extractions) ? raw.extractions : []
  const hay = String(sentence).toLowerCase()
  const seen = new Set()
  const out = []
  for (const e of items) {
    if (!e || !FIELD_KEYS.includes(e.field)) continue
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
  // FIELD_KEYS 순서로 정렬(폼 표시 순과 동일)
  out.sort((a, b) => FIELD_KEYS.indexOf(a.field) - FIELD_KEYS.indexOf(b.field))
  return out
}
