import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'
import Image from 'next/image'

// 글로벌 셸 헤더 — homepage-05-final.html 크롬(sticky 반투명 + backdrop-blur + 하단 라인).
// 전 영역 공통(archive 포함). 새 디자인 토큰만 사용(핑크 제거).
const Header = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex h-[70px] max-w-[1180px] items-center gap-4 px-5 sm:px-7">
        <Link href="/" aria-label={siteMetadata.headerTitle} className="flex items-center gap-3">
          <Image
            src="/static/Logo_RNC.png"
            alt="ReactNext Central"
            width={36}
            height={36}
            className="rounded-[10px] shadow-soft"
          />
          <span className="text-[17px] font-extrabold tracking-tight text-ink">
            ReactNext Central
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 sm:flex">
          {headerNavLinks.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className="rounded-[9px] px-3.5 py-2 text-[14.5px] font-semibold text-ink-2 transition-colors hover:bg-ink/5 hover:text-ink"
            >
              {link.title}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:ml-3">
          <SearchButton />
          <ThemeSwitch />
          <MobileNav />
        </div>
      </div>
    </header>
  )
}

export default Header
