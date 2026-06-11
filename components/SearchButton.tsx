'use client'

import { useKBar } from 'kbar'

// 헤더 검색 트리거 — 루트 kbar(useKBar)로 우리 SearchProvider 컨텍스트를 토글한다.
// (pliny KBarButton 은 pliny 내부에 중첩된 별도 kbar 인스턴스를 써서 컨텍스트가 어긋남 → 직접 구현.)
const SearchButton = () => {
  const { query } = useKBar()
  return (
    <button
      type="button"
      aria-label="Search"
      onClick={() => query.toggle()}
      className="flex h-11 w-11 items-center justify-center rounded-lg text-ink transition-colors hover:bg-ink/5"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
        />
      </svg>
    </button>
  )
}

export default SearchButton
