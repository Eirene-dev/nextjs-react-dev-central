'use client'

import 'css/board-md.css'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import Markdown from './Markdown'
import MarkdownEditor from './MarkdownEditor'
import { loginWith } from '@/app/auth-actions'

// 클라이언트 전용 타입/상수(서버 모듈 import 회피)
type Post = {
  id: number
  type: string
  title: string | null
  body: string | null
  parentId: number | null
  authorName: string | null
  authorAvatar: string | null
  authorId: string | null
  createdAt: string
  deleted: boolean
  replies?: Post[]
}
const FILTERS = ['전체', '문의', '토론', '오타', '기타'] as const
const TYPE_OPTIONS = [
  { key: 'question', label: '문의' },
  { key: 'discussion', label: '토론' },
  { key: 'typo', label: '오타' },
  { key: 'etc', label: '기타' },
]
const LABEL: Record<string, string> = { question: '문의', discussion: '토론', typo: '오타', etc: '기타' }
const LABEL_TO_KEY: Record<string, string> = { 문의: 'question', 토론: 'discussion', 오타: 'typo', 기타: 'etc' }
const PAGE_KEY = 'book:judgment-dev'

function fmt(d: string) {
  const dt = new Date(d)
  return `${dt.getFullYear()}.${String(dt.getMonth() + 1).padStart(2, '0')}.${String(dt.getDate()).padStart(2, '0')} ${String(dt.getHours()).padStart(2, '0')}:${String(dt.getMinutes()).padStart(2, '0')}`
}

type Session = { user: { id: string; name?: string | null; image?: string | null } } | null

export default function Board({
  initial,
  session,
  isAdmin,
  callbackUrl,
  logoutAction,
}: {
  initial: { posts: Post[]; nextCursor: number | null }
  session: Session
  isAdmin: boolean
  callbackUrl: string
  logoutAction: () => Promise<void>
}) {
  const [posts, setPosts] = useState<Post[]>(initial.posts)
  const [cursor, setCursor] = useState<number | null>(initial.nextCursor)
  const [filter, setFilter] = useState<string>('전체')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const canDelete = (p: Post) =>
    !!session && (isAdmin || session.user.id === p.authorId)

  async function load(f = filter, cur: number | null = null) {
    const qs = new URLSearchParams({ pageKey: PAGE_KEY })
    if (f !== '전체') qs.set('type', LABEL_TO_KEY[f])
    if (cur) qs.set('cursor', String(cur))
    const res = await fetch(`/api/board?${qs}`)
    const data = await res.json()
    if (cur) setPosts((prev) => [...prev, ...data.posts])
    else setPosts(data.posts)
    setCursor(data.nextCursor)
  }

  function onFilter(f: string) {
    setFilter(f)
    load(f, null)
  }

  async function submit(input: {
    type: string
    title?: string
    body: string
    parentId?: number
  }): Promise<boolean> {
    setError('')
    setBusy(true)
    try {
      const res = await fetch('/api/board', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageKey: PAGE_KEY, ...input }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        setError(j.error || '작성에 실패했습니다.')
        return false
      }
      await load(filter, null)
      return true
    } finally {
      setBusy(false)
    }
  }

  async function remove(id: number) {
    if (!confirm('이 글을 삭제할까요?')) return
    const res = await fetch(`/api/board/${id}`, { method: 'DELETE' })
    if (res.ok) load(filter, null)
    else {
      const j = await res.json().catch(() => ({}))
      setError(j.error || '삭제에 실패했습니다.')
    }
  }

  return (
    <div>
      {/* 타입 필터 */}
      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => onFilter(f)}
            aria-pressed={filter === f}
            className={cn(
              'rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors',
              filter === f
                ? 'border-coral-2 bg-coral-2 text-white'
                : 'border-line bg-surface-2 text-ink-2 hover:border-coral-soft hover:text-coral-2'
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* 작성 폼 */}
      {session ? (
        <ComposeForm onSubmit={submit} busy={busy} />
      ) : (
        <div className="mb-8 rounded-2xl border border-line bg-surface-2 p-5 text-center">
          <p className="text-ink-2">글을 남기려면 로그인해 주세요.</p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            <form action={loginWith.bind(null, 'github', callbackUrl)}>
              <button className="inline-flex items-center gap-2 rounded-lg bg-ink px-4 py-2.5 text-sm font-bold text-surface-2 transition hover:bg-coral-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.5 2.87 8.32 6.84 9.67.5.1.68-.22.68-.49l-.01-1.7c-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.63.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05a9.4 9.4 0 015 0c1.91-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9l-.01 2.82c0 .27.18.6.69.49A10.02 10.02 0 0022 12.26C22 6.58 17.52 2 12 2z" /></svg>
                GitHub로 계속하기
              </button>
            </form>
            <form action={loginWith.bind(null, 'google', callbackUrl)}>
              <button className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-4 py-2.5 text-sm font-bold text-ink transition hover:border-coral-soft">
                <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.24 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0012 23z" />
                  <path fill="#FBBC05" d="M5.84 14.11a6.6 6.6 0 010-4.22V7.05H2.18a11 11 0 000 9.9l3.66-2.84z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
                </svg>
                Google로 계속하기
              </button>
            </form>
          </div>
        </div>
      )}

      {error && <p className="mb-4 text-sm font-semibold text-coral-2">{error}</p>}
      {session && (
        <div className="mb-6 flex items-center justify-end gap-2 text-xs text-ink-3">
          <span>{session.user.name} 님{isAdmin ? ' (관리자)' : ''}</span>
          <form action={logoutAction}>
            <button className="underline underline-offset-2 hover:text-ink-2">로그아웃</button>
          </form>
        </div>
      )}

      {/* 목록 */}
      {posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-surface-2 py-16 text-center">
          <p className="text-ink-2">첫 글을 남겨보세요.</p>
          <p className="mt-2 text-sm text-ink-3">문의 · 토론 · 오타 제보 환영합니다.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {posts.map((p) => (
            <PostItem
              key={p.id}
              post={p}
              session={session}
              canDelete={canDelete}
              onReply={(body) => submit({ type: p.type, body, parentId: p.id })}
              onDelete={remove}
              busy={busy}
            />
          ))}
        </div>
      )}

      {cursor && (
        <div className="mt-6 text-center">
          <button
            onClick={() => load(filter, cursor)}
            className="rounded-lg border border-line bg-surface-2 px-5 py-2.5 text-sm font-semibold text-ink-2 hover:border-coral-soft hover:text-ink"
          >
            더 보기
          </button>
        </div>
      )}
    </div>
  )
}

