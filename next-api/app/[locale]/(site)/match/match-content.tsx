'use client'

import { Link } from '@/i18n/navigation'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useApiError } from '@/lib/use-api-error'
import { ApiError } from '@/lib/web-api'
import { FadeIn, SlideUp, StaggerContainer, StaggerItem, HoverLift } from '@/components/ui/Motion'
import { MatchResultSkeleton } from '@/components/ui/Skeleton'
import { AnimatePresence } from 'framer-motion'

type MatchResult = {
  university: { id: number; name: string; cityName: string | null; ranking: number | null; tuitionFeeYearly: string | null; ieltsRequirement: number | null; jlptRequirement: string | null }
  score: number
  fitLevel: string
  reasons: string[]
  gaps: string[]
}

export default function MatchContent() {
  const t = useTranslations('Match')
  const apiError = useApiError()
  const [results, setResults] = useState<MatchResult[]>([])
  const [form, setForm] = useState({ field: '', budgetYearly: '', ieltsScore: '', jlptLevel: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    if (!form.field.trim()) return
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/universities/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          field: form.field,
          budgetYearly: Number(form.budgetYearly) || null,
          ieltsScore: Number(form.ieltsScore) || null,
          jlptLevel: form.jlptLevel || null,
          cityId: null,
        }),
      })
      const body = await response.json()
      if (!response.ok) throw new ApiError(body.error?.code, 'Could not calculate matches')
      setResults(body.data)
    } catch (reason) {
      setError(apiError(reason))
    } finally {
      setLoading(false)
    }
  }

  const tc = useTranslations('UniversityCard')
  const fitLabel = (level: string) => {
    const l = level.toLowerCase()
    return l === 'excellent' ? t('fitExcellent') : l === 'good' ? t('fitGood') : l === 'fair' ? t('fitFair') : level
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
    if (score >= 60) return 'text-amber-500 bg-amber-500/10 border-amber-500/20'
    return 'text-sakura-500 bg-sakura-500/10 border-sakura-500/20'
  }

  const getFitLevelIcon = (level: string) => {
    switch (level.toLowerCase()) {
      case 'excellent': return '★'
      case 'good': return '◆'
      case 'fair': return '▲'
      default: return '●'
    }
  }

  return (
    <section className="relative">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-white via-ink-50/50 to-white">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 h-[500px] w-[500px] rounded-full bg-sakura-500/10 blur-[200px]" aria-hidden="true" />
          <div className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-indigo-500/10 blur-[200px]" aria-hidden="true" />
        </div>
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-sakura-500/10 px-4 py-1.5 text-sm font-medium text-sakura-600 dark:text-sakura-400 mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sakura-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-sakura-500"></span>
                </span>
                {t('badge')}
              </span>
              <h1 className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl lg:text-6xl">
                {t('titleA')}<span className="text-sakura-500">{t('titleB')}</span>{t('titleC')}
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
        <div className="grid items-start gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          {/* Form Panel */}
          <FadeIn className="relative">
            <div className="sticky top-24 space-y-6">
              {/* Main Form Card */}
              <div className="glass-card p-6 md:p-8 border border-white/20 shadow-xl">
                <div className="mb-6">
                  <h2 className="font-display text-2xl font-semibold text-ink">{t('profile')}</h2>
                  <p className="mt-1 text-sm text-ink-800/60 dark:text-ink-50/60">
                    {t('profileHint')}
                  </p>
                </div>

                <form onSubmit={submit} className="space-y-5" noValidate>
                  {/* Study Interest */}
                  <div className="space-y-1.5">
                    <label htmlFor="field" className="block text-sm font-medium text-ink-800 dark:text-ink-50">
                      {t('interest')} <span className="text-sakura-500" aria-hidden="true">*</span>
                    </label>
                    <div className="relative">
                      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-800/30 dark:text-ink-50/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <input
                        id="study-interest-field"
                        type="text"
                        className="input-field pl-10"
                        value={form.field}
                        onChange={(e) => setForm({ ...form, field: e.target.value })}
                        placeholder={t('interestPlaceholder')}
                        required
                        autoComplete="off"
                        aria-describedby="field-hint"
                      />
                    </div>
                    <p id="field-hint" className="text-xs text-ink-800/40 dark:text-ink-50/40">{t('interestHint')}</p>
                  </div>

                  {/* Budget */}
                  <div className="space-y-1.5">
                    <label htmlFor="budgetYearly" className="block text-sm font-medium text-ink-800 dark:text-ink-50">
                      {t('budget')}
                    </label>
                    <div className="relative">
                      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-800/30 dark:text-ink-50/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <input
                        id="budgetYearly"
                        type="number"
                        className="input-field pl-10"
                        value={form.budgetYearly}
                        onChange={(e) => setForm({ ...form, budgetYearly: e.target.value })}
                        placeholder={t('budgetPlaceholder')}
                        min="0"
                        step="10000"
                        autoComplete="off"
                        aria-describedby="budget-hint"
                      />
                    </div>
                    <p id="budget-hint" className="text-xs text-ink-800/40 dark:text-ink-50/40">{t('budgetHint')}</p>
                  </div>

                  {/* IELTS */}
                  <div className="space-y-1.5">
                    <label htmlFor="ieltsScore" className="block text-sm font-medium text-ink-800 dark:text-ink-50">
                      {t('ielts')}
                    </label>
                    <div className="relative">
                      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-800/30 dark:text-ink-50/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <input
                        id="ieltsScore"
                        type="number"
                        className="input-field pl-10"
                        value={form.ieltsScore}
                        onChange={(e) => setForm({ ...form, ieltsScore: e.target.value })}
                        placeholder={t('ieltsPlaceholder')}
                        min="0"
                        max="9"
                        step="0.5"
                        autoComplete="off"
                        aria-describedby="ielts-hint"
                      />
                    </div>
                    <p id="ielts-hint" className="text-xs text-ink-800/40 dark:text-ink-50/40">{t('ieltsHint')}</p>
                  </div>

                  {/* JLPT */}
                  <div className="space-y-1.5">
                    <label htmlFor="jlptLevel" className="block text-sm font-medium text-ink-800 dark:text-ink-50">
                      {t('jlpt')}
                    </label>
                    <div className="relative">
                      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-800/30 dark:text-ink-50/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                      <select
                        id="jlptLevel"
                        className="input-field pl-10 appearance-none bg-white"
                        value={form.jlptLevel}
                        onChange={(e) => setForm({ ...form, jlptLevel: e.target.value })}
                        autoComplete="off"
                        aria-describedby="jlpt-hint"
                      >
                        <option value="">{t('jlptNone')}</option>
                        {['N1', 'N2', 'N3', 'N4', 'N5'].map((level) => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
                    </div>
                    <p id="jlpt-hint" className="text-xs text-ink-800/40 dark:text-ink-50/40">{t('jlptHint')}</p>
                  </div>

                  <p className="text-xs text-ink-800/40 dark:text-ink-50/40 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {t('cityHidden')}
                  </p>

                  <button
                    className="btn-primary w-full py-3 text-base font-medium"
                    disabled={loading || !form.field.trim()}
                    type="submit"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        {t('finding')}
                      </span>
                    ) : (
                      t('find')
                    )}
                  </button>
                </form>
              </div>

              {/* Tips Card */}
              <div className="glass-card p-5 border border-white/20">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5 w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-ink">{t('tipsTitle')}</h3>
                    <ul className="mt-2 space-y-1 text-sm text-ink-800/60 dark:text-ink-50/60">
                      <li className="flex items-center gap-1.5">{t('tip1')}</li>
                      <li className="flex items-center gap-1.5">{t('tip2')}</li>
                      <li className="flex items-center gap-1.5">{t('tip3')}</li>
                      <li className="flex items-center gap-1.5">{t('tip4')}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Results Panel */}
          <SlideUp delay={0.1} className="min-h-[400px]">
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

              {loading && (
                <FadeIn key="loading">
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <MatchResultSkeleton key={i} />
                    ))}
                  </div>
                </FadeIn>
              )}

              {!loading && !error && !results.length && (
                <FadeIn key="empty">
                  <div className="glass-card p-12 text-center border border-white/20 min-h-[400px] flex items-center justify-center">
                    <div className="max-w-md mx-auto">
                      <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-sakura-500/10 flex items-center justify-center">
                        <svg className="w-8 h-8 text-sakura-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <h3 className="font-display text-xl sm:text-2xl font-semibold text-ink">{t('noMatches')}</h3>
                      <p className="mt-3 text-ink-800/60 dark:text-ink-50/60">
                        {t('noMatchesText')}
                      </p>
                    </div>
                  </div>
                </FadeIn>
              )}

              {!loading && !error && results.length > 0 && (
                <FadeIn key="results">
                  <div className="space-y-3 mb-4">
                    <h2 className="font-display text-xl font-semibold text-ink flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-sakura-500/10 flex items-center justify-center">
                        <svg className="w-5 h-5 text-sakura-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </span>
                      {t('yourMatches', { count: results.length })}
                    </h2>
                    <p className="text-sm text-ink-800/60 dark:text-ink-50/60 pl-10">
                      {t('rankedBy')}
                    </p>
                  </div>
                  <StaggerContainer staggerDelay={0.06}>
                    {results.map((result, index) => (
                      <StaggerItem key={result.university.id} customDelay={index * 0.04}>
                        <HoverLift>
                          <article className="glass-card p-5 border border-white/20 overflow-hidden">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getScoreColor(result.score)}`}>
                                    {getFitLevelIcon(result.fitLevel)} {fitLabel(result.fitLevel)}
                                  </span>
                                  {result.university.ranking && (
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                                      {t('rank', { rank: result.university.ranking })}
                                    </span>
                                  )}
                                </div>
                                <h2 className="mt-2 font-display text-xl font-semibold text-ink truncate">
                                  {result.university.name}
                                </h2>
                                <p className="mt-1 text-sm text-ink-800/60 dark:text-ink-50/60 flex items-center gap-2">
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L12 21.314 6.343 15.657a1 1 0 010-1.414l5.314-5.314a1 1 0 011.414 0l5.314 5.314a1 1 0 010 1.414z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  {result.university.cityName || tc('japanFallback')}
                                  <span className="w-1 h-1 rounded-full bg-ink-800/20 dark:bg-ink-50/20" aria-hidden="true" />
                                  <span>{t('score', { score: result.score })}</span>
                                </p>
                              </div>
                              <div className="flex-shrink-0 w-16 h-16 rounded-2xl border flex items-center justify-center" style={{ borderColor: getScoreColor(result.score).split(' ')[2] }}>
                                <span className="text-2xl font-bold" style={{ color: getScoreColor(result.score).split(' ')[0] }}>
                                  {result.score}
                                </span>
                              </div>
                            </div>

                            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                              <div className="p-3 rounded-xl bg-ink-50/50 dark:bg-ink-900/20">
                                <h3 className="font-semibold text-sm text-ink">{t('whyFits')}</h3>
                                <ul className="mt-2 space-y-1 text-sm text-ink-800/70 dark:text-ink-50/70">
                                  {result.reasons.map((item) => (
                                    <li key={item} className="flex items-start gap-1.5">
                                      <svg className="flex-shrink-0 mt-0.5 w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                      </svg>
                                      {item}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div className="p-3 rounded-xl bg-ink-50/50 dark:bg-ink-900/20">
                                <h3 className="font-semibold text-sm text-ink">{t('watch')}</h3>
                                <ul className="mt-2 space-y-1 text-sm text-ink-800/70 dark:text-ink-50/70">
                                  {result.gaps.map((item) => (
                                    <li key={item} className="flex items-start gap-1.5">
                                      <svg className="flex-shrink-0 mt-0.5 w-3.5 h-3.5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                      </svg>
                                      {item}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            <Link
                              href={`/universities/${result.university.id}`}
                              className="btn-secondary w-full mt-4"
                            >
                              {t('viewDetails')}
                            </Link>
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
      </div>
    </section>
  )
}