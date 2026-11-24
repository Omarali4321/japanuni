'use client'

import { useEffect } from 'react'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-3xl font-bold">Something went wrong</h1>
      <p className="opacity-70">Please try again. If the problem persists, come back later.</p>
      <button type="button" onClick={reset} className="btn-primary">Try again</button>
    </main>
  )
}
