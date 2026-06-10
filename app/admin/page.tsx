import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from '@/components/Link'
import { auth } from '@/auth'
import { isAdmin } from '@/lib/auth-helpers'
import AdminUserMenu from '@/components/admin/AdminUserMenu'
import AdminEssayStatsTable from '@/components/admin/AdminEssayStatsTable'
import AdminTrendChart from '@/components/admin/AdminTrendChart'
import { getKpis, getEssayStats, getViewTrend, getRecentActivity } from '@/lib/admin-stats'

// 관리자 대시보드(홈) — 비공개 라우트 + 관리자 게이트(editor/essays 동일 패턴). noindex.
// 사이트맵·골든 비대상. 관리자 전용이라 서버 DB 조회(동적 렌더) 무방.
export const metadata: Metadata = {
  title: '관리자 대시보드',
  robots: { index: false, follow: false }, // 비공개 — noindex
}

export const dynamic = 'force-dynamic'

const fmt = (n: number) => n.toLocaleString('ko-KR')

function fmtDate(iso: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso)
  const p = (x: number) => String(x).padStart(2, '0')
  return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())}`
}

function Kpi({ label, value, sub }: { label: string; value: number; sub?: string }) {
  return (
    <div className="rounded-xl border border-line bg-surface-2 p-4">
      <p className="text-[12px] font-semibold uppercase tracking-wide text-ink-3">{label}</p>
      <p className="mt-1.5 text-2xl font-extrabold tabular-nums text-ink">{fmt(value)}</p>
      {sub && <p className="mt-0.5 text-[12px] text-ink-3">{sub}</p>}
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-lg font-extrabold tracking-tight text-ink">{children}</h2>
}

export default async function AdminDashboardPage() {
  const session = await auth()
  if (!session?.user) {
    redirect(`/login?callbackUrl=${encodeURIComponent('/admin')}`)
  }
  if (!isAdmin(session)) {
    redirect('/')
  }

  const [kpis, essays, trend, recent] = await Promise.all([
    getKpis(),
    getEssayStats(),
    getViewTrend(),
    getRecentActivity(),
  ])

  const quick =
    'rounded-lg border border-line bg-surface px-3.5 py-2 text-sm font-bold text-ink-2 transition-colors hover:border-coral-soft hover:text-ink'

  return (
    <div className="mx-auto max-w-[1000px] px-5 py-8 sm:py-12">
      {/* 헤더 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">관리자 대시보드</h1>
        <div className="flex items-center gap-3">
          <AdminUserMenu name={session.user.name} image={session.user.image} />
          <Link
            href="/admin/editor"
            className="rounded-lg bg-coral px-3.5 py-2 text-sm font-bold text-white transition-colors hover:bg-coral-2"
          >
            + 새 글
          </Link>
        </div>
      </div>

      {/* 빠른 작업 */}
      <div className="mt-5 flex flex-wrap gap-2">
        <Link href="/admin/editor" className={quick}>
          새 글 작성
        </Link>
        <Link href="/admin/essays" className={quick}>
          글 관리
        </Link>
      </div>

      {/* 한눈에 보기 — KPI */}
      <div className="mt-8">
        <SectionTitle>한눈에 보기</SectionTitle>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          <Kpi label="발행 글" value={kpis.published} sub={`초안 ${fmt(kpis.draft)}`} />
          <Kpi label="총 조회수" value={kpis.totalViews} />
          <Kpi label="총 반응" value={kpis.totalReactions} />
          <Kpi label="총 댓글" value={kpis.totalComments} />
          <Kpi label="최근 7일 조회" value={kpis.views7d} />
          <Kpi label="최근 30일 조회" value={kpis.views30d} />
        </div>
      </div>

      {/* 조회수 추이 */}
      <div className="mt-8">
        <AdminTrendChart data={trend} />
      </div>

      {/* 글별 통계 */}
      <div className="mt-8">
        <SectionTitle>인기 글 · 글별 통계</SectionTitle>
        <AdminEssayStatsTable rows={essays} />
      </div>

      {/* 최근 활동 */}
      <div className="mt-8">
        <SectionTitle>최근 활동</SectionTitle>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {/* 최근 수정 초안 */}
          <div className="rounded-xl border border-line bg-surface-2 p-4">
            <h3 className="text-sm font-bold text-ink">최근 수정</h3>
            <ul className="mt-3 space-y-2.5">
              {recent.drafts.length === 0 && <li className="text-[13px] text-ink-3">없음</li>}
              {recent.drafts.map((d) => (
                <li key={d.id} className="text-[13px]">
                  <Link href={`/admin/editor?id=${d.id}`} className="font-semibold text-ink-2 hover:text-coral-2">
                    {d.title || '(제목 없음)'}
                  </Link>
                  <span className="ml-1.5 text-ink-3">
                    {d.status === 'published' ? '발행' : '초안'} · {fmtDate(d.updatedAt)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* 최근 발행 */}
          <div className="rounded-xl border border-line bg-surface-2 p-4">
            <h3 className="text-sm font-bold text-ink">최근 발행</h3>
            <ul className="mt-3 space-y-2.5">
              {recent.published.length === 0 && <li className="text-[13px] text-ink-3">없음</li>}
              {recent.published.map((p) => (
                <li key={p.id} className="text-[13px]">
                  {p.slug ? (
                    <a
                      href={`/essays/${encodeURIComponent(p.slug)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-ink-2 hover:text-coral-2"
                    >
                      {p.title || '(제목 없음)'}
                    </a>
                  ) : (
                    <span className="font-semibold text-ink-2">{p.title || '(제목 없음)'}</span>
                  )}
                  <span className="ml-1.5 text-ink-3">{fmtDate(p.publishedAt)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 최근 댓글 */}
          <div className="rounded-xl border border-line bg-surface-2 p-4">
            <h3 className="text-sm font-bold text-ink">최근 댓글</h3>
            <ul className="mt-3 space-y-2.5">
              {recent.comments.length === 0 && <li className="text-[13px] text-ink-3">없음</li>}
              {recent.comments.map((c) => (
                <li key={c.id} className="text-[13px]">
                  <p className="text-ink-2">
                    <span className="font-bold text-ink">{c.authorName}</span>
                    <span className="ml-1.5 text-ink-3">{fmtDate(c.createdAt)}</span>
                  </p>
                  <p className="truncate text-ink-2">{c.body}</p>
                  {c.title && (
                    <p className="truncate text-[12px] text-ink-3">
                      {c.slug ? (
                        <a href={`/essays/${encodeURIComponent(c.slug)}`} target="_blank" rel="noopener noreferrer" className="hover:text-coral-2">
                          {c.title}
                        </a>
                      ) : (
                        c.title
                      )}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
