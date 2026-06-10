'use client'

import { useMemo, useState } from 'react'
import Link from '@/components/Link'
import type { EssayStat } from '@/lib/admin-stats'

// 발행 글별 통계 표 — 클라이언트 정렬(기본 조회수 내림차순). EssaysManager 표 스타일 재사용.
type SortKey = 'title' | 'publishedAt' | 'views' | 'reactions' | 'comments'

const fmt = (n: number) => n.toLocaleString('ko-KR')
function fmtDate(iso: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso)
  const p = (x: number) => String(x).padStart(2, '0')
  return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())}`
}

export default function AdminEssayStatsTable({ rows }: { rows: EssayStat[] }) {
  const [key, setKey] = useState<SortKey>('views')
  const [dir, setDir] = useState<'asc' | 'desc'>('desc')

  const sorted = useMemo(() => {
    const arr = [...rows]
    arr.sort((a, b) => {
      let cmp = 0
      if (key === 'title') cmp = (a.title || '').localeCompare(b.title || '', 'ko')
      else if (key === 'publishedAt') cmp = (a.publishedAt || '').localeCompare(b.publishedAt || '')
      else cmp = (a[key] as number) - (b[key] as number)
      return dir === 'asc' ? cmp : -cmp
    })
    return arr
  }, [rows, key, dir])

  const onSort = (k: SortKey) => {
    if (k === key) setDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setKey(k)
      setDir(k === 'title' ? 'asc' : 'desc') // 숫자/날짜는 내림차순 우선, 제목은 오름차순
    }
  }

  const arrow = (k: SortKey) => (k === key ? (dir === 'asc' ? ' ▲' : ' ▼') : '')
  const ariaSort = (k: SortKey): 'ascending' | 'descending' | 'none' =>
    k === key ? (dir === 'asc' ? 'ascending' : 'descending') : 'none'
  const th =
    'cursor-pointer select-none px-3 py-2.5 font-bold transition-colors hover:text-coral-2'

  if (rows.length === 0) {
    return <p className="mt-4 text-center text-sm text-ink-3">발행된 글이 없습니다.</p>
  }

  return (
    <>
      {/* 데스크톱: 표 */}
      <div className="mt-4 hidden overflow-hidden rounded-xl border border-line sm:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line bg-surface-2 text-left text-[12px] uppercase tracking-wide text-ink-3">
              <th className={th + ' px-4'} onClick={() => onSort('title')} aria-sort={ariaSort('title')}>
                제목{arrow('title')}
              </th>
              <th className={th} onClick={() => onSort('publishedAt')} aria-sort={ariaSort('publishedAt')}>
                발행일{arrow('publishedAt')}
              </th>
              <th className={th + ' text-right'} onClick={() => onSort('views')} aria-sort={ariaSort('views')}>
                조회{arrow('views')}
              </th>
              <th className={th + ' text-right'} onClick={() => onSort('reactions')} aria-sort={ariaSort('reactions')}>
                반응{arrow('reactions')}
              </th>
              <th className={th + ' text-right'} onClick={() => onSort('comments')} aria-sort={ariaSort('comments')}>
                댓글{arrow('comments')}
              </th>
              <th className="px-4 py-2.5 text-right font-bold">링크</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((e) => (
              <tr key={e.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-semibold text-ink">{e.title || '(제목 없음)'}</td>
                <td className="px-3 py-3 text-ink-2">{fmtDate(e.publishedAt)}</td>
                <td className="px-3 py-3 text-right tabular-nums text-ink-2">{fmt(e.views)}</td>
                <td className="px-3 py-3 text-right tabular-nums text-ink-2">{fmt(e.reactions)}</td>
                <td className="px-3 py-3 text-right tabular-nums text-ink-2">{fmt(e.comments)}</td>
                <td className="px-4 py-3">
                  <RowLinks e={e} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 모바일: 카드 */}
      <ul className="mt-4 space-y-2.5 sm:hidden">
        {sorted.map((e) => (
          <li key={e.id} className="rounded-xl border border-line bg-surface p-3.5">
            <p className="font-semibold text-ink">{e.title || '(제목 없음)'}</p>
            <p className="mt-1 text-[12px] text-ink-3">
              {fmtDate(e.publishedAt)} · 조회 {fmt(e.views)} · 반응 {fmt(e.reactions)} · 댓글 {fmt(e.comments)}
            </p>
            <div className="mt-2.5">
              <RowLinks e={e} />
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}

function RowLinks({ e }: { e: EssayStat }) {
  const btn =
    'rounded-md border border-line px-2.5 py-1 text-[12px] font-semibold text-ink-2 transition-colors hover:border-coral-soft hover:text-ink'
  return (
    <div className="flex flex-wrap items-center justify-end gap-1.5">
      {e.slug ? (
        <a href={`/essays/${encodeURIComponent(e.slug)}`} target="_blank" rel="noopener noreferrer" className={btn}>
          보기
        </a>
      ) : (
        <span className={`${btn} cursor-default opacity-40`} aria-disabled>
          보기
        </span>
      )}
      <Link href={`/admin/editor?id=${e.id}`} className={btn}>
        편집
      </Link>
    </div>
  )
}