function Badge({ type }: { type: string }) {
  return (
    <span className="rounded-md bg-coral/10 px-2 py-0.5 text-[11px] font-bold text-coral-2">
      {LABEL[type] ?? '기타'}
    </span>
  )
}

function Body({ text }: { text: string | null }) {
  // 마크다운 렌더(react-markdown + rehype-sanitize, rehype-raw 없음 → 원시 HTML 통과 차단 = XSS 안전)
  return <Markdown>{text ?? ''}</Markdown>
}

function Author({ post }: { post: Post }) {
  return (
    <div className="flex items-center gap-2 text-xs text-ink-2">
      {post.authorAvatar ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.authorAvatar} alt="" className="h-5 w-5 rounded-full" />
      ) : (
        <span className="h-5 w-5 rounded-full bg-ink/10" />
      )}
      <span className="font-medium text-ink">{post.authorName}</span>
      <span className="text-ink-3">· {fmt(post.createdAt)}</span>
    </div>
  )
}

function PostItem({
  post,
  session,
  canDelete,
  onReply,
  onDelete,
  busy,
}: {
  post: Post
  session: Session
  canDelete: (p: Post) => boolean
  onReply: (body: string) => Promise<boolean>
  onDelete: (id: number) => void
  busy: boolean
}) {
  const [open, setOpen] = useState(false)
  const [reply, setReply] = useState('')
  const replies = post.replies ?? []

  return (
    <article className="rounded-2xl border border-line bg-surface-2 p-5">
      {post.deleted ? (
        <p className="italic text-ink-3">[삭제된 글입니다]</p>
      ) : (
        <>
          <div className="mb-2 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Badge type={post.type} />
              {post.title && <h3 className="font-bold tracking-tight text-ink">{post.title}</h3>}
            </div>
            {canDelete(post) && (
              <button onClick={() => onDelete(post.id)} className="text-xs text-ink-3 hover:text-coral-2">
                삭제
              </button>
            )}
          </div>
          <Body text={post.body} />
          <div className="mt-3 flex items-center justify-between">
            <Author post={post} />
            <button
              onClick={() => setOpen((o) => !o)}
              className="text-xs font-semibold text-ink-2 hover:text-coral-2"
            >
              답글 {replies.length > 0 ? `(${replies.length})` : ''}
            </button>
          </div>
        </>
      )}

      {open && (
        <div className="mt-4 border-t border-line pt-4">
          {replies.length > 0 && (
            <div className="mb-3 flex flex-col gap-3">
              {replies.map((r) => (
                <div key={r.id} className="rounded-xl bg-ink/[0.03] p-3">
                  {r.deleted ? (
                    <p className="italic text-ink-3">[삭제된 글입니다]</p>
                  ) : (
                    <>
                      <Body text={r.body} />
                      <div className="mt-2 flex items-center justify-between">
                        <Author post={r} />
                        {canDelete(r) && (
                          <button onClick={() => onDelete(r.id)} className="text-xs text-ink-3 hover:text-coral-2">
                            삭제
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
          {session && (
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                if (!reply.trim()) return
                if (await onReply(reply)) {
                  setReply('')
                  setOpen(true)
                }
              }}
              className="flex flex-col gap-2"
            >
              <MarkdownEditor
                value={reply}
                onChange={setReply}
                placeholder="답글 달기…(마크다운 지원)"
                rows={3}
              />
              <div className="flex justify-end">
                <button
                  disabled={busy || !reply.trim()}
                  className="rounded-lg bg-coral-2 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                >
                  등록
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </article>
  )
}

function ComposeForm({
  onSubmit,
  busy,
}: {
  onSubmit: (i: { type: string; title?: string; body: string }) => Promise<boolean>
  busy: boolean
}) {
  const [type, setType] = useState('question')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        if (!body.trim()) return
        if (await onSubmit({ type, title: title.trim() || undefined, body })) {
          setTitle('')
          setBody('')
        }
      }}
      className="mb-8 rounded-2xl border border-line bg-surface-2 p-5"
    >
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <div className="relative">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            aria-label="글 종류"
            className="appearance-none rounded-lg border border-line bg-surface py-2 pl-3 pr-9 text-sm font-semibold text-ink outline-none"
          >
            {TYPE_OPTIONS.map((t) => (
              <option key={t.key} value={t.key}>
                {t.label}
              </option>
            ))}
          </select>
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-3"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목(선택)"
          maxLength={200}
          className="flex-1 rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-coral-soft"
        />
      </div>
      <MarkdownEditor
        value={body}
        onChange={setBody}
        placeholder="내용을 입력하세요…(마크다운 지원)"
        rows={5}
      />
      <div className="mt-3 flex justify-end">
        <button
          disabled={busy || !body.trim()}
          className="rounded-lg bg-coral-2 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-coral-2/90 disabled:opacity-50"
        >
          등록
        </button>
      </div>
    </form>
  )
}
