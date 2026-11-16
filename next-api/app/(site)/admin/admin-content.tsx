'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth-provider'
import { ErrorState, LoadingState } from '@/components/public-states'

type Stats = { users: number; universities: number; scholarships: number; reviews: number; favorites: number }

export default function AdminContent() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [stats, setStats] = useState<Stats | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!loading && !user) { router.replace('/login'); return }
    if (!user || user.role !== 'ADMIN') return
    fetch('/api/admin/stats', { credentials: 'include', cache: 'no-store' })
      .then(async (response) => {
        const body = await response.json()
        if (!response.ok) throw new Error(body.error?.message || 'Could not load admin stats')
        setStats(body)
      })
      .catch((reason) => setError(reason instanceof Error ? reason.message : 'Could not load admin stats'))
  }, [loading, user, router])

  if (loading || !user) return <section className="mx-auto max-w-7xl px-4 py-16"><LoadingState /></section>
  if (user.role !== 'ADMIN') return <section className="mx-auto max-w-7xl px-4 py-16"><ErrorState message="Admin access is required." /></section>
  if (error) return <section className="mx-auto max-w-7xl px-4 py-16"><ErrorState message={error} /></section>
  if (!stats) return <section className="mx-auto max-w-7xl px-4 py-16"><LoadingState /></section>

  const cards = [['Users', stats.users], ['Universities', stats.universities], ['Scholarships', stats.scholarships], ['Reviews', stats.reviews], ['Favorites', stats.favorites]]
  return <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"><h1 className="section-title">Admin Panel</h1><p className="mt-2 text-ink-800/60 dark:text-ink-50/60">Read-only platform statistics.</p><div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">{cards.map(([label, value]) => <div className="glass-card text-center" key={String(label)}><p className="font-display text-4xl font-bold text-sakura-500">{String(value)}</p><p className="mt-2 text-sm text-ink-800/60 dark:text-ink-50/60">{String(label)}</p></div>)}</div></section>
}
