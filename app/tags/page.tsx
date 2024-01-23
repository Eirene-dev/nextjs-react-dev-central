import Link from '@/components/Link'
import Tag from '@/components/Tag'
import { slug } from 'github-slugger'
import tagData from 'app/tag-data.json'
import { genPageMetadata } from 'app/seo'
import WomanWithALaptop from '@/data/illustration/woman-with-a-laptop.svg'
import GoogleAdUnit from 'nextjs13_google_adsense'

export const metadata = genPageMetadata({ title: 'Tags', description: 'Things I blog about' })

export default async function Page() {
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])
  return (
    <>
      <div className="flex flex-col items-center justify-center divide-y divide-gray-200 dark:divide-gray-700 md:mt-24 md:flex-row md:space-x-6 md:divide-y-0">
        <div className="pt-6 pb-8 space-x-2 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:border-r-2 md:px-6 md:text-6xl md:leading-14">
            블로그 태그
          </h1>
        </div>
        <div className="flex flex-wrap max-w-lg">
          {tagKeys.length === 0 && 'No tags found.'}
          {sortedTags.map((t) => {
            return (
              <div key={t} className="mt-2 mb-2 mr-5">
                <Tag text={t} />
                <Link
                  href={`/tags/${slug(t)}`}
                  className="-ml-2 text-sm font-semibold text-gray-600 uppercase dark:text-gray-300"
                  aria-label={`View posts tagged ${t}`}
                >
                  {` (${tagCounts[t]})`}
                </Link>
              </div>
            )
          })}
        </div>
      </div>
      <div className="flex justify-center w-full mt-4">
        <WomanWithALaptop />
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
    </>
  )
}
