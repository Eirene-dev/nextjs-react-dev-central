// Gemini REST(브라우저 직접 호출). 자연어 한 줄 → 예약 폼 필드로 structured 추출.
// 키는 방문자 것 — 서버 전송 0.
export const GEMINI_MODEL = 'gemini-3.1-flash-lite'
const endpoint = (model, key) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`

const SCHEMA = {
  type: 'object',
  properties: {
    date: { type: 'string', description: 'YYYY-MM-DD 또는 요일 표현' },
    time: { type: 'string', description: 'HH:MM' },
    adults: { type: 'integer' },
    children: { type: 'integer' },
    seat: { type: 'string', enum: ['창가', '룸', '일반', '바'] },
    course: { type: 'string', enum: ['디너 A', '디너 B', '런치', '미정'] },
    allergy: { type: 'string' },
    name: { type: 'string' },
    phone: { type: 'string' },
    request: { type: 'string' },
  },
}

export async function fillForm({ apiKey, sentence, model = GEMINI_MODEL }) {
  const res = await fetch(endpoint(model, apiKey), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: '예약 문장에서 폼 필드를 추출해 JSON 스키마로만 응답하라. 모르는 필드는 생략.' }] },
      contents: [{ role: 'user', parts: [{ text: sentence }] }],
      generationConfig: { responseMimeType: 'application/json', responseSchema: SCHEMA },
    }),
  })
  if (!res.ok) throw new Error(`Gemini API ${res.status}`)
  const data = await res.json()
  const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') || ''
  return JSON.parse(text)
}
