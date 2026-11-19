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
  const [filtersOpen, setFiltersOpen] = useState(false)
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
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <FadeIn>
        <h1 className="section-title">Japanese Universities</h1>
        <p className="mt-2 text-ink-800/60 dark:text-ink-50/60">Search the imported university catalog.</p>
      </FadeIn>
      <SlideUp delay={0.1}>
        <div className="mt-8 space-y-4">
          <form className="glass-card flex gap-3" onSubmit={(event) => { event.preventDefault(); setPage(0); setSubmitted(search.trim()) }}>
            <input className="input-field flex-1" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search universities, programs, faculty..." />
            <button className="btn-primary" type="submit" disabled={isLoading}>{isLoading ? 'Searching...' : 'Search'}</button>
          </form>

          <div className="glass-card">
            <button type="button" className="w-full flex items-center justify-between p-4" onClick={() => setFiltersOpen(!filtersOpen)}>
              <span className="font-medium">Filters</span>
              <svg className={`w-5 h-5 text-ink-800/60 dark:text-ink-50/60 transition-transform ${filtersOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {filtersOpen && (
              <div className="px-4 pb-4 space-y-4 border-t border-ink-800/10 dark:border-ink-50/10">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <label className="block text-sm font-medium text-ink-800/70 dark:text-ink-50/70 mb-1">Institution Type</label>
                    <select className="input-field" value={institutionType} onChange={(e) => { setInstitutionType(e.target.value); setPage(0) }}>
                      <option value="">All types</option>
                      {institutionTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink-800/70 dark:text-ink-50/70 mb-1">Language</label>
                    <select className="input-field" value={language} onChange={(e) => { setLanguage(e.target.value); setPage(0) }}>
                      {languageOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink-800/70 dark:text-ink-50/70 mb-1">Intake</label>
                    <select className="input-field" value={intake} onChange={(e) => { setIntake(e.target.value); setPage(0) }}>
                      {intakeOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink-800/70 dark:text-ink-50/70 mb-1">Pre-arrival Admission</label>
                    <select className="input-field" value={preArrival} onChange={(e) => { setPreArrival(e.target.value); setPage(0) }}>
                      {preArrivalOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                </div>
                {hasActiveFilters && (
                  <button type="button" className="btn-secondary text-sm" onClick={clearFilters}>Clear filters</button>
                )}
              </div>
            )}
          </div>
        </div>
      </SlideUp>
      {error ? (
        <FadeIn>
          <div className="mt-8"><ErrorState message={error} /></div>
        </FadeIn>
      ) : (
        <>
          <FadeIn delay={0.2}>
            <p className="mt-8 text-sm text-ink-800/60 dark:text-ink-50/60">{result.meta.totalElements} universities found</p>
          </FadeIn>
          <StaggerContainer staggerDelay={0.08} delayChildren={0.2} className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {result.data.map((university, index) => (
              <StaggerItem key={university.id} customDelay={index * 0.05}>
                <UniversityCard university={university} />
              </StaggerItem>
            ))}
          </StaggerContainer>
          {result.meta.totalPages > 1 && (
            <FadeIn delay={0.3}>
              <div className="mt-10 flex justify-center gap-3">
                <button className="btn-secondary" disabled={page === 0 || isLoading} onClick={() => setPage(page - 1)}>Previous</button>
                <span className="rounded-xl px-4 py-3 glass flex items-center">Page {page + 1} / {result.meta.totalPages}</span>
                <button className="btn-secondary" disabled={page >= result.meta.totalPages - 1 || isLoading} onClick={() => setPage(page + 1)}>Next</button>
              </div>
            </FadeIn>
          )}
        </>
      )}
    </section>
  )
}