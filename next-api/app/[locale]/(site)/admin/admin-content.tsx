'use client'

import { useEffect, useState } from 'react'
import { useRouter } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { useApiError } from '@/lib/use-api-error'
import { ApiError } from '@/lib/web-api'
import { useAuth } from '@/components/auth-provider'
import { ErrorState, LoadingState } from '@/components/public-states'

type Stats = { users: number; universities: number; scholarships: number; reviews: number; favorites: number }

export default function AdminContent() {
  const router = useRouter()
  const t = useTranslations('Admin')
  const apiError = useApiError()
  const { user, loading } = useAuth()
  const [stats, setStats] = useState<Stats | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!loading && !user) { router.replace('/login'); return }
    if (!user || user.role !== 'ADMIN') return
    fetch('/api/admin/stats', { credentials: 'include', cache: 'no-store' })
      .then(async (response) => {
        const body = await response.json()
        if (!response.ok) throw new ApiError(body.error?.code, 'Could not load admin stats')
        setStats(body)
      })
      .catch((reason) => setError(apiError(reason)))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user, router])

  if (loading || !user) return <section className="mx-auto max-w-7xl px-4 py-16"><LoadingState /></section>
  if (user.role !== 'ADMIN') return <section className="mx-auto max-w-7xl px-4 py-16"><ErrorState message={t('accessRequired')} /></section>
  if (error) return <section className="mx-auto max-w-7xl px-4 py-16"><ErrorState message={error} /></section>
  if (!stats) return <section className="mx-auto max-w-7xl px-4 py-16"><LoadingState /></section>

  const cards = [[t('users'), stats.users], [t('universities'), stats.universities], [t('scholarships'), stats.scholarships], [t('reviews'), stats.reviews], [t('favorites'), stats.favorites]]
  return <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"><h1 className="section-title">{t('title')}</h1><p className="mt-2 text-ink-800/60 dark:text-ink-50/60">{t('intro')}</p><div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">{cards.map(([label, value]) => <div className="glass-card text-center" key={String(label)}><p className="font-display text-4xl font-bold text-sakura-500">{String(value)}</p><p className="mt-2 text-sm text-ink-800/60 dark:text-ink-50/60">{String(label)}</p></div>)}</div></section>
}
