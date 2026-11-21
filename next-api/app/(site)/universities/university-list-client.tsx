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
const preArrivalOptions = [
  { value: '', label: 'All' },
  { value: 'Yes', label: 'Yes' },
  { value: 'No', label: 'No' },
]

function normalizeLanguage(lang: string): string {
  if (lang.includes('Japanese (100%)') && lang.includes('English (100%)')) return 'Both'
  if (lang.includes('Japanese (100%)')) return 'Japanese (100%)'
  if (lang.includes('English (100%)')) return 'English (100%)'
  return 'Both'
}

function normalizeIntake(intake: string): string {
  if (intake.includes('April') && !intake.includes('October') && !intake.includes('September')) return 'April'
  if (intake.includes('October') && !intake.includes('April') && !intake.includes('September')) return 'October'
  if (intake.includes('September') && !intake.includes('April') && !intake.includes('October')) return 'September'
  return 'Other'
}

function normalizePreArrival(pre: string): string {
  if (pre.includes('Yes') && !pre.includes('No')) return 'Yes'
  if (pre.includes('No') && !pre.includes('Yes')) return 'No'
  return ''
}

export function UniversityListClient({ initialData }: UniversityListClientProps) {
  const [search, setSearch] = useState('')
  const [submitted, setSubmitted] = useState('')
  const [page, setPage] = useState(0)
  const [result, setResult] = useState(initialData)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(true) // Open by default on desktop
  const [institutionType, setInstitutionType] = useState('')
  const [language, setLanguage] = useState('')
  const [intake, setIntake] = useState('')
  const [preArrival, setPreArrival] = useState('')

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    const params = new URLSearchParams({ page: String(page), size: '12' })
    if (submitted) params.set('search', submitted)
    if (institutionType) params.set('institutionType', institutionType)
    if (language) params.set('mediumOfInstruction', language)
    if (intake) params.set('intake', intake)
    if (preArrival) params.set('preArrivalAdmission', preArrival)
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
  }, [page, submitted, institutionType, language, intake, preArrival])

  const hasActiveFilters = institutionType || language || intake || preArrival

  const clearFilters = () => {
    setInstitutionType('')
    setLanguage('')
    setIntake('')
    setPreArrival('')
    setPage(0)
  }

  return (
    <section className="mx-auto max-w-content px-4 py-8 sm:px-6 lg:px-8">
      <FadeIn>
        <h1 className="section-title">Japanese Universities</h1>
        <p className="mt-2 text-muted">Search the imported university catalog.</p>
      </FadeIn>
      <SlideUp delay={0.1}>
        <div className="mt-8 flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - 248px */}
          <aside className="lg:w-[248px] flex-shrink-0 hidden lg:block">
            <div className="card sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-sans font-semibold text-ink">Filters</h3>
                {hasActiveFilters && (
                  <button type="button" className="btn-ghost text-sm" onClick={clearFilters}>Clear all</button>
                )}
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">Institution Type</label>
                  <select className="input-field w-full" value={institutionType} onChange={(e) => { setInstitutionType(e.target.value); setPage(0) }}>
                    <option value="">All types</option>
                    {institutionTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">Language</label>
                  <select className="input-field w-full" value={language} onChange={(e) => { setLanguage(e.target.value); setPage(0) }}>
                    {languageOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">Intake</label>
                  <select className="input-field w-full" value={intake} onChange={(e) => { setIntake(e.target.value); setPage(0) }}>
                    {intakeOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">Pre-arrival Admission</label>
                  <select className="input-field w-full" value={preArrival} onChange={(e) => { setPreArrival(e.target.value); setPage(0) }}>
                    {preArrivalOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile filters toggle */}
          <div className="lg:hidden mb-4">
            <button
              type="button"
              className={`btn-secondary w-full ${filtersOpen ? 'bg-accent/10 border-accent' : ''}`}
              onClick={() => setFiltersOpen(!filtersOpen)}
            >
              Filters {hasActiveFilters && <span className="ml-2 px-2 py-0.5 text-xs bg-accent/20 text-accent rounded-full">{[institutionType, language, intake, preArrival].filter(Boolean).length}</span>}
            </button>
            {filtersOpen && (
              <div className="card mt-4 p-4 space-y-4 animate-slide-down">
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">Institution Type</label>
                  <select className="input-field w-full" value={institutionType} onChange={(e) => { setInstitutionType(e.target.value); setPage(0) }}>
                    <option value="">All types</option>
                    {institutionTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">Language</label>
                  <select className="input-field w-full" value={language} onChange={(e) => { setLanguage(e.target.value); setPage(0) }}>
                    {languageOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">Intake</label>
                  <select className="input-field w-full" value={intake} onChange={(e) => { setIntake(e.target.value); setPage(0) }}>
                    {intakeOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">Pre-arrival Admission</label>
                  <select className="input-field w-full" value={preArrival} onChange={(e) => { setPreArrival(e.target.value); setPage(0) }}>
                    {preArrivalOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                {hasActiveFilters && (
                  <button type="button" className="btn-secondary w-full text-sm" onClick={clearFilters}>Clear all</button>
                )}
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Search Bar */}
            <form className="card p-4 mb-6" onSubmit={(event) => { event.preventDefault(); setPage(0); setSubmitted(search.trim()) }}>
              <div className="flex gap-3">
                <svg className="w-5 h-5 text-muted mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  className="input-field flex-1 bg-transparent border-0 focus-visible:ring-0 p-0"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search universities, programs, faculty..."
                  disabled={isLoading}
                />
                <button className="btn-primary whitespace-nowrap flex-shrink-0" type="submit" disabled={isLoading}>
                  {isLoading ? 'Searching...' : 'Search'}
                </button>
              </div>
            </form>

            {/* Results Count */}
            <FadeIn delay={0.2}>
              <p className="mb-4 text-sm text-muted">{result.meta.totalElements} universities found</p>
            </FadeIn>

            {/* University Grid - 3 columns */}
            {error ? (
              <FadeIn>
                <div className="mt-8"><ErrorState message={error} /></div>
              </FadeIn>
            ) : (
              <>
                <StaggerContainer staggerDelay={0.08} delayChildren={0.2} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {result.data.map((university, index) => (
                    <StaggerItem key={university.id} customDelay={index * 0.05}>
                      <UniversityCard university={university} />
                    </StaggerItem>
                  ))}
                </StaggerContainer>

                {/* Pagination */}
                {result.meta.totalPages > 1 && (
                  <FadeIn delay={0.3}>
                    <div className="mt-10 flex justify-center gap-3">
                      <button
                        className="btn-secondary"
                        disabled={page === 0 || isLoading}
                        onClick={() => setPage(page - 1)}
                      >
                        Previous
                      </button>
                      <span className="card flex items-center px-4 py-3 text-sm text-muted">
                        Page {page + 1} / {result.meta.totalPages}
                      </span>
                      <button
                        className="btn-secondary"
                        disabled={page >= result.meta.totalPages - 1 || isLoading}
                        onClick={() => setPage(page + 1)}
                      >
                        Next
                      </button>
                    </div>
                  </FadeIn>
                )}
              </>
            )}
          </div>
        </div>
      </SlideUp>
    </section>
  )
}