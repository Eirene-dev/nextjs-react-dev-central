'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from '@/components/Link'

// 페이지당 글 수. TODO(대량): 글이 많아지면 서버 limit/offset 페이지네이션으로 전환.
const PAGE_SIZE = 20

// 글 관리 목록 — 검색(제목)·상태 필터·행 액션(편집/보기/발행·비공개/삭제).
// 조회·액션은 기존 게이트 API 재사용: GET /api/essay-drafts(목록 갱신),
//   POST /api/essay-drafts/[id]/publish(발행·비공개), DELETE /api/essay-drafts/[id](삭제).
// TODO(페이지네이션): 글이 많아지면 서버 페이지네이션 도입(지금은 전체 + 클라 검색/필터).

export type AdminEssay = {
  id: number
  title: string
  status: string // 'draft' | 'published'
  slug: string | null
  updatedAt: string | null
  publishedAt: string | null
}

type Filter = 'all' | 'draft' | 'published'

function fmt(iso: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())}`
}

function StatusBadge({ status }: { status: string }) {
  const published = status === 'published'
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold ${
        published ? 'bg-coral/12 text-coral-2' : 'border border-line text-ink-3'
      }`}
    >
      {published ? '발행됨' : '초안'}
    </span>
  )
}

export default function EssaysManager({ initial }: { initial: AdminEssay[] }) {
  const [list, setList] = useState<AdminEssay[]>(initial)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [busy, setBusy] = useState<number | null>(null)
  const [page, setPage] = useState(1)

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return list.filter((e) => {
      if (filter !== 'all' && e.status !== filter) return false
      if (q && !(e.title || '').toLowerCase().includes(q)) return false
      return true
    })
  }, [list, query, filter])

  // 페이지네이션 — 필터된 결과를 20개/페이지로. 검색·필터 변경 시 1페이지로 리셋.
  const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE))
  useEffect(() => {
    setPage(1)
  }, [query, filter])
  // 목록 축소(삭제 등)로 현재 페이지가 비면 마지막 유효 페이지로 클램프.
  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])
  const start = (page - 1) * PAGE_SIZE
  const paged = visible.slice(start, start + PAGE_SIZE)

  const refresh = async () => {
    try {
      const r = await fetch('/api/essay-drafts')
      if (r.ok) setList(await r.json())
    } catch {
      /* 갱신 실패는 무시 — 다음 액션에서 재시도 */
    }
  }

  const togglePublish = async (e: AdminEssay) => {
    const publishing = e.status !== 'published'
    const msg = publishing
      ? `"${e.title || '(제목 없음)'}" 글을 발행할까요? 공개 페이지에 노출됩니다.`
      : `"${e.title || '(제목 없음)'}" 글을 비공개로 전환할까요?`
    if (!window.confirm(msg)) return
    setBusy(e.id)
    try {
      const r = await fetch(`/api/essay-drafts/${e.id}/publish`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ action: publishing ? 'publish' : 'unpublish' }),
      })
      if (r.ok) await refresh()
      else window.alert('처리에 실패했습니다.')
    } finally {
      setBusy(null)
    }
  }

  const remove = async (e: AdminEssay) => {
    if (!window.confirm(`"${e.title || '(제목 없음)'}" 글을 삭제할까요? 되돌릴 수 없습니다.`)) return
    setBusy(e.id)
    try {
      const r = await fetch(`/api/essay-drafts/${e.id}`, { method: 'DELETE' })
      if (r.ok) await refresh()
      else window.alert('삭제에 실패했습니다.')
    } finally {
      setBusy(null)
    }
  }

  const counts = useMemo(
    () => ({
      all: list.length,
      draft: list.filter((e) => e.status !== 'published').length,
      published: list.filter((e) => e.status === 'published').length,
    }),
    [list]
  )

  return (
    <div className="mt-6">
      {/* 검색 + 상태 필터 */}
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="제목 검색"
          aria-label="제목 검색"
          className="min-w-0 flex-1 rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink outline-none placeholder:text-ink-3 focus:border-coral-soft"
        />
        <div className="flex rounded-lg border border-line p-0.5">
          {(
            [
              ['all', '전체'],
              ['draft', '초안'],
              ['published', '발행됨'],
            ] as const
          ).map(([val, label]) => (
            <button
              key={val}
              type="button"
              onClick={() => setFilter(val)}
              aria-pressed={filter === val}
              className={`rounded-md px-3 py-1.5 text-[13px] font-semibold transition-colors ${
                filter === val ? 'bg-coral/12 text-coral-2' : 'text-ink-2 hover:text-ink'
              }`}
            >
              {label}
              <span className="ml-1 text-[11px] text-ink-3">{counts[val]}</span>
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="mt-10 text-center text-sm text-ink-3">
          {list.length === 0 ? '아직 글이 없습니다. “새 글”로 시작하세요.' : '조건에 맞는 글이 없습니다.'}
        </p>
      ) : (
        <>
          {/* 데스크톱: 테이블 */}
          <div className="mt-4 hidden overflow-hidden rounded-xl border border-line sm:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line bg-surface-2 text-left text-[12px] uppercase tracking-wide text-ink-3">
                  <th className="px-4 py-2.5 font-bold">제목</th>
                  <th className="px-3 py-2.5 font-bold">상태</th>
                  <th className="px-3 py-2.5 font-bold">수정일</th>
                  <th className="px-3 py-2.5 font-bold">발행일</th>
                  <th className="px-4 py-2.5 text-right font-bold">액션</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((e) => (
                  <tr key={e.id} className="border-b border-line last:border-0">
                    <td className="px-4 py-3">
                      <span className="font-semibold text-ink">{e.title || '(제목 없음)'}</span>
                    </td>
                    <td className="px-3 py-3">
                      <StatusBadge status={e.status} />
                    </td>
                    <td className="px-3 py-3 text-ink-2">{fmt(e.updatedAt)}</td>
                    <td className="px-3 py-3 text-ink-2">{fmt(e.publishedAt)}</td>
                    <td className="px-4 py-3">
                      <RowActions e={e} busy={busy === e.id} onToggle={togglePublish} onDelete={remove} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 모바일: 카드 */}
          <ul className="mt-4 space-y-2.5 sm:hidden">
            {paged.map((e) => (
              <li key={e.id} className="rounded-xl border border-line bg-surface p-3.5">
                <div className="flex items-start justify-between gap-2">
                  <span className="min-w-0 break-words font-semibold text-ink">
                    {e.title || '(제목 없음)'}
                  </span>
                  <StatusBadge status={e.status} />
                </div>
                <p className="mt-1.5 text-[12px] text-ink-3">
                  수정 {fmt(e.updatedAt)}
                  {e.publishedAt && <> · 발행 {fmt(e.publishedAt)}</>}
                </p>
                <div className="mt-2.5">
                  <RowActions e={e} busy={busy === e.id} onToggle={togglePublish} onDelete={remove} />
                </div>
              </li>
            ))}
          </ul>

          <Pagination
            page={page}
            totalPages={totalPages}
            total={visible.length}
            from={start + 1}
            to={Math.min(start + PAGE_SIZE, visible.length)}
            onPage={setPage}
          />
        </>
      )}
    </div>
  )
}

// 페이지네이션 — 이전/다음 + 번호. 1페이지뿐이면 표시 안 함. 데스크톱·모바일 동일.
function Pagination({
  page,
  totalPages,
  total,
  from,
  to,
  onPage,
}: {
  page: number
  totalPages: number
  total: number
  from: number
  to: number
  onPage: (p: number) => void
}) {
  if (totalPages <= 1) return null
  const nav =
    'rounded-md border border-line px-2.5 py-1 text-[13px] font-semibold text-ink-2 transition-colors hover:border-coral-soft hover:text-ink disabled:opacity-40 disabled:hover:border-line disabled:hover:text-ink-2'
  return (
    <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
      <p className="text-[12px] text-ink-3">
        총 {total}개 중 {from}–{to}
      </p>
      <div className="flex flex-wrap items-center gap-1">
        <button type="button" onClick={() => onPage(page - 1)} disabled={page === 1} className={nav}>
          이전
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onPage(n)}
            aria-current={n === page ? 'page' : undefined}
            className={`min-w-8 rounded-md px-2 py-1 text-[13px] font-semibold transition-colors ${
              n === page ? 'bg-coral/12 text-coral-2' : 'text-ink-2 hover:text-ink'
            }`}
          >
            {n}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onPage(page + 1)}
          disabled={page === totalPages}
          className={nav}
        >
          다음
        </button>
      </div>
    </div>
  )
}

