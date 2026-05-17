import { useEffect, useState } from 'react'
import SEO from '../components/SEO'
import LoadingSpinner from '../components/LoadingSpinner'
import ScrollReveal from '../components/ScrollReveal'
import { adminApi } from '../api/services'

const statLabels = {
  users: 'Users',
  universities: 'Universities',
  scholarships: 'Scholarships',
  reviews: 'Reviews',
  favorites: 'Favorites',
}

export default function Admin() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    adminApi.stats()
      .then((res) => setStats(res.data))
      .catch(() => setError('Failed to load admin stats'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner fullScreen />

  return (
    <>
      <SEO title="Admin Panel" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ScrollReveal>
          <h1 className="section-title">Admin Panel</h1>
          <p className="text-ink-800/60 dark:text-ink-50/60 mt-2">Platform overview and statistics</p>
        </ScrollReveal>
        {error && <p className="mt-4 text-red-500">{error}</p>}
        {stats && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 mt-10">
            {Object.entries(statLabels).map(([key, label], i) => (
              <ScrollReveal key={key} delay={i * 0.05}>
                <div className="glass-card text-center">
                  <p className="text-3xl font-display font-bold text-sakura-500">{stats[key]}</p>
                  <p className="text-sm text-ink-800/60 dark:text-ink-50/60 mt-2">{label}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
