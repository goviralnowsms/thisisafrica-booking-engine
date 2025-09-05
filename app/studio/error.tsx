'use client'

import { useEffect } from 'react'

export default function StudioError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Studio error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold mb-4">Sanity Studio Error</h2>
        <p className="text-gray-600 mb-4">There was an issue loading the Studio.</p>
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
        >
          Try again
        </button>
        <a 
          href="/"
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Go to Homepage
        </a>
      </div>
    </div>
  )
}