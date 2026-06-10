'use client'

import { useCallback, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { loginWith } from '@/app/auth-actions'

// 발행 에세이 댓글 — top-level + 1단계 답글. 목록=공개, 작성/답글/삭제=로그인 필요.
// 런타임 GET 으로 로드(SSG 보존). 본문·표시이름은 평문(React 이스케이프 + whitespace-pre-wrap),
// dangerouslySetInnerHTML/마크다운 렌더 없음. 사이트 UI 폰트(Pretendard), reading 변수 미사용.
// 아바타는 프로필 이미지 대신 표시이름 이니셜 원형(이름 기반 결정적 색).

type FullComment = {
  id: number
  parentId: number | null
  authorId: string
  authorProvider: string
  authorName: string
  body: string
  createdAt: string
  deleted: false
}
type Tombstone = { id: number; parentId: number | null; createdAt: string; deleted: true }
type CItem = FullComment | Tombstone

const MAX = 2000
const NAME_MAX = 50
const NAME_KEY = 'essay-comment-name'

function fmtTime(iso: string): string {
  const d = new Date(iso)
  const diff = Math.floor((Date.now() - d.getTime()) / 86400000)
  if (diff <= 0) return '오늘'
  if (diff === 1) return '어제'
  if (diff < 7) return `${diff}일 전`
  return `${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()}.`
}

// 이름 기반 결정적 아바타 색 — 사이트 톤의 절제된 팔레트.
const PALETTE = [
  { bg: 'hsl(8 72% 55% / 0.16)', fg: 'hsl(8 58% 46%)' },
  { bg: 'hsl(210 42% 50% / 0.16)', fg: 'hsl(210 42% 46%)' },
  { bg: 'hsl(162 44% 42% / 0.18)', fg: 'hsl(162 44% 36%)' },
  { bg: 'hsl(265 38% 56% / 0.16)', fg: 'hsl(265 38% 54%)' },
  { bg: 'hsl(35 68% 50% / 0.18)', fg: 'hsl(35 62% 42%)' },
  { bg: 'hsl(340 48% 56% / 0.16)', fg: 'hsl(340 48% 52%)' },
]
function colorFor(name: string) {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0
  return PALETTE[h % PALETTE.length]
}
function InitialAvatar({ name, size = 36 }: { name: string; size?: number }) {
  const c = colorFor(name || 'U')
  return (
    <span
      aria-hidden
      className="flex shrink-0 items-center justify-center rounded-full font-bold"
      style={{ width: size, height: size, background: c.bg, color: c.fg, fontSize: size * 0.42 }}
    >
      {(name || 'U').trim().charAt(0).toUpperCase()}
    </span>
  )
}

export default function EssayComments({ slug }: { slug: string }) {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const [items, setItems] = useState<CItem[]>([])
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading')

  const [body, setBody] = useState('')
  const [name, setName] = useState('')
  const [posting, setPosting] = useState(false)
  const [postError, setPostError] = useState<string | null>(null)

  const [replyTo, setReplyTo] = useState<number | null>(null)
  const [replyBody, setReplyBody] = useState('')
  const [replyName, setReplyName] = useState('')
  const [replyPosting, setReplyPosting] = useState(false)

  const authed = status === 'authenticated' && !!session?.user
  const callbackUrl = pathname || `/essays/${slug}`

  // 표시이름 기본값 — localStorage 우선, 없으면 세션 이름.
  useEffect(() => {
    let saved = ''
    try {
      saved = localStorage.getItem(NAME_KEY) || ''
    } catch {
      /* noop */
    }
    const def = saved || session?.user?.name || ''
    setName(def)
    setReplyName(def)
  }, [session?.user?.name])

  const load = useCallback(async () => {
    try {
      const r = await fetch(`/api/essays/${encodeURIComponent(slug)}/comments`, { cache: 'no-store' })
      if (!r.ok) throw new Error()
      const d = await r.json()
      setItems(Array.isArray(d.comments) ? d.comments : [])
      setState('ready')
    } catch {
      setState('error')
    }
  }, [slug])

  useEffect(() => {
    setState('loading')
    load()
  }, [load])

  const saveName = (n: string) => {
    try {
      localStorage.setItem(NAME_KEY, n)
    } catch {
      /* noop */
    }
  }

  const post = async (text: string, displayName: string, parentId?: number) => {
    const r = await fetch(`/api/essays/${encodeURIComponent(slug)}/comments`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ body: text, displayName, parentId }),
    })
    if (!r.ok) throw new Error()
    saveName(displayName)
    await load()
  }

  const submitTop = async (e: React.FormEvent) => {
    e.preventDefault()
    const text = body.trim()
    const dn = name.trim()
    if (!text || text.length > MAX || !dn || dn.length > NAME_MAX || posting) return
    setPosting(true)
    setPostError(null)
    try {
      await post(text, dn)
      setBody('')
    } catch {
      setPostError('댓글 작성에 실패했습니다. 다시 시도해 주세요.')
    } finally {
      setPosting(false)
    }
  }

  const submitReply = async (parentId: number) => {
    const text = replyBody.trim()
    const dn = replyName.trim()
    if (!text || text.length > MAX || !dn || dn.length > NAME_MAX || replyPosting) return
    setReplyPosting(true)
    try {
      await post(text, dn, parentId)
      setReplyBody('')
      setReplyTo(null)
    } catch {
      /* 인라인 — 실패 시 폼 유지 */
    } finally {
      setReplyPosting(false)
    }
  }

  const remove = async (id: number) => {
    if (!window.confirm('이 댓글을 삭제할까요?')) return
    try {
      const r = await fetch(`/api/essays/${encodeURIComponent(slug)}/comments/${id}`, {
        method: 'DELETE',
      })
      if (r.ok) await load()
      else window.alert('삭제에 실패했습니다.')
    } catch {
      window.alert('삭제에 실패했습니다.')
    }
  }

  const canDelete = (c: FullComment) =>
    !!session?.user &&
    (session.user.isAdmin === true ||
      (c.authorProvider === session.user.provider && c.authorId === session.user.id))

  // 트리: top-level + 그 답글(created_at 순). 카운트 = 비삭제 댓글+답글.
  const tops = items.filter((i) => i.parentId == null)
  const repliesOf = (id: number) => items.filter((i) => i.parentId === id)
  const count = items.filter((i) => !i.deleted).length

  const actionBtn =
    'text-[12px] font-semibold text-ink-3 transition-colors hover:text-coral-2'

  return (
    <section className="mx-auto mt-10 max-w-[680px] font-sans" aria-label="댓글">
      <h2 className="text-lg font-extrabold tracking-tight text-ink">
        댓글 {state === 'ready' ? count.toLocaleString('ko-KR') : ''}
      </h2>

      {/* 새 댓글 작성 */}
      <div className="mt-4">
        {authed ? (
          <form onSubmit={submitTop} className="rounded-xl border border-line bg-surface-2 p-4">
            <div className="flex items-center gap-2.5">
              <InitialAvatar name={name || '나'} size={28} />
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={NAME_MAX}
                aria-label="표시 이름"
                placeholder="표시 이름"
                className="min-w-0 flex-1 rounded-lg border border-line bg-surface px-2.5 py-1.5 text-sm font-semibold text-ink outline-none placeholder:font-normal placeholder:text-ink-3 focus:border-coral-soft"
              />
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
                disabled={posting || !body.trim() || !name.trim() || body.trim().length > MAX}
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
        {state === 'error' && <p className="text-sm text-coral-2">댓글을 불러오지 못했습니다.</p>}
        {state === 'ready' && count === 0 && tops.length === 0 && (
          <p className="py-6 text-center text-sm text-ink-3">아직 댓글이 없습니다.</p>
        )}
        {state === 'ready' && tops.length > 0 && (
          <ul className="space-y-6">
            {tops.map((top) => (
              <li key={top.id}>
                {top.deleted ? (
                  <p className="text-sm italic text-ink-3">삭제된 댓글입니다.</p>
                ) : (
                  <div className="flex gap-3">
                    <InitialAvatar name={top.authorName} size={36} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-bold text-ink">{top.authorName}</span>
                        <time className="text-[12px] text-ink-3" dateTime={top.createdAt}>
                          {fmtTime(top.createdAt)}
                        </time>
                      </div>
                      <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-relaxed text-ink-2">
                        {top.body}
                      </p>
                      <div className="mt-1.5 flex gap-3">
                        {authed && (
                          <button
                            type="button"
                            className={actionBtn}
                            onClick={() => {
                              setReplyTo((cur) => (cur === top.id ? null : top.id))
                              setReplyBody('')
                            }}
                          >
                            답글
                          </button>
                        )}
                        {canDelete(top) && (
                          <button type="button" className={actionBtn} onClick={() => remove(top.id)}>
                            삭제
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 인라인 답글 폼 */}
                {authed && replyTo === top.id && !top.deleted && (
                  <div className="ml-12 mt-3 rounded-xl border border-line bg-surface-2 p-3">
                    <input
                      value={replyName}
                      onChange={(e) => setReplyName(e.target.value)}
                      maxLength={NAME_MAX}
                      aria-label="표시 이름"
                      placeholder="표시 이름"
                      className="w-full rounded-lg border border-line bg-surface px-2.5 py-1.5 text-sm font-semibold text-ink outline-none placeholder:font-normal placeholder:text-ink-3 focus:border-coral-soft"
                    />
                    <textarea
                      value={replyBody}
                      onChange={(e) => setReplyBody(e.target.value)}
                      maxLength={MAX}
                      rows={2}
                      placeholder="답글을 남겨주세요"
                      aria-label="답글 입력"
                      className="mt-2 w-full resize-y rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink outline-none placeholder:text-ink-3 focus:border-coral-soft"
                    />
                    <div className="mt-2 flex justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => setReplyTo(null)}
                        className="rounded-lg border border-line px-3 py-1.5 text-[13px] font-semibold text-ink-2 hover:text-ink"
                      >
                        취소
                      </button>
                      <button
                        type="button"
                        onClick={() => submitReply(top.id)}
                        disabled={replyPosting || !replyBody.trim() || !replyName.trim()}
                        className="rounded-lg bg-coral px-3 py-1.5 text-[13px] font-bold text-white hover:bg-coral-2 disabled:opacity-40"
                      >
                        {replyPosting ? '작성 중…' : '답글'}
                      </button>
                    </div>
                  </div>
                )}

                {/* 답글(depth 1) */}
                {repliesOf(top.id).length > 0 && (
                  <ul className="ml-12 mt-4 space-y-4 border-l border-line pl-4">
                    {repliesOf(top.id).map((rep) =>
                      rep.deleted ? null : (
                        <li key={rep.id} className="flex gap-2.5">
                          <InitialAvatar name={rep.authorName} size={28} />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-baseline gap-2">
                              <span className="text-[13px] font-bold text-ink">{rep.authorName}</span>
                              <time className="text-[11px] text-ink-3" dateTime={rep.createdAt}>
                                {fmtTime(rep.createdAt)}
                              </time>
                            </div>
                            <p className="mt-0.5 whitespace-pre-wrap break-words text-[13px] leading-relaxed text-ink-2">
                              {rep.body}
                            </p>
                            {canDelete(rep) && (
                              <div className="mt-1">
                                <button
                                  type="button"
                                  className={actionBtn}
                                  onClick={() => remove(rep.id)}
                                >
                                  삭제
                                </button>
                              </div>
                            )}
                          </div>
                        </li>
                      )
                    )}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