function RowActions({
  e,
  busy,
  onToggle,
  onDelete,
}: {
  e: AdminEssay
  busy: boolean
  onToggle: (e: AdminEssay) => void
  onDelete: (e: AdminEssay) => void
}) {
  const published = e.status === 'published'
  const btn =
    'rounded-md border border-line px-2.5 py-1 text-[12px] font-semibold text-ink-2 transition-colors hover:border-coral-soft hover:text-ink disabled:opacity-40'
  return (
    <div className="flex flex-wrap items-center justify-end gap-1.5">
      <Link href={`/admin/editor?id=${e.id}`} className={btn}>
        편집
      </Link>
      {published && e.slug ? (
        <a
          href={`/essays/${encodeURIComponent(e.slug)}`}
          target="_blank"
          rel="noopener noreferrer"
          className={btn}
        >
          보기
        </a>
      ) : (
        <span className={`${btn} cursor-default opacity-40`} aria-disabled>
          보기
        </span>
      )}
      <button type="button" onClick={() => onToggle(e)} disabled={busy} className={btn}>
        {published ? '비공개' : '발행'}
      </button>
      <button
        type="button"
        onClick={() => onDelete(e)}
        disabled={busy}
        className="rounded-md border border-line px-2.5 py-1 text-[12px] font-semibold text-ink-3 transition-colors hover:border-coral-soft hover:text-coral-2 disabled:opacity-40"
      >
        삭제
      </button>
    </div>
  )
}
