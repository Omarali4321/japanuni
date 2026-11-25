'use client'

import { useState, useEffect } from 'react'
import { FadeIn, SlideUp, StaggerContainer, StaggerItem, HoverLift } from '@/components/ui/Motion'
import { ListItemSkeleton } from '@/components/ui/Skeleton'
import { AnimatePresence } from 'framer-motion'
import { useLocale, useTranslations } from 'next-intl'

interface Scholarship {
  id: number
  title: string
  description: string | null
  amountYearly: string | null
  coverage: string | null
  deadlineMonth: string | null
  eligibility: string | null
  universityId: number | null
}

interface ScholarshipsContentProps {
  initialScholarships: Scholarship[]
}

export default function ScholarshipsContent({ initialScholarships }: ScholarshipsContentProps) {
  const t = useTranslations('Scholarships')
  const locale = useLocale()
  const [search, setSearch] = useState('')
  const [items, setItems] = useState<Scholarship[]>(initialScholarships)
  const [error] = useState('')
  const [isLoading] = useState(false)
  const [activeFilter, setActiveFilter] = useState<'all' | 'government' | 'university'>('all')

  // Client-side search filtering
  useEffect(() => {
    let filtered = initialScholarships

    if (activeFilter === 'government') {
      filtered = filtered.filter(item => !item.universityId)
    } else if (activeFilter === 'university') {
      filtered = filtered.filter(item => item.universityId)
    }

    if (search) {
      filtered = filtered.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description?.toLowerCase().includes(search.toLowerCase()) ||
        item.eligibility?.toLowerCase().includes(search.toLowerCase())
      )
    }

    setItems(filtered)
  }, [search, activeFilter, initialScholarships])

  const totalGov = initialScholarships.filter(s => !s.universityId).length
  const totalUni = initialScholarships.filter(s => s.universityId).length

  return (
    <section className="relative">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-white via-amber-50/50 to-white">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 h-[500px] w-[500px] rounded-full bg-amber-500/10 blur-[200px]" aria-hidden="true" />
          <div className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-sakura-500/10 blur-[200px]" aria-hidden="true" />
        </div>
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-4 py-1.5 text-sm font-medium text-amber-600 dark:text-amber-400 mb-6">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                {t('badge')}
              </span>
              <h1 className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl lg:text-6xl">
                {t('titleA')}<span className="text-amber-500">{t('titleB')}</span>
              </h1>
              <p className="mt-4 text-lg text-ink-800/60 dark:text-ink-50/60 max-w-2xl mx-auto">
                {t('subtitle')}
              </p>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Search & Filter Bar */}
        <FadeIn className="mb-8">
          <div className="space-y-4">
            <div className="relative max-w-xl">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-800/30 dark:text-ink-50/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="search"
                className="input-field pl-12 w-full"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t('searchPlaceholder')}
                aria-label={t('searchLabel')}
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap" role="tablist" aria-label={t('filterLabel')}>
              {[
                { value: 'all', label: t('all'), count: initialScholarships.length },
                { value: 'government', label: t('government'), count: totalGov },
                { value: 'university', label: t('university'), count: totalUni },
              ].map((filter) => (
                <button
                  key={filter.value}
                  role="tab"
                  aria-selected={activeFilter === filter.value}
                  onClick={() => setActiveFilter(filter.value as typeof activeFilter)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    activeFilter === filter.value
                      ? 'bg-sakura-500 text-white shadow-lg'
                      : 'bg-white/80 text-ink-800/60 dark:bg-ink-900/50 dark:text-ink-50/60 hover:bg-sakura-500/10 hover:text-sakura-500 border border-white/20 dark:border-ink-800/30'
                  }`}
                >
                  {filter.label}
                  <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                    activeFilter === filter.value ? 'bg-white/20 text-white' : 'bg-ink-50/50 dark:bg-ink-900/30 text-ink-800/40'
                  }`}>
                    {filter.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Results */}
        <SlideUp delay={0.1}>
          <AnimatePresence mode="wait">
            {error && (
              <FadeIn key="error">
                <div className="glass-card p-5 border border-sakura-500/20 bg-sakura-500/5">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-sakura-500/10 flex items-center justify-center">
                      <svg className="w-5 h-5 text-sakura-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <p className="text-ink-800/80 dark:text-ink-50/80">{error}</p>
                  </div>
                </div>
              </FadeIn>
            )}

            {isLoading && (
              <FadeIn key="loading">
                <StaggerContainer staggerDelay={0.08} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <StaggerItem key={i}><ListItemSkeleton /></StaggerItem>
                  ))}
                </StaggerContainer>
              </FadeIn>
            )}

            {!isLoading && !error && items.length === 0 && (
              <FadeIn key="empty">
                <div className="glass-card p-12 text-center border border-white/20">
                  <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center">
                    <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="font-display text-xl font-semibold text-ink">{t('empty')}</h3>
                  <p className="mt-2 text-ink-800/60 dark:text-ink-50/60">
                    {search ? t('emptySearch') : t('emptyNone')}
                  </p>
                </div>
              </FadeIn>
            )}

            {!isLoading && !error && items.length > 0 && (
              <FadeIn key="results">
                <div className="mb-4 text-sm text-ink-800/60 dark:text-ink-50/60">
                  {t('showing', { shown: items.length, total: initialScholarships.length })}
                </div>
                <StaggerContainer staggerDelay={0.06} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {items.map((item, index) => (
                    <StaggerItem key={String(item.id)} customDelay={index * 0.04}>
                      <HoverLift>
                        <article className="glass-card p-6 border border-white/20 overflow-hidden">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                                item.universityId ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              }`}>
                                {item.universityId ? t('university') : t('government')}
                              </span>
                              <h2 className="mt-2 font-display text-xl font-semibold text-ink truncate">
                                {item.title}
                              </h2>
                            </div>
                          </div>

                          <p className="mt-3 text-sm text-ink-800/70 dark:text-ink-50/70 line-clamp-3">
                            {item.description || t('noDescription')}
                          </p>

                          {item.eligibility && (
                            <div className="mt-4 p-3 rounded-xl bg-ink-50/50 dark:bg-ink-900/20">
                              <h3 className="font-semibold text-sm text-ink flex items-center gap-1.5">
                                <svg className="w-3.5 h-3.5 text-sakura-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                {t('eligibility')}
                              </h3>
                              <p className="mt-1 text-sm text-ink-800/70 dark:text-ink-50/70">{item.eligibility}</p>
                            </div>
                          )}

                          <div className="mt-4 flex flex-wrap gap-2 text-xs">
                            {item.amountYearly && (
                              <span className="inline-flex items-center gap-1 rounded-lg bg-amber-500/10 px-3 py-1.5 text-amber-600 dark:text-amber-400 font-medium">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {t('perYear', { amount: Number(item.amountYearly).toLocaleString(locale) })}
                              </span>
                            )}
                            {item.coverage && (
                              <span className="inline-flex items-center gap-1 rounded-lg glass px-3 py-1.5 text-ink-800/70 dark:text-ink-50/70">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {item.coverage === 'Full' ? t('coverageFull') : item.coverage === 'Partial' ? t('coveragePartial') : item.coverage}
                              </span>
                            )}
                            {item.deadlineMonth && (
                              <span className="inline-flex items-center gap-1 rounded-lg glass px-3 py-1.5 text-ink-800/70 dark:text-ink-50/70">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {t('deadline', { month: t.has(`month_${item.deadlineMonth}`) ? t(`month_${item.deadlineMonth}`) : item.deadlineMonth })}
                              </span>
                            )}
                          </div>
                        </article>
                      </HoverLift>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </FadeIn>
            )}
          </AnimatePresence>
        </SlideUp>
      </div>
    </section>
  )
}
