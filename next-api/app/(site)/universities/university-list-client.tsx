'use client'

import { useEffect, useState } from 'react'
import { UniversityCard } from '@/components/university-card'
import { ErrorState } from '@/components/public-states'
import { listUniversities, type University } from '@/lib/web-api'
import { StaggerContainer, StaggerItem, FadeIn, SlideUp } from '@/components/ui/Motion'

interface UniversityListClientProps {
  initialData: { data: University[]; meta: { totalPages: number; totalElements: number } }
}

export function UniversityListClient({ initialData }: UniversityListClientProps) {
  const [search, setSearch] = useState('')
  const [submitted, setSubmitted] = useState('')
  const [page, setPage] = useState(0)
  const [result, setResult] = useState(initialData)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    const params = new URLSearchParams({ page: String(page), size: '12' })
    if (submitted) params.set('search', submitted)
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
  }, [page, submitted])

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <FadeIn>
        <h1 className="section-title">Japanese Universities</h1>
        <p className="mt-2 text-ink-800/60 dark:text-ink-50/60">Search the imported university catalog.</p>
      </FadeIn>
      <SlideUp delay={0.1}>
        <form className="glass-card mt-8 flex gap-3" onSubmit={(event) => { event.preventDefault(); setPage(0); setSubmitted(search.trim()) }}>
          <input className="input-field" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search universities, programs, faculty..." />
          <button className="btn-primary" type="submit" disabled={isLoading}>{isLoading ? 'Searching...' : 'Search'}</button>
        </form>
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