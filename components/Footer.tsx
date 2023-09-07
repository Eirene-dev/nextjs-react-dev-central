import Link from './Link'
import siteMetadata from '@/data/siteMetadata'
import SocialIcon from '@/components/social-icons'
import { Icons } from '@/components/icons'

export default function Footer() {
  return (
    <footer>
      <div className="flex flex-col items-center mt-16">
        <div className="flex items-center text-sm dark:white">
          <Icons.logo />
          <div className="text-gray-500 dark:text-gray-400">
            <Link href="/" className="font-medium">
              {siteMetadata.title}
            </Link>
            {` • `}
            {`© ${new Date().getFullYear()}`}
          </div>
        </div>
        <div className="flex mb-2 space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <div>
            <Link href="/about" className="font-medium underline underline-offset-4">
              {siteMetadata.author}
            </Link>
          </div>
          <SocialIcon kind="mail" href={`mailto:${siteMetadata.email}`} size={6} />
          <SocialIcon kind="twitter" href={siteMetadata.twitter} size={6} />
          <SocialIcon kind="github" href={siteMetadata.github} size={6} />
        </div>
      </div>
    </footer>
  )
}
