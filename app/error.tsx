'use client' // Error components must be Client Components

import React from 'react'
import { useEffect } from 'react'
import CrashedError from '@/data/illustration/crashed-error.svg'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex justify-center w-full mt-4">
      <h2>무엇가 잘못 되었습니다. 불편을 드려 죄송합니다! </h2>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        재시도 하기
      </button>
      <div className="flex justify-center w-full mt-4">
        <CrashedError />
      </div>
    </div>
  )
}
