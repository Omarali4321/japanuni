'use client'

import { Link } from '@/i18n/navigation'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useApiError } from '@/lib/use-api-error'
import { useRouter } from '@/i18n/navigation'
import { ErrorState } from '@/components/public-states'
import { UniversityCard } from '@/components/university-card'
import { useAuth } from '@/components/auth-provider'
import { getFavorites, removeFavorite, type University } from '@/lib/web-api'
import { FadeIn, SlideUp, StaggerContainer, StaggerItem, HoverLift } from '@/components/ui/Motion'
import { UniversityCardSkeleton } from '@/components/ui/Skeleton'

export default function FavoritesContent() {
  const router = useRouter()
  const t = useTranslations('Favorites')
  const apiError = useApiError()
  const { user, loading } = useAuth()
  const [favorites, setFavorites] = useState<University[]>([])
  const [error, setError] = useState('')
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login?redirect=/favorites')
    }
  }, [loading, user, router])

  useEffect(() => {
    if (user) {
      setIsLoadingFavorites(true)
      getFavorites()
        .then(setFavorites)
        .catch((reason) => setError(apiError(reason)))
        .finally(() => setIsLoadingFavorites(false))
    }
  }, [user])

  async function remove(id: number) {
    try {
      await removeFavorite(id)
      setFavorites((items) => items.filter((item) => item.id !== id))
    } catch (reason) {
      setError(apiError(reason))
    }
  }

  if (loading || !user) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <StaggerContainer staggerDelay={0.1} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <StaggerItem key={i}><UniversityCardSkeleton /></StaggerItem>
          ))}
        </StaggerContainer>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <FadeIn>
        <h1 className="section-title">{t('title')}</h1>
        <p className="mt-2 text-ink-800/60 dark:text-ink-50/60">{t('saved', { count: favorites.length })}</p>
      </FadeIn>
      {error && <FadeIn><div className="mt-6"><ErrorState message={error} /></div></FadeIn>}
      <SlideUp delay={0.1}>
        {isLoadingFavorites ? (
          <StaggerContainer staggerDelay={0.1} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <StaggerItem key={i}><UniversityCardSkeleton /></StaggerItem>
            ))}
          </StaggerContainer>
        ) : favorites.length ? (
          <StaggerContainer staggerDelay={0.08} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.map((item, index) => (
              <StaggerItem key={item.id} customDelay={index * 0.05}>
                <div className="relative">
                  <HoverLift><UniversityCard university={item} /></HoverLift>
                  <button
                    className="absolute right-3 top-3 rounded-lg bg-white/80 dark:bg-ink-800/80 px-3 py-2 text-xs text-red-500 hover:bg-red-500/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 dark:focus-visible:ring-offset-ink-950"
                    onClick={() => void remove(item.id)}
                    aria-label={t('removeLabel', { name: item.name })}
                  >
                    {t('remove')}
                  </button>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        ) : (
          <FadeIn>
            <div className="glass-card text-center py-12">
              <p className="text-ink-800/60 dark:text-ink-50/60 mb-4">{t('empty')}</p>
              <Link href="/universities" className="btn-primary inline-block">
                {t('explore')}
              </Link>
            </div>
          </FadeIn>
        )}
      </SlideUp>
    </section>
  )
}