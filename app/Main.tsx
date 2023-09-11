import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'
import NewsletterForm from 'pliny/ui/NewsletterForm'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

import { slug } from 'github-slugger'
import tagData from 'app/tag-data.json'
import { genPageMetadata } from 'app/seo'

import Image from 'next/image'
import Genius from '@/data/illustration/genius.svg'
import PaperPlane from '@/data/illustration/paper-plane.svg'
import HomeOffice from '@/data/illustration/home-office-2.svg'
import Achievement from '@/data/illustration/achievement.svg'

export const metadata = genPageMetadata({ title: 'Tags', description: 'Things I blog about' })

const MAX_DISPLAY = 5

export default function Main({ posts }) {
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])

  return (
    <>
      <section className="pt-6 pb-8 space-y-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <Link
            href={siteConfig.links.twitter}
            className="rounded-2xl bg-gray-200 dark:bg-transparent px-4 py-1.5 text-sm font-medium"
            target="_blank"
          >
            Follow along on Twitter
          </Link>
          <h1 className="text-2xl font-extrabold leading-9 tracking-tight text-gray-900 md:leading-14 dark:text-gray-100 sm:text-3xl sm:leading-10 md:text-5xl">
            웹 개발 전면전환: Next.js & React
          </h1>
          <p className="max-w-[42rem] leading-small text-muted-foreground sm:text-xl sm:leading-8">
            ReactNext Central에서는 Next.js와 React 개발을 완벽하게 마스터할 수 있는 다양한 리소스를
            제공합니다. 최신 트렌드에 부합하는 업데이트된 블로그, 개발 문서, 그리고 예제로 능력을 한
            능력을 한 단계 높일 수 있습니다.
          </p>
          <div className="py-1 space-x-4 md:space-x-2 md:space-y-0">
            <Link
              href="/blog"
              className={cn(buttonVariants({ variant: 'destructive', size: 'default' }))}
            >
              최신 기법 블로그
            </Link>
            <Link
              href="/docs"
              className={cn(buttonVariants({ variant: 'destructive', size: 'default' }))}
            >
              개발 가이드 문서
            </Link>
            <Link
              href="/example"
              className={cn(buttonVariants({ variant: 'destructive', size: 'default' }))}
            >
              단계별 구현 예제
            </Link>
          </div>
          <p className="max-w-[42rem] leading-small text-muted-foreground sm:text-xl sm:leading-8">
            초보자부터 경험 많은 개발자까지, 모든 레벨에서 필요한 통찰과 지식을 제공합니다. 지금
            바로 여러분의 개발 스킬을 향상시켜 보세요.
          </p>
        </div>
      </section>
      <section id="blog" className="container items-center py-8 md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            블로그 태그
          </h2>
        </div>
        <div className="flex flex-col items-start items-center justify-start divide-y divide-gray-200 dark:divide-gray-700 md:mt-0 md:flex-row md:items-center md:justify-center md:space-x-6 md:divide-y-0">
          <div className="items-center pt-0 pb-8 space-x-1 md:space-y-5">
            <HomeOffice />
          </div>
          <div className="flex flex-wrap items-center max-w-lg">
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
      </section>
      <section
        id="features"
        className="container flex max-w-[64rem] flex-col items-center gap-4 px-4 py-8 text-center bg-slate-50 dark:bg-transparent"
      >
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            개발 가이드 문서
          </h2>
          <p className="max-w-[100%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Next.js와 React의 공식 문서를 참고하여 웹 개발에 필수적인 모든 기술을 안내합니다.
          </p>
        </div>
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[58rem] md:grid-cols-3">
          <div className="relative p-2 overflow-hidden bg-white border rounded-lg dark:bg-transparent">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <svg viewBox="0 0 24 24" className="w-12 h-12 fill-current">
                <path d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 1-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 0 0-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 0 1-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 0 1-.157-.171l-.05-.106.006-4.703.007-4.705.072-.092a.645.645 0 0 1 .174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 0 0 4.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 0 0 2.466-2.163 11.944 11.944 0 0 0 2.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.859-8.292-8.208-9.695a12.597 12.597 0 0 0-2.499-.523A33.119 33.119 0 0 0 11.573 0zm4.069 7.217c.347 0 .408.005.486.047a.473.473 0 0 1 .237.277c.018.06.023 1.365.018 4.304l-.006 4.218-.744-1.14-.746-1.14v-3.066c0-1.982.01-3.097.023-3.15a.478.478 0 0 1 .233-.296c.096-.05.13-.054.5-.054z" />
              </svg>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Next.js 13</h3>
                <p className="text-base text-muted-foreground">
                  App 라우터, SSR/Hydration 등 렌더링, 레이아웃, 로딩 UI, API 라우트.
                </p>
              </div>
            </div>
          </div>
          <div className="relative p-2 overflow-hidden bg-white border rounded-lg dark:bg-transparent">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <svg viewBox="0 0 24 24" className="w-12 h-12 fill-current">
                <path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38a2.167 2.167 0 0 0-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44a23.476 23.476 0 0 0-3.107-.534A23.892 23.892 0 0 0 12.769 4.7c1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442a22.73 22.73 0 0 0-3.113.538 15.02 15.02 0 0 1-.254-1.42c-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87a25.64 25.64 0 0 1-4.412.005 26.64 26.64 0 0 1-1.183-1.86c-.372-.64-.71-1.29-1.018-1.946a25.17 25.17 0 0 1 1.013-1.954c.38-.66.773-1.286 1.18-1.868A25.245 25.245 0 0 1 12 8.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933a25.952 25.952 0 0 0-1.345-2.32zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493a23.966 23.966 0 0 0-1.1-2.98c.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98a23.142 23.142 0 0 0-1.086 2.964c-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39a25.819 25.819 0 0 0 1.341-2.338zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143a22.005 22.005 0 0 1-2.006-.386c.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295a1.185 1.185 0 0 1-.553-.132c-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z" />
              </svg>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">React 18</h3>
                <p className="text-base">
                  서버/클라이언트 컴포넌트, UI 구축, 상호작용성, 상태 관리, 훅.
                </p>
              </div>
            </div>
          </div>
          <div className="relative p-2 overflow-hidden bg-white border rounded-lg dark:bg-transparent">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <svg viewBox="0 0 24 24" className="w-12 h-12 fill-current">
                <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z" />
              </svg>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">CSS 스타일</h3>
                <p className="text-base text-muted-foreground">
                  Tailwind CSS, CSS Modules, CSS-in-JS, Sass.
                </p>
              </div>
            </div>
          </div>
          <div className="relative p-2 overflow-hidden bg-white border rounded-lg dark:bg-transparent">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <svg viewBox="0 0 24 24" className="w-12 h-12 fill-current">
                <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" />
              </svg>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">UI 컴포넌트</h3>
                <p className="text-sm text-muted-foreground">
                  Radix UI를 사용하여 구축된 UI 컴포넌트, Tailwind CSS로 스타일링.
                </p>
              </div>
            </div>
          </div>
          <div className="relative p-2 overflow-hidden bg-white border rounded-lg dark:bg-transparent">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="w-12 h-12 fill-current"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">인증</h3>
                <p className="text-base text-muted-foreground">
                  NextAuth.js와 미들웨어를 사용한 사용자 인증.
                </p>
              </div>
            </div>
          </div>
          <div className="relative p-2 overflow-hidden bg-white border rounded-lg dark:bg-transparent">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <svg viewBox="0 0 24 24" className="w-12 h-12 fill-current">
                <path d="M0 12C0 5.373 5.373 0 12 0c4.873 0 9.067 2.904 10.947 7.077l-15.87 15.87a11.981 11.981 0 0 1-1.935-1.099L14.99 12H12l-8.485 8.485A11.962 11.962 0 0 1 0 12Zm12.004 12L24 12.004C23.998 18.628 18.628 23.998 12.004 24Z" />
              </svg>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">최적화/테스트</h3>
                <p className="text-base text-muted-foreground">
                  검색 엔진 최적화, 웹 바이탈 및 Jest 기반 검증 기법.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto text-center md:max-w-[58rem]">
          <p className="leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            초보자부터 경험 많은 개발자까지, 모든 레벨에서 필요한 통찰과 지식을 제공합니다. 지금
            바로 여러분의 개발 스킬을 향상시켜 보세요.
          </p>
        </div>
      </section>
      <section id="open-source" className="container py-8 md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            단계별 오픈소스 예제
          </h2>
          <div className="flex flex-col items-start items-center justify-start divide-y divide-gray-200 dark:divide-gray-700 md:mt-0 md:flex-row md:items-center md:justify-center md:space-x-6 md:divide-y-0">
            <p className="max-w-[50%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Available on{' '}
              <Link
                href={siteConfig.links.github}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl bg-gray-200 dark:bg-transparent px-4 py-1.5 text-sm font-medium"
              >
                GitHub
              </Link>
              <br />
              <br />
              "ReactNextCentral은 예제, 문서, 블로그 글 등을 단계별로 설명하며 이를 오픈소스로
              제공합니다."
            </p>
            <Achievement />
          </div>
        </div>
      </section>
    </>
  )
}

