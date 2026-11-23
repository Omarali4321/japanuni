'use client'

import { useEffect, useState, useRef } from 'react'
import { UniversityCard } from '@/components/university-card'
import { ErrorState } from '@/components/public-states'
import { listUniversities, type University } from '@/lib/web-api'
import { StaggerContainer, StaggerItem, FadeIn, SlideUp } from '@/components/ui/Motion'

interface UniversityListClientProps {
  initialData: { data: University[]; meta: { totalPages: number; totalElements: number } }
  buildDate: string
}

const institutionTypes = ['National', 'Private', 'Public']
const languageOptions = [
  { value: '', label: 'All languages' },
  { value: 'Japanese (100%)', label: 'Japanese only' },
  { value: 'English (100%)', label: 'English only' },
  { value: 'Both', label: 'Japanese & English' },
]
const intakeOptions = [
  { value: '', label: 'All intakes' },
  { value: 'April', label: 'April' },
  { value: 'October', label: 'October' },
  { value: 'September', label: 'September' },
  { value: 'Other', label: 'Other' },
]

function Badge({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>{children}</span>
}

function FilterSelect({
  label,
  id,
  value,
  onChange,
  options,
  disabled,
  icon
}: {
  label: string
  id: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  disabled: boolean
  icon?: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-[12px] font-semibold text-ink mb-2" htmlFor={id}>
        {icon && <span className="inline-flex items-center gap-1">{icon} </span>}{label}
      </label>
      <div className="relative">
        <select
          id={id}
          className="input-field h-[48px] rounded-xl text-sm appearance-none pr-10"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        >
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  )
}

export function UniversityListClient({ initialData, buildDate }: UniversityListClientProps) {
  const [search, setSearch] = useState('')
  const [submitted, setSubmitted] = useState('')
  const [page, setPage] = useState(0)
  const [result, setResult] = useState(initialData)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [institutionType, setInstitutionType] = useState('')
  const [language, setLanguage] = useState('')
  const [intake, setIntake] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const drawerRef = useRef<HTMLDivElement>(null)

  // Body scroll lock when mobile filters open
  useEffect(() => {
    if (filtersOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [filtersOpen])

  // Close drawer on escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && filtersOpen) {
        setFiltersOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [filtersOpen])

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    const params = new URLSearchParams({ page: String(page), size: '12' })
    if (submitted) params.set('search', submitted)
    if (institutionType) params.set('institutionType', institutionType)
    if (language) params.set('mediumOfInstruction', language)
    if (intake) params.set('intake', intake)
    setError('')
    setIsLoading(true)
    listUniversities(params)
      .then((data) => {
        setResult(data)
        setIsLoading(false)
      })
      .catch((reason) => {
        setError(reason.message)
        setIsLoading(false)
      })
  }, [page, submitted, institutionType, language, intake])

  const hasActiveFilters = institutionType || language || intake
  const activeFilterCount = [institutionType, language, intake].filter(Boolean).length

  const clearFilters = () => {
    setInstitutionType('')
    setLanguage('')
    setIntake('')
    setPage(0)
  }

  const startItem = page * 12 + 1
  const endItem = Math.min(startItem + result.data.length - 1, result.meta.totalElements)
  const showingText = result.data.length > 0 ? `Showing ${startItem}–${endItem} of ${result.meta.totalElements}` : `0 universities found`

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-10 2xl:px-16">
      {/* Hero Section */}
      <FadeIn className="mb-12">
        <div className="relative rounded-3xl bg-gradient-to-br from-accent/5 via-white to-white p-8 sm:p-12 lg:p-16 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--accent)/10,transparent_70%)]" />
          <div className="relative max-w-3xl">
            <Badge className="bg-accent/10 text-accent mb-4 text-[11px]">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              233 Universities in Catalog
            </Badge>
            <h1 className="font-display text-[48px] sm:text-[64px] lg:text-[72px] font-normal text-ink leading-tight mb-4">
              Find Your University in Japan
            </h1>
            <p className="text-[17px] sm:text-[19px] text-muted max-w-[600px] mb-8 leading-relaxed">
              Explore programs, compare universities, and plan your study abroad journey.
            </p>
            <p className="text-sm text-muted/70">Data source: JASSO School Search Result CSV · Last updated: {buildDate}</p>
          </div>
          {/* Decorative element */}
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tl from-accent/5 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" aria-hidden="true" />
        </div>
      </FadeIn>

      {/* Search Bar */}
      <SlideUp delay={0.1} className="mb-8">
        <form className="relative max-w-2xl mx-auto" onSubmit={(event) => { event.preventDefault(); setPage(0); setSubmitted(search.trim()) }}>
          <div className="relative flex items-center">
            <svg className="absolute left-4 w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              className="input-field w-full h-[56px] pl-12 pr-16 text-base rounded-2xl bg-white border-border/50 focus:border-accent focus:ring-2 focus:ring-accent/20"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search universities, programs, or cities..."
              disabled={isLoading}
              aria-label="Search universities"
            />
            <button
              type="submit"
              className="absolute right-2 btn-primary h-[44px] px-6 text-sm whitespace-nowrap"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Searching...
                </span>
              ) : (
                'Search'
              )}
            </button>
          </div>
        </form>
      </SlideUp>

      {/* Filters Bar - Mobile Toggle + Desktop Pills */}
      <div className="mb-6 flex items-center gap-4 flex-wrap">
        {/* Mobile Filters Toggle */}
        <div className="lg:hidden">
          <button
            type="button"
            className={`btn-secondary h-[48px] flex items-center justify-between gap-4 ${isLoading ? 'opacity-50' : ''}`}
            onClick={() => setFiltersOpen(!filtersOpen)}
            disabled={isLoading}
            aria-expanded={filtersOpen}
            aria-controls="mobile-filters"
          >
            <span className="flex items-center gap-2 text-sm font-medium text-ink">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
              Filters
            </span>
            {hasActiveFilters && (
              <span className="bg-accent/10 text-accent text-xs px-2 py-0.5 rounded-full font-medium">{activeFilterCount}</span>
            )}
            <svg className={`w-5 h-5 text-ink transition-transform ${filtersOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </button>
        </div>

        {/* Desktop Filter Pills */}
        <div className="hidden lg:flex lg:flex-wrap lg:gap-2 flex-1">
          <FilterSelect
            label="Institution type"
            id="institution-type"
            value={institutionType}
            onChange={v => { setInstitutionType(v); setPage(0) }}
            options={[{ value: '', label: 'All types' }, ...institutionTypes.map(t => ({ value: t, label: t }))]}
            disabled={isLoading}
            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
          />
          <FilterSelect
            label="Teaching language"
            id="teaching-language"
            value={language}
            onChange={v => { setLanguage(v); setPage(0) }}
            options={languageOptions}
            disabled={isLoading}
            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>}
          />
          <FilterSelect
            label="Intake"
            id="intake"
            value={intake}
            onChange={v => { setIntake(v); setPage(0) }}
            options={intakeOptions}
            disabled={isLoading}
            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
          />
          {hasActiveFilters && (
            <button
              type="button"
              className="btn-secondary h-[48px] px-4 text-sm self-end"
              onClick={clearFilters}
              disabled={isLoading}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              Reset ({activeFilterCount})
            </button>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer - Fixed Overlay */}
      {filtersOpen && (
        <div
          id="mobile-filters"
          className="lg:hidden fixed inset-0 z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-filters-title"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setFiltersOpen(false)}
            aria-hidden="true"
          />
          {/* Drawer Panel */}
          <div
            ref={drawerRef}
            className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-xl flex flex-col"
          >
            <FadeIn delay={0.05}>
              <div className="flex items-center justify-between p-4 border-b border-border/50">
                <h2 id="mobile-filters-title" className="text-[21px] font-medium text-ink">Filters</h2>
                <button
                  type="button"
                  className="text-ink hover:text-accent transition-colors p-2"
                  onClick={() => setFiltersOpen(false)}
                  aria-label="Close filters"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <FilterSelect
                  label="Institution type"
                  id="mobile-institution-type"
                  value={institutionType}
                  onChange={v => { setInstitutionType(v); setPage(0) }}
                  options={[{ value: '', label: 'All types' }, ...institutionTypes.map(t => ({ value: t, label: t }))]}
                  disabled={isLoading}
                />
                <FilterSelect
                  label="Teaching language"
                  id="mobile-teaching-language"
                  value={language}
                  onChange={v => { setLanguage(v); setPage(0) }}
                  options={languageOptions}
                  disabled={isLoading}
                />
                <FilterSelect
                  label="Intake"
                  id="mobile-intake"
                  value={intake}
                  onChange={v => { setIntake(v); setPage(0) }}
                  options={intakeOptions}
                  disabled={isLoading}
                />

                <div className="pt-4 border-t border-border">
                  <div className="text-sm text-muted leading-relaxed mb-4">
                    <p>Search the current imported catalog.</p>
                    <p>Program details may vary by institution.</p>
                  </div>
                  {hasActiveFilters && (
                    <button
                      type="button"
                      className="w-full text-left text-sm font-medium text-accent hover:underline"
                      onClick={clearFilters}
                      disabled={isLoading}
                    >
                      Reset all filters ({activeFilterCount})
                    </button>
                  )}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      )}

      {/* Results Section */}
      <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
        {/* University Grid */}
        <div className="min-w-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <FadeIn delay={0.2}>
              <p className="text-[14px] font-medium text-ink">{showingText}</p>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-sm text-muted">Page {page + 1} of {result.meta.totalPages}</p>
            </FadeIn>
          </div>

          {/* Loading indicator */}
          {isLoading && (
            <div className="mb-6 flex items-center gap-2 text-sm text-muted" role="status" aria-live="polite">
              <svg className="animate-spin h-4 w-4 text-accent" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
              <span>Applying filters...</span>
            </div>
          )}

          {error ? (
            <FadeIn>
              <div className="mt-8"><ErrorState message={error} /></div>
            </FadeIn>
          ) : (
            <>
              <StaggerContainer staggerDelay={0.08} delayChildren={0.3} className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {result.data.map((university, index) => (
                  <StaggerItem key={university.id} customDelay={index * 0.05}>
                    <UniversityCard university={university} />
                  </StaggerItem>
                ))}
              </StaggerContainer>

              {/* Empty state */}
              {result.data.length === 0 && !isLoading && !error && (
                <FadeIn delay={0.3}>
                  <div className="mt-12 text-center py-16 rounded-2xl bg-soft-surface border border-border/50">
                    <svg className="mx-auto h-12 w-12 text-muted/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <h3 className="mt-4 font-display text-lg font-medium text-ink">No universities found</h3>
                    <p className="mt-2 text-sm text-muted">Try adjusting your search or filters.</p>
                    {hasActiveFilters && (
                      <button
                        type="button"
                        className="mt-4 text-sm font-medium text-accent hover:underline"
                        onClick={clearFilters}
                      >
                        Reset all filters
                      </button>
                    )}
                  </div>
                </FadeIn>
              )}

              {/* Pagination */}
              {result.meta.totalPages > 1 && (
                <FadeIn delay={0.4}>
                  <div className="mt-10 flex items-center justify-center gap-4">
                    <button
                      className="btn-secondary h-[44px] px-6 text-sm"
                      disabled={page === 0 || isLoading}
                      onClick={() => setPage(page - 1)}
                    >
                      ← Previous
                    </button>
                    <span className="text-sm text-muted">Page {page + 1} of {result.meta.totalPages}</span>
                    <button
                      className="btn-primary h-[44px] px-6 text-sm"
                      disabled={page >= result.meta.totalPages - 1 || isLoading}
                      onClick={() => setPage(page + 1)}
                    >
                      Next →
                    </button>
                  </div>
                </FadeIn>
              )}
            </>
          )}
        </div>

        {/* Sidebar - Quick Stats */}
        <aside className="hidden lg:block">
          <FadeIn delay={0.5}>
            <div className="rounded-2xl bg-soft-surface p-6 h-fit sticky top-24 border border-border/50">
              <h3 className="text-lg font-medium text-ink mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted">Total Universities</span>
                  <span className="font-display text-xl font-bold text-ink">{result.meta.totalElements}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted">National</span>
                  <span className="font-medium text-red-600">{result.data.filter(u => u.institutionType === 'National').length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted">Public</span>
                  <span className="font-medium text-blue-600">{result.data.filter(u => u.institutionType === 'Public').length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted">Private</span>
                  <span className="font-medium text-purple-600">{result.data.filter(u => u.institutionType === 'Private').length}</span>
                </div>
                <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                  <span className="text-sm text-muted">Verified Photos</span>
                  <span className="font-medium text-emerald-600">{result.data.filter(u => u.images?.[0] && !u.imageIsIllustrative).length} / {result.meta.totalElements}</span>
                </div>
              </div>
            </div>
          </FadeIn>
        </aside>
      </div>
    </div>
  )
}
