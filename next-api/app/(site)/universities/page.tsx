'use client'

import { useEffect, useState } from 'react'
import { UniversityCard } from '@/components/university-card'
import { ErrorState, LoadingState } from '@/components/public-states'
import { listUniversities, type University } from '@/lib/web-api'

export default function Page() {
  const [search, setSearch] = useState('')
  const [submitted, setSubmitted] = useState('')
  const [page, setPage] = useState(0)
  const [result, setResult] = useState<{ data: University[]; meta: { totalPages: number; totalElements: number } } | null>(null)
  const [error, setError] = useState('')
  useEffect(() => { const params = new URLSearchParams({ page: String(page), size: '12' }); if (submitted) params.set('search', submitted); setError(''); listUniversities(params).then(setResult).catch((reason) => setError(reason.message)) }, [page, submitted])
  return <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"><h1 className="section-title">Japanese Universities</h1><p className="mt-2 text-ink-800/60 dark:text-ink-50/60">Search the imported university catalog.</p><form className="glass-card mt-8 flex gap-3" onSubmit={(event) => { event.preventDefault(); setPage(0); setSubmitted(search.trim()) }}><input className="input-field" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search universities, programs, faculty..." /><button className="btn-primary" type="submit">Search</button></form>{error ? <div className="mt-8"><ErrorState message={error} /></div> : !result ? <div className="mt-8"><LoadingState /></div> : <><p className="mt-8 text-sm text-ink-800/60 dark:text-ink-50/60">{result.meta.totalElements} universities found</p><div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{result.data.map((university) => <UniversityCard key={university.id} university={university} />)}</div>{result.meta.totalPages > 1 && <div className="mt-10 flex justify-center gap-3"><button className="btn-secondary" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</button><span className="rounded-xl px-4 py-3 glass">Page {page + 1} / {result.meta.totalPages}</span><button className="btn-secondary" disabled={page >= result.meta.totalPages - 1} onClick={() => setPage(page + 1)}>Next</button></div>}</>}</section>
}
