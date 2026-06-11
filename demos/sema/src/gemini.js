// Gemini embeddings REST(브라우저 직접 호출 — embedContent 도 generativelanguage CORS 허용 확인됨).
// ★ 사전계산(scripts/embed.mjs)과 런타임이 반드시 동일 모델이어야 벡터 공간이 맞는다.
export const EMBED_MODEL = 'gemini-embedding-001'
const endpoint = (model, key) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:embedContent?key=${encodeURIComponent(key)}`

// 질의 임베딩 — 키는 방문자 것, 서버 전송 0.
export async function embedQuery({ apiKey, text, model = EMBED_MODEL }) {
  const res = await fetch(endpoint(model, apiKey), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ model: `models/${model}`, content: { parts: [{ text }] } }),
  })
  if (!res.ok) throw new Error(`Gemini embeddings ${res.status}`)
  const data = await res.json()
  const v = data?.embedding?.values
  if (!Array.isArray(v)) throw new Error('임베딩 응답 형식 오류')
  return v
}

export function cosine(a, b) {
  let dot = 0, na = 0, nb = 0
  for (let i = 0; i < a.length; i++) { dot += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i] }
  return na && nb ? dot / (Math.sqrt(na) * Math.sqrt(nb)) : 0
}
