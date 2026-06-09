'use client'

import { useEffect, useRef, useState } from 'react'

// 읽은 개수 표시 — 마운트 시 한 번 집계 API 에 POST 하고 응답 count 로 갱신.
// strict-mode 이중호출/새로고침 중복 방지: ran ref(같은 마운트) + localStorage essay-viewed:<slug>(오늘).
// 최종 dedupe 는 서버 UNIQUE 제약. 스타일은 부모(essay-meta)를 따름.
export default function ViewCounter({ slug, initialCount }: { slug: string; initialCount: number }) {
  const [count, setCount] = useState(initialCount)
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) return
    ran.current = true

    const day = new Date().toISOString().slice(0, 10)
    const key = `essay-viewed:${slug}`
    let already = false
    try {
      already = localStorage.getItem(key) === day
    } catch {
      /* localStorage 불가 — 그냥 진행(서버 UNIQUE 가 dedupe) */
    }
    if (already) return // 오늘 이미 보냄 → POST 생략

    try {
      localStorage.setItem(key, day)
    } catch {
      /* noop */
    }

    fetch(`/api/essays/${encodeURIComponent(slug)}/view`, { method: 'POST' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d && typeof d.count === 'number') setCount(d.count)
      })
      .catch(() => {
        /* 집계 실패는 무시 — 초기 카운트 유지 */
      })
  }, [slug])

  return <span>읽음 {count.toLocaleString('ko-KR')}</span>
}
