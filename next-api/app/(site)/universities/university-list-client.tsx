'use client'

import { useEffect, useState } from 'react'
import { UniversityCard } from '@/components/university-card'
import { ErrorState } from '@/components/public-states'
import { listUniversities, type University } from '@/lib/web-api'
import { StaggerContainer, StaggerItem, FadeIn, SlideUp } from '@/components/ui/Motion'

interface UniversityListClientProps {
  initialData: { data: University[]; meta: { totalPages: number; totalElements: number } }
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

export function UniversityListClient({ initialData }: UniversityListClientProps) {
  const [search, setSearch] = useState('')
  const [submitted, setSubmitted] = useState('')
  const [page, setPage] = useState(0)
  const [result, setResult] = useState(initialData)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [institutionType, setInstitutionType] = useState('')
  const [language, setLanguage] = useState('')
  const [intake, setIntake] = useState('')

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

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8">
      {/* Page Heading */}
      <FadeIn>
        <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-2">FIND YOUR NEXT CHAPTER</p>
        <h1 className="font-display text-[64px] font-normal text-ink mb-4">Japanese Universities</h1>
        <p className="text-[17px] text-muted max-w-[1200px]">Search the imported university catalog.</p>
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
          />
          <button
            className="btn-primary h-[52px] px-8 text-base whitespace-nowrap"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Searching...' : 'Search&nbsp;↗'}
          </button>
        </form>
      </SlideUp>

      {/* Main Content: Filters Sidebar + University Grid */}
      <div className="mt-8 flex gap-8">
        {/* Filters Sidebar - 248px */}
        <aside className="w-[248px] flex-shrink-0" aria-label="Filters">
          <FadeIn delay={0.2}>
            <div className="rounded-2xl bg-soft-surface p-6 h-fit">
              <h2 className="text-[21px] font-medium text-ink mb-6">Filters</h2>

              <div className="space-y-8">
                {/* Institution Type */}
                <div>
                  <label className="block text-[12px] font-semibold text-ink mb-2">Institution type</label>
                  <select
                    className="input-field h-[48px] rounded-xl text-sm"
                    value={institutionType}
                    onChange={(e) => { setInstitutionType(e.target.value); setPage(0) }}
                    disabled={isLoading}
                  >
                    <option value="">All types&nbsp;⌄</option>
                    {institutionTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                {/* Teaching Language */}
                <div>
                  <label className="block text-[12px] font-semibold text-ink mb-2">Teaching language</label>
                  <select
                    className="input-field h-[48px] rounded-xl text-sm"
                    value={language}
                    onChange={(e) => { setLanguage(e.target.value); setPage(0) }}
                    disabled={isLoading}
                  >
                    <option value="">All languages&nbsp;⌄</option>
                    {languageOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>

                {/* Intake */}
                <div>
                  <label className="block text-[12px] font-semibold text-ink mb-2">Intake</label>
                  <select
                    className="input-field h-[48px] rounded-xl text-sm"
                    value={intake}
                    onChange={(e) => { setIntake(e.target.value); setPage(0) }}
                    disabled={isLoading}
                  >
                    <option value="">All intakes&nbsp;⌄</option>
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

        {/* University Grid - 3 columns of 328px */}
        <div className="flex-1 min-w-0">
          {error ? (
            <FadeIn>
              <div className="mt-8"><ErrorState message={error} /></div>
            </FadeIn>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <FadeIn delay={0.2}>
                  <p className="text-[14px] font-medium text-ink">{result.meta.totalElements} universities found</p>
                </FadeIn>
                <FadeIn delay={0.2}>
                  <p className="text-sm text-muted">Page {page + 1} of {result.meta.totalPages}</p>
                </FadeIn>
              </div>

              <StaggerContainer staggerDelay={0.08} delayChildren={0.3} className="grid gap-6 grid-cols-3">
                {result.data.map((university, index) => (
                  <StaggerItem key={university.id} customDelay={index * 0.05}>
                    <UniversityCard university={university} />
                  </StaggerItem>
                ))}
              </StaggerContainer>

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
                      Next&nbsp;→
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