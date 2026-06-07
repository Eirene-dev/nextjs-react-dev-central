import Link from './Link'
import siteMetadata from '@/data/siteMetadata'
import SocialIcon from '@/components/social-icons'

// 글로벌 셸 푸터 — 새 디자인 토큰. (AdSense 배치 정리는 Phase 5 소관이라 유지)
export default function Footer() {
  return (
    <footer className="mt-20 border-t border-line">
      <div className="mx-auto max-w-[1180px] px-5 py-12 sm:px-7">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="text-sm text-ink-2">
            <Link href="/" className="font-semibold text-ink">
              {siteMetadata.title}
            </Link>
            <span>{` • `}</span>
            <span>{`© ${new Date().getFullYear()}`}</span>
            <span>{` • `}</span>
            <Link
              href="/archive"
              className="font-medium underline underline-offset-4 transition-colors hover:text-ink"
            >
              아카이브
            </Link>
          </div>
          <div className="flex items-center gap-3 text-sm text-ink-2">
            <Link
              href="/about"
              className="font-medium underline underline-offset-4 transition-colors hover:text-ink"
            >
              {siteMetadata.author}
            </Link>
            <SocialIcon kind="mail" href={`mailto:${siteMetadata.email}`} size={5} />
            <SocialIcon kind="twitter" href={siteMetadata.twitter} size={5} />
            <SocialIcon kind="github" href={siteMetadata.github} size={5} />
          </div>
        </div>
      </div>
    </footer>
  )
}
