import Link from '@/components/Link'
import QuestionMark from '@/data/illustration/question-mark.svg'

export default function NotFound() {
  return (
    <>
      <div className="flex flex-col items-start justify-start md:mt-24 md:flex-row md:items-center md:justify-center md:space-x-6">
        <div className="pt-6 pb-8 space-x-2 md:space-y-5">
          <h1 className="text-6xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 md:border-r-2 md:px-6 md:text-8xl md:leading-14">
            404
          </h1>
        </div>
        <div className="max-w-md">
          <p className="mb-4 text-xl font-bold leading-normal md:text-2xl">
            죄송합니다! 요청하신 페이지를 찾을 수 없습니다.
          </p>
          <p className="mb-8">
            "하지만 걱정하지 마세요, 홈페이지에서 다양한 다른 내용들을 찾아보실 수 있습니다."
          </p>
          <Link
            href="/"
            className="inline px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-blue-600 border border-transparent rounded-lg shadow focus:shadow-outline-blue hover:bg-blue-700 focus:outline-none dark:hover:bg-blue-500"
          >
            홈페이지로 돌아가기
          </Link>
        </div>
      </div>
      <div className="flex justify-center w-full mt-4">
        <QuestionMark />
      </div>
    </>
  )
}
