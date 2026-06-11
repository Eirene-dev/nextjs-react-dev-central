// Gemini REST(브라우저 직접 호출 — generativelanguage API 는 API-key CORS 허용).
// 키는 방문자 것: 인자로만 받고 어떤 서버로도 전송하지 않는다. OpenAI 는 브라우저 CORS 불가라 미사용.
export const GEMINI_MODEL = 'gemini-3.1-flash-lite'
const endpoint = (model, key) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`

// function calling — tools(functionDeclarations) 전달, 첫 functionCall {name,args} 반환.
export async function callWithTools({ apiKey, system, user, tools, model = GEMINI_MODEL }) {
  const res = await fetch(endpoint(model, apiKey), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: [{ role: 'user', parts: [{ text: user }] }],
      tools: [{ functionDeclarations: tools }],
      toolConfig: { functionCallingConfig: { mode: 'ANY' } },
    }),
  })
  if (!res.ok) throw new Error(`Gemini API ${res.status}`)
  const data = await res.json()
  const parts = data?.candidates?.[0]?.content?.parts || []
  const fc = parts.find((p) => p.functionCall)?.functionCall
  if (!fc) throw new Error('함수 호출이 반환되지 않았습니다')
  return { name: fc.name, args: fc.args || {} }
}
