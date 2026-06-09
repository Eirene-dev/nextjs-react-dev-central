'use client'

import { useState } from 'react'

// 발행 팝오버 — 초안↔발행 전환, slug/excerpt 편집, published_at 표시.
// 발행 전 saveNow()로 본문을 DB에 반영(서버가 저장된 제목/본문에서 slug·excerpt 생성).
type Meta = {
  status: string
  slug: string | null
  excerpt: string | null
  publishedAt: string | null
}

export default function PublishPopover({
  draftId,
  saveNow,
}: {
  draftId: number | null
  saveNow: () => Promise<void>
}) {
  const [open, setOpen] = useState(false)
  const [meta, setMeta] = useState<Meta | null>(null)
  const [slug, setSlug] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const published = meta?.status === 'published'

  const loadMeta = async (id: number) => {
    try {
      const r = await fetch(`/api/essay-drafts/${id}`)
      if (!r.ok) return
      const d = await r.json()
      setMeta({ status: d.status, slug: d.slug, excerpt: d.excerpt, publishedAt: d.publishedAt })
      setSlug(d.slug ?? '')
      setExcerpt(d.excerpt ?? '')
    } catch {
      /* noop */
    }
  }

  const openPanel = () => {
    setOpen((v) => {
      const next = !v
      if (next && draftId) {
        setError(null)
        loadMeta(draftId)
      }
      return next
    })
  }

  const act = async (action: 'publish' | 'unpublish') => {
    if (!draftId) return
    setBusy(true)
    setError(null)
    try {
      if (action === 'publish') await saveNow() // 최신 본문을 DB에 반영
      const r = await fetch(`/api/essay-drafts/${draftId}/publish`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ action, slug, excerpt }),
      })
      const d = await r.json()
      if (!r.ok) {
        setError(d?.error || '처리에 실패했습니다.')
        return
      }
      setMeta({ status: d.status, slug: d.slug, excerpt: d.excerpt, publishedAt: d.publishedAt })
      setSlug(d.slug ?? '')
      setExcerpt(d.excerpt ?? '')
    } catch {
      setError('요청 중 오류가 발생했습니다.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={openPanel}
        aria-pressed={open}
        className={`rounded-lg border px-3 py-1.5 text-sm font-semibold transition-colors ${
          open ? 'border-coral-soft bg-coral/10 text-coral-2' : 'border-line text-ink-2 hover:border-coral-soft hover:text-ink'
        }`}
      >
        발행
        {meta && (
          <span
            className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
              published
                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                : 'bg-ink/8 text-ink-3'
            }`}
          >
            {published ? '발행됨' : '초안'}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden />
          <div className="absolute left-0 top-full z-50 mt-1 w-[300px] rounded-xl border border-line bg-surface-2 p-3 shadow-soft">
            {!draftId ? (
              <p className="text-sm text-ink-3">먼저 글을 저장하면 발행할 수 있습니다.</p>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wide text-ink-3">발행</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                      published
                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                        : 'bg-ink/8 text-ink-3'
                    }`}
                  >
                    {published ? '발행됨' : '초안'}
                  </span>
                </div>

                <label className="block">
                  <span className="text-[11px] font-semibold text-ink-3">slug</span>
                  <input
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="제목에서 자동 생성"
                    className="mt-1 block w-full min-w-0 rounded-lg border border-line bg-surface px-2.5 py-1.5 font-mono text-[13px] text-ink outline-none focus:border-coral-soft"
                  />
                </label>

                <label className="block">
                  <span className="text-[11px] font-semibold text-ink-3">발췌(excerpt)</span>
                  <textarea
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="본문 앞부분에서 자동 생성"
                    rows={2}
                    className="mt-1 block w-full min-w-0 resize-y rounded-lg border border-line bg-surface px-2.5 py-1.5 text-[13px] text-ink outline-none focus:border-coral-soft"
                  />
                </label>

                {meta?.publishedAt && (
                  <p className="text-[11px] text-ink-3">
                    발행: {new Date(meta.publishedAt).toLocaleString('ko-KR')}
                  </p>
                )}

                {error && <p className="text-[12px] font-semibold text-coral-2">{error}</p>}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => act('publish')}
                    disabled={busy}
                    className="rounded-lg bg-coral-2 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-coral disabled:opacity-50"
                  >
                    {busy ? '처리 중…' : published ? '변경 저장' : '발행'}
                  </button>
                  {published && (
                    <button
                      type="button"
                      onClick={() => act('unpublish')}
                      disabled={busy}
                      className="rounded-lg border border-line px-3 py-1.5 text-sm font-semibold text-ink-2 hover:border-coral-soft hover:text-ink disabled:opacity-50"
                    >
                      비공개로 전환
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
