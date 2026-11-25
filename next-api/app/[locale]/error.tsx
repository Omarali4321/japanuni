'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations('Error')
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-3xl font-bold">{t('title')}</h1>
      <p className="opacity-70">{t('text')}</p>
      <button type="button" onClick={reset} className="btn-primary">{t('retry')}</button>
    </main>
  )
}