// export default function Home({ posts }) {
//   return (
//     <>
//       <div className="divide-y divide-gray-200 dark:divide-gray-700">
//         <div className="pt-6 pb-8 space-y-2 md:space-y-5">
//           {/* <h1 className="text-2xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-3xl sm:leading-10 md:text-5xl md:leading-14">
//             웹 개발 전면전환: Next.js & React
//           </h1> */}
//           <Link
//             href={siteConfig.links.twitter}
//             className="rounded-2xl bg-muted px-4 py-1.5 text-sm font-medium"
//             target="_blank"
//           >
//             Follow along on Twitter
//           </Link>
//           <h1 className="text-2xl font-extrabold leading-9 tracking-tight text-gray-900 md:leading-14 dark:text-gray-100 sm:text-3xl sm:leading-10 md:text-5xl">
//             웹 개발 전면전환: Next.js & React
//           </h1>
//           <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
//             ReactNext Central에서는 Next.js와 React 개발을 완벽하게 마스터할 수 있는 다양한 리소스를
//             제공합니다. 최신 트렌드에 부합하는 업데이트된 튜토리얼, 기사, 그리고 부가 자료로
//             여러분의 개발 능력을 한 단계 높일 수 있습니다. 초보자부터 경험 많은 개발자까지, 모든
//             레벨에서 필요한 통찰과 지식을 제공합니다. 지금 바로 여러분의 개발 스킬을 향상시켜
//             보세요.
//           </p>
//         </div>
//         <ul className="divide-y divide-gray-200 dark:divide-gray-700">
//           {!posts.length && 'No posts found.'}
//           {posts.slice(0, MAX_DISPLAY).map((post) => {
//             const { slug, date, title, summary, tags } = post
//             return (
//               <li key={slug} className="py-12">
//                 <article>
//                   <div className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
//                     <dl>
//                       <dt className="sr-only">Published on</dt>
//                       <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
//                         <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
//                       </dd>
//                     </dl>
//                     <div className="space-y-5 xl:col-span-3">
//                       <div className="space-y-6">
//                         <div>
//                           <h2 className="text-2xl font-bold leading-8 tracking-tight">
//                             <Link
//                               href={`/blog/${slug}`}
//                               className="text-gray-900 dark:text-gray-100"
//                             >
//                               {title}
//                             </Link>
//                           </h2>
//                           <div className="flex flex-wrap">
//                             {tags.map((tag) => (
//                               <Tag key={tag} text={tag} />
//                             ))}
//                           </div>
//                         </div>
//                         <div className="prose text-gray-500 max-w-none dark:text-gray-400">
//                           {summary}
//                         </div>
//                       </div>
//                       <div className="text-base font-medium leading-6">
//                         <Link
//                           href={`/blog/${slug}`}
//                           className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
//                           aria-label={`Read "${title}"`}
//                         >
//                           Read more &rarr;
//                         </Link>
//                       </div>
//                     </div>
//                   </div>
//                 </article>
//               </li>
//             )
//           })}
//         </ul>
//       </div>
//       {posts.length > MAX_DISPLAY && (
//         <div className="flex justify-end text-base font-medium leading-6">
//           <Link
//             href="/blog"
//             className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
//             aria-label="All posts"
//           >
//             All Posts &rarr;
//           </Link>
//         </div>
//       )}
//       {siteMetadata.newsletter?.provider && (
//         <div className="flex items-center justify-center pt-4">
//           <NewsletterForm />
//         </div>
//       )}
//     </>
//   )
// }
