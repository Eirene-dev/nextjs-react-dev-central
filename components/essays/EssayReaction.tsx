'use client'

import { useEffect, useState } from 'react'

// 익명 👍 반응 — 로그인 불필요. 토글 + 낙관적 업데이트 + 서버 확정.
// 식별: localStorage essay-reactor-id(없으면 randomUUID 생성). 누른 상태: essay-liked:<slug> 불리언.
// 페이지 로드 시 네트워크 없이 localStorage 로 버튼 상태 즉시 반영(서버 UNIQUE 가 최종 dedupe).

const REACTOR_KEY = 'essay-reactor-id'
function getReactorId(): string {
  try {
    let id = localStorage.getItem(REACTOR_KEY)
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem(REACTOR_KEY, id)
    }
    return id
  } catch {
    return ''
  }
}

export default function EssayReaction({
  slug,
  initialCount,
}: {
  slug: string
  initialCount: number
}) {
  const [count, setCount] = useState(initialCount)
  const [liked, setLiked] = useState(false)
  const [pending, setPending] = useState(false)
  const likedKey = `essay-liked:${slug}`

  // 로드 시 localStorage 로 누른 상태 즉시 반영(네트워크 없음)
  useEffect(() => {
    try {
      setLiked(localStorage.getItem(likedKey) === '1')
    } catch {
      /* noop */
    }
  }, [likedKey])

  const toggle = async () => {
    if (pending) return
    const token = getReactorId()
    if (!token) return

    const next = !liked
    const action = next ? 'like' : 'unlike'
    // 낙관적 업데이트
    const prevCount = count
    const prevLiked = liked
    setLiked(next)
    setCount((c) => Math.max(c + (next ? 1 : -1), 0))
    try {
      localStorage.setItem(likedKey, next ? '1' : '0')
    } catch {
      /* noop */
    }
    setPending(true)
    try {
      const r = await fetch(`/api/essays/${encodeURIComponent(slug)}/reaction`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ action, token }),
      })
      if (!r.ok) throw new Error('failed')
      const d = await r.json()
      if (d && typeof d.count === 'number') setCount(d.count) // 서버값으로 확정
    } catch {
      // 실패 → 롤백
      setLiked(prevLiked)
      setCount(prevCount)
      try {
        localStorage.setItem(likedKey, prevLiked ? '1' : '0')
      } catch {
        /* noop */
      }
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="mt-12 flex justify-center border-t border-line pt-8">
      <button
        type="button"
        onClick={toggle}
        aria-label="좋아요"
        aria-pressed={liked}
        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
          liked
            ? 'border-coral-soft bg-coral/10 text-coral-2'
            : 'border-line text-ink-2 hover:border-coral-soft hover:text-ink'
        }`}
      >
        <span aria-hidden className="text-base leading-none">
          👍
        </span>
        <span>{count.toLocaleString('ko-KR')}</span>
      </button>
    </div>
  )
}
