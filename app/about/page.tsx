import 'css/about-name.css'
import 'css/about.css'
import { allAuthors, type Authors } from '@/lib/content'
import AboutBio from '@/components/about/AboutBio'
import AnimatedName from '@/components/about/AnimatedName'
import AboutColonnade from '@/components/about/AboutColonnade'
import AboutColonnadeCaption from '@/components/about/AboutColonnadeCaption'
import { AboutLangProvider } from '@/components/about/AboutLang'
import { genPageMetadata } from 'app/seo'
import Image from 'next/image'

export const metadata = genPageMetadata({ title: 'About' })

export default async function AboutPage() {
  const author = allAuthors.find((a) => a.slug === 'default') as Authors

  return (
    <div className="py-12">
      <header className="mb-8 flex flex-col items-center gap-4 text-center">
        {author.avatar && (
          // 이중 링 — 바깥 1px rgba(224,106,76,.35) + 7px 여백 + 로고 둘레 2px #E06A4C
          <div
            className="rounded-full p-[7px]"
            style={{ boxShadow: '0 0 0 1px rgba(224,106,76,.35)' }}
          >
            <div className="rounded-full leading-[0]" style={{ boxShadow: '0 0 0 2px #E06A4C' }}>
              <Image
                src={author.avatar}
                alt={author.name}
                width={120}
                height={120}
                className="block rounded-full"
              />
            </div>
          </div>
        )}
        <div>
          <AnimatedName
            name={author.name}
            className="text-4xl font-extrabold tracking-tight text-ink"
          />
          {author.occupation && <p className="mt-2 text-ink-2">{author.occupation}</p>}
        </div>
        {/* 태그라인 아래 ❦ 장식 */}
        <p aria-hidden className="-mt-1 font-serif text-[18px] text-coral">
          ❦
        </p>
      </header>

      {/* 언어 토글(한/영) 공유 — bio·칩·회랑 캡션이 같은 상태에 연동 */}
      <AboutLangProvider>
        <AboutBio />

        {/* 하단 회랑 일러스트 — 본문보다 넓게, 스크롤 진입 시 작도 시작. 아래에 캡션+해석. */}
        <div className="mx-auto mt-20 max-w-[760px] px-5">
          <AboutColonnade />
          <AboutColonnadeCaption />
        </div>
      </AboutLangProvider>

      {/* 본문 책 글꼴: 고운바탕(세리프). 진입 시 로드(display=swap). */}
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Gowun+Batang:wght@400;700&display=swap"
      />
    </div>
  )
}
