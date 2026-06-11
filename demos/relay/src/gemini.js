// Gemini REST 멀티턴 function calling — 한 스텝씩(planNext) 받아 사용자 승인 후 다음으로.
// 키는 방문자 것 — 서버 전송 0. OpenAI 는 브라우저 CORS 불가라 미사용.
export const GEMINI_MODEL = 'gemini-3.1-flash-lite'
const endpoint = (model, key) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`

// contents(누적) → 다음 functionCall 또는 종료(text). 모델이 더 호출할 게 없으면 done.
export async function planNext({ apiKey, system, contents, tools, model = GEMINI_MODEL }) {
  const res = await fetch(endpoint(model, apiKey), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents,
      tools: [{ functionDeclarations: tools }],
      toolConfig: { functionCallingConfig: { mode: 'AUTO' } },
    }),
  })
  if (!res.ok) throw new Error(`Gemini API ${res.status}`)
  const data = await res.json()
  const parts = data?.candidates?.[0]?.content?.parts || []
  const fc = parts.find((p) => p.functionCall)?.functionCall
  if (fc) return { functionCall: { name: fc.name, args: fc.args || {} } }
  return { done: true, text: parts.map((p) => p.text).filter(Boolean).join('') }
}

// 멀티턴 누적 — 모델 functionCall + 실행 functionResponse 를 contents 에 추가.
export function appendTurn(contents, call, result) {
  return [
    ...contents,
    { role: 'model', parts: [{ functionCall: { name: call.name, args: call.args } }] },
    { role: 'user', parts: [{ functionResponse: { name: call.name, response: { result } } }] },
  ]
}
