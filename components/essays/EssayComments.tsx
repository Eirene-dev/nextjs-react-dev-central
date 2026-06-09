'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { loginWith } from '@/app/auth-actions'

// 발행 에세이 댓글 — 평면(top-level). 목록=공개, 작성=로그인 필요.
// 런타임에 GET 으로 로드(SSG 보존). 본문은 평문(React 이스케이프 + whitespace-pre-wrap),
// dangerouslySetInnerHTML/마크다운 렌더 없음. 사이트 UI 폰트(Pretendard), reading 변수 미사용.

type Comment = {
  id: number
  parentId: number | null
  authorId: string
  authorProvider: string
  authorName: string
  authorImage: string | null
  body: string
  createdAt: string
}

const MAX = 2000

// 절제된 한국어 시각 — 7일 이내는 'N일 전/오늘/어제', 그 외 'YYYY. M. D.'
function fmtTime(iso: string): string {
  const d = new Date(iso)
  const now = Date.now()
  const diff = Math.floor((now - d.getTime()) / 86400000)
  if (diff <= 0) return '오늘'
  if (diff === 1) return '어제'
  if (diff < 7) return `${diff}일 전`
  return `${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()}.`
}

function Avatar({ image, name, size = 36 }: { image: string | null; name: string; size?: number }) {
  const cls = 'rounded-full object-cover shrink-0'
  if (image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={image} alt="" width={size} height={size} className={cls} style={{ width: size, height: size }} />
  }
  return (
    <span
      aria-hidden
      className="flex shrink-0 items-center justify-center rounded-full bg-coral/15 font-bold text-coral-2"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {(name || 'U').trim().charAt(0).toUpperCase()}
    </span>
  )
}

export default function EssayComments({ slug }: { slug: string }) {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const [comments, setComments] = useState<Comment[]>([])
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading')
  const [body, setBody] = useState('')
  const [posting, setPosting] = useState(false)
  const [postError, setPostError] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    setState('loading')
    fetch(`/api/essays/${encodeURIComponent(slug)}/comments`, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        if (!alive) return
        setComments(Array.isArray(d.comments) ? d.comments : [])
        setState('ready')
      })
      .catch(() => alive && setState('error'))
    return () => {
      alive = false
    }
  }, [slug])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const text = body.trim()
    if (!text || text.length > MAX || posting) return
    setPosting(true)
    setPostError(null)
    try {
      const r = await fetch(`/api/essays/${encodeURIComponent(slug)}/comments`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ body: text }),
      })
      if (!r.ok) throw new Error()
      const d = await r.json()
      if (d.comment) {
        setComments((cur) => [...cur, d.comment]) // 시간순 — 맨 뒤에 추가
        setBody('')
      }
    } catch {
      setPostError('댓글 작성에 실패했습니다. 다시 시도해 주세요.')
    } finally {
      setPosting(false)
    }
  }

  const authed = status === 'authenticated' && session?.user
  const callbackUrl = pathname || `/essays/${slug}`

  return (
    <section className="mx-auto mt-10 max-w-[680px] font-sans" aria-label="댓글">
      <h2 className="text-lg font-extrabold tracking-tight text-ink">
        댓글 {state === 'ready' ? comments.length.toLocaleString('ko-KR') : ''}
      </h2>

      {/* 작성 영역 */}
      <div className="mt-4">
        {authed ? (
          <form onSubmit={submit} className="rounded-xl border border-line bg-surface-2 p-4">
            <div className="flex items-center gap-2.5">
              <Avatar image={session.user.image ?? null} name={session.user.name ?? '나'} size={28} />
              <span className="text-sm font-semibold text-ink-2">
                {session.user.name ?? '나'}
              </span>
            </div>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              maxLength={MAX}
              rows={3}
              placeholder="댓글을 남겨주세요"
              aria-label="댓글 입력"
              className="mt-3 w-full resize-y rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink outline-none placeholder:text-ink-3 focus:border-coral-soft"
            />
            <div className="mt-2 flex items-center justify-between">
              <span className="text-[12px] text-ink-3">
                {body.trim().length}/{MAX}
              </span>
              <button
                type="submit"
                disabled={posting || !body.trim() || body.trim().length > MAX}
                className="rounded-lg bg-coral px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-coral-2 disabled:opacity-40"
              >
                {posting ? '작성 중…' : '작성'}
              </button>
            </div>
            {postError && <p className="mt-2 text-[13px] font-semibold text-coral-2">{postError}</p>}
          </form>
        ) : (
          <div className="rounded-xl border border-line bg-surface-2 p-5 text-center">
            <p className="text-sm text-ink-2">댓글을 남기려면 로그인하세요.</p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              <form action={loginWith.bind(null, 'github', callbackUrl)}>
                <button
                  type="submit"
                  className="rounded-lg bg-ink px-3.5 py-2 text-sm font-bold text-surface-2 transition-colors hover:bg-coral-2"
                >
                  GitHub로 계속하기
                </button>
              </form>
              <form action={loginWith.bind(null, 'google', callbackUrl)}>
                <button
                  type="submit"
                  className="rounded-lg border border-line bg-surface px-3.5 py-2 text-sm font-bold text-ink transition-colors hover:border-coral-soft"
                >
                  Google로 계속하기
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* 목록 */}
      <div className="mt-6">
        {state === 'loading' && <p className="text-sm text-ink-3">댓글을 불러오는 중…</p>}
        {state === 'error' && (
          <p className="text-sm text-coral-2">댓글을 불러오지 못했습니다.</p>
        )}
        {state === 'ready' && comments.length === 0 && (
          <p className="py-6 text-center text-sm text-ink-3">아직 댓글이 없습니다.</p>
        )}
        {state === 'ready' && comments.length > 0 && (
          <ul className="space-y-5">
            {comments.map((c) => (
              <li key={c.id} className="flex gap-3">
                <Avatar image={c.authorImage} name={c.authorName} size={36} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-bold text-ink">{c.authorName}</span>
                    <time className="text-[12px] text-ink-3" dateTime={c.createdAt}>
                      {fmtTime(c.createdAt)}
                    </time>
                  </div>
                  <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-relaxed text-ink-2">
                    {c.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
