// Gemini REST(브라우저 직접 호출 — generativelanguage API 는 API-key CORS 허용).
// grounding: 본문 근거로만 답하고 근거 문단 id 를 반환. 없으면 found:false(환각 금지).
// 키는 방문자 것 — 서버 전송 0. OpenAI 는 브라우저 CORS 불가라 미사용.
export const GEMINI_MODEL = 'gemini-3.1-flash-lite'
const endpoint = (model, key) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`

const SCHEMA = {
  type: 'object',
  properties: {
    found: { type: 'boolean' },
    answer: { type: 'string' },
    source_ids: { type: 'array', items: { type: 'string' } },
  },
  required: ['found', 'answer', 'source_ids'],
}

// doc = [{id, text}]. validIds 로 환각 id 를 호출부에서 거른다.
export async function askGrounded({ apiKey, doc, question, model = GEMINI_MODEL }) {
  const body = doc.map((p) => `[${p.id}] ${p.text}`).join('\n')
  const system =
    '아래 [문단id] 본문만을 근거로 한국어로 답하라. 본문에 근거가 있으면 found=true, answer 에 답, source_ids 에 근거 문단 id(들). ' +
    '본문에 근거가 없으면 found=false, answer 는 빈 문자열, source_ids 는 빈 배열. 본문에 없는 내용을 지어내지 마라.'
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
