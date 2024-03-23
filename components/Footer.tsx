import Link from './Link'
import siteMetadata from '@/data/siteMetadata'
import SocialIcon from '@/components/social-icons'
import { Icons } from '@/components/icons'
import GoogleAdUnit from 'nextjs13_google_adsense'

export default function Footer() {
  return (
    <footer>
      <div className="flex flex-col items-center mt-16">
        <Icons.logo />
        <div className="flex items-center text-sm dark:white">
          <div className="text-gray-500 align-middle dark:text-gray-400">
            <Link href="/" className="font-medium align-middle">
              {siteMetadata.title}
            </Link>
            <span className="align-middle">{` • `}</span>
            <span className="align-middle">{`© ${new Date().getFullYear()}`}</span>
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
        <div className="flex mb-2 space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <span className="align-middle">Illustrations by</span>
          <a
            href="https://popsy.co"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline align-middle underline-offset-4"
          >
            Popsy
          </a>
          <span className="align-middle">{` • `}</span>
          <span className="align-middle">Icons by</span>
          <a
            href="https://lucide.dev/"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline align-middle underline-offset-4"
          >
            Lucide
          </a>
          <span className="align-middle">{`- Licensed under MIT`}</span>
        </div>
      </div>
      <GoogleAdUnit>
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%' }}
          data-ad-client="ca-pub-1194474024149121"
          data-ad-slot="3651755184"
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
      </GoogleAdUnit>
    </footer>
  )
}
