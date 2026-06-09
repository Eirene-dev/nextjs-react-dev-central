import { adminLogout } from '@/app/admin/actions'

// 관리자 세션 컨트롤 — 현재 로그인 계정 + 로그아웃. 게이트 서버 페이지가 세션을 전달.
// 로그인 버튼 없음(게이트가 비로그인 시 자동 리다이렉트). 서버 컴포넌트(서버 액션 form).
export default function AdminUserMenu({
  name,
  image,
}: {
  name?: string | null
  image?: string | null
}) {
  return (
    <div className="flex shrink-0 items-center gap-2 text-sm">
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt="" className="h-6 w-6 rounded-full" />
      ) : null}
      <span className="max-w-[140px] truncate font-semibold text-ink-2" title={name ?? undefined}>
        {name || '관리자'}
      </span>
      <form action={adminLogout}>
        <button
          type="submit"
          className="rounded-lg border border-line px-2.5 py-1 text-[13px] font-semibold text-ink-3 transition-colors hover:border-coral-soft hover:text-coral-2"
        >
          로그아웃
        </button>
      </form>
    </div>
  )
}
