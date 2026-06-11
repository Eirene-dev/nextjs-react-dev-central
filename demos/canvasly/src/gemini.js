// Gemini REST(브라우저 직접 호출). structured output(responseMimeType: application/json)으로
// 여행 계획 JSON 을 받아 온다. 키는 방문자 것 — 서버 전송 0.
export const GEMINI_MODEL = 'gemini-3.1-flash-lite'
const endpoint = (model, key) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`

const SCHEMA = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    summary: { type: 'string' },
    days: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          day: { type: 'string' },
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: { time: { type: 'string' }, place: { type: 'string' }, note: { type: 'string' } },
              required: ['time', 'place'],
            },
          },
        },
        required: ['day', 'items'],
      },
    },
    checklist: { type: 'array', items: { type: 'string' } },
  },
  required: ['title', 'days', 'checklist'],
}

export async function planTrip({ apiKey, prompt, model = GEMINI_MODEL }) {
  const res = await fetch(endpoint(model, apiKey), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: '여행 계획을 한국어로, 주어진 JSON 스키마로만 응답하라.' }] },
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json', responseSchema: SCHEMA },
    }),
  })
  if (!res.ok) throw new Error(`Gemini API ${res.status}`)
  const data = await res.json()
  const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') || ''
  return JSON.parse(text)
}
