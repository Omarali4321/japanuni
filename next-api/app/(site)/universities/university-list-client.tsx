'use client'

import { useEffect, useState } from 'react'
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
    <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8">
      {/* Page Heading */}
      <FadeIn>
        <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-2">FIND YOUR NEXT CHAPTER</p>
        <h1 className="font-display text-[64px] font-normal text-ink mb-4">Japanese Universities</h1>
        <p className="text-[17px] text-muted max-w-[1200px]">Search the imported university catalog.</p>
        <p className="mt-4 text-sm text-muted">Data source: JASSO School Search Result CSV · Last updated: {buildDate}</p>
      </FadeIn>

      {/* Search Bar */}
      <SlideUp delay={0.1}>
        <form className="mt-10 flex gap-3" onSubmit={(event) => { event.preventDefault(); setPage(0); setSubmitted(search.trim()) }}>
          <input
            className="input-field flex-1 h-[52px] rounded-xl"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by university or program"
            disabled={isLoading}
            aria-label="Search universities"
          />
          <button
            className="btn-primary h-[52px] px-8 text-base whitespace-nowrap"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Searching...' : 'Search ↗'}
          </button>
        </form>
      </SlideUp>

      {/* Mobile Filters Toggle Button */}
      <div className="lg:hidden mt-6">
        <button
          type="button"
          className={`btn-secondary w-full h-[48px] flex items-center justify-between gap-4 ${isLoading ? 'opacity-50' : ''}`}
          onClick={() => setFiltersOpen(!filtersOpen)}
          disabled={isLoading}
          aria-expanded={filtersOpen}
          aria-controls="mobile-filters"
        >
          <span className="text-sm font-medium text-ink">Filters</span>
          {hasActiveFilters && <span className="bg-accent/10 text-accent text-xs px-2 py-0.5 rounded-full font-medium">{institutionType ? 1 : 0 + language ? 1 : 0 + intake ? 1 : 0}</span>}
          <svg className={`w-5 h-5 text-ink transition-transform ${filtersOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </button>
      </div>

      {/* Main Content: Filters Sidebar + University Grid */}
      <div className="mt-8 flex gap-8">
        {/* Filters Sidebar - 248px (Desktop) / Collapsible Drawer (Mobile) */}
        <aside className="w-[248px] flex-shrink-0 hidden lg:block" aria-label="Filters">
          <FadeIn delay={0.2}>
            <div className="rounded-2xl bg-soft-surface p-6 h-fit sticky top-24">
              <h2 className="text-[21px] font-medium text-ink mb-6">Filters</h2>

              <div className="space-y-8">
                {/* Institution Type */}
                <div>
                  <label className="block text-[12px] font-semibold text-ink mb-2" htmlFor="institution-type">Institution type</label>
                  <select
                    id="institution-type"
                    className="input-field h-[48px] rounded-xl text-sm"
                    value={institutionType}
                    onChange={(e) => { setInstitutionType(e.target.value); setPage(0) }}
                    disabled={isLoading}
                  >
                    <option value="">All types ⌄</option>
                    {institutionTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                {/* Teaching Language */}
                <div>
                  <label className="block text-[12px] font-semibold text-ink mb-2" htmlFor="teaching-language">Teaching language</label>
                  <select
                    id="teaching-language"
                    className="input-field h-[48px] rounded-xl text-sm"
                    value={language}
                    onChange={(e) => { setLanguage(e.target.value); setPage(0) }}
                    disabled={isLoading}
                  >
                    <option value="">All languages ⌄</option>
                    {languageOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>

                {/* Intake */}
                <div>
                  <label className="block text-[12px] font-semibold text-ink mb-2" htmlFor="intake">Intake</label>
                  <select
                    id="intake"
                    className="input-field h-[48px] rounded-xl text-sm"
                    value={intake}
                    onChange={(e) => { setIntake(e.target.value); setPage(0) }}
                    disabled={isLoading}
                  >
                    <option value="">All intakes ⌄</option>
                    {intakeOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>

                {/* Help text */}
                <div className="text-sm text-muted leading-relaxed">
                  <p>Search the current</p>
                  <p>imported catalog.</p>
                  <p>Program details may vary</p>
                  <p>by institution.</p>
                </div>

                {/* Reset Filters */}
                {hasActiveFilters && (
                  <button
                    type="button"
                    className="w-full text-left text-sm font-medium text-accent hover:underline mt-4"
                    onClick={clearFilters}
                    disabled={isLoading}
                  >
                    Reset filters
                  </button>
                )}
              </div>
            </div>
          </FadeIn>
        </aside>

        {/* Mobile Filters Drawer */}
        <div id="mobile-filters" className={`lg:hidden ${filtersOpen ? 'block' : 'hidden'}`} role="region" aria-label="Mobile filters">
          <FadeIn delay={0.2}>
            <div className="rounded-2xl bg-soft-surface p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[21px] font-medium text-ink">Filters</h2>
                <button
                  type="button"
                  className="text-ink hover:text-accent transition-colors"
                  onClick={() => setFiltersOpen(false)}
                  aria-label="Close filters"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Institution Type */}
                <div>
                  <label className="block text-[12px] font-semibold text-ink mb-2" htmlFor="mobile-institution-type">Institution type</label>
                  <select
                    id="mobile-institution-type"
                    className="input-field h-[48px] rounded-xl text-sm"
                    value={institutionType}
                    onChange={(e) => { setInstitutionType(e.target.value); setPage(0) }}
                    disabled={isLoading}
                  >
                    <option value="">All types ⌄</option>
                    {institutionTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                {/* Teaching Language */}
                <div>
                  <label className="block text-[12px] font-semibold text-ink mb-2" htmlFor="mobile-teaching-language">Teaching language</label>
                  <select
                    id="mobile-teaching-language"
                    className="input-field h-[48px] rounded-xl text-sm"
                    value={language}
                    onChange={(e) => { setLanguage(e.target.value); setPage(0) }}
                    disabled={isLoading}
                  >
                    <option value="">All languages ⌄</option>
                    {languageOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>

                {/* Intake */}
                <div>
                  <label className="block text-[12px] font-semibold text-ink mb-2" htmlFor="mobile-intake">Intake</label>
                  <select
                    id="mobile-intake"
                    className="input-field h-[48px] rounded-xl text-sm"
                    value={intake}
                    onChange={(e) => { setIntake(e.target.value); setPage(0) }}
                    disabled={isLoading}
                  >
                    <option value="">All intakes ⌄</option>
                    {intakeOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>

                {/* Help text */}
                <div className="text-sm text-muted leading-relaxed pt-4 border-t border-border">
                  <p>Search the current</p>
                  <p>imported catalog.</p>
                  <p>Program details may vary</p>
                  <p>by institution.</p>
                </div>

                {/* Reset Filters */}
                {hasActiveFilters && (
                  <button
                    type="button"
                    className="w-full text-left text-sm font-medium text-accent hover:underline mt-2"
                    onClick={clearFilters}
                    disabled={isLoading}
                  >
                    Reset filters
                  </button>
                )}
              </div>
            </div>
          </FadeIn>
        </div>

        {/* University Grid - Responsive: 1 col mobile, 2 col tablet, 3 col desktop */}
        <div className="flex-1 min-w-0">
          {error ? (
            <FadeIn>
              <div className="mt-8"><ErrorState message={error} /></div>
            </FadeIn>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
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
                  <div className="mt-12 text-center py-16">
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
                  <div className="mt-10 flex items-center justify-between">
                    <button
                      className="btn-secondary h-[40px] px-5 text-sm"
                      disabled={page === 0 || isLoading}
                      onClick={() => setPage(page - 1)}
                    >
                      Previous
                    </button>
                    <button
                      className="btn-primary h-[40px] px-5 text-sm"
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
      </div>
    </div>
  )
}