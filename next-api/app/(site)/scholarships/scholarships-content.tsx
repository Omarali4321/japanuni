'use client'

import { useEffect, useState } from 'react'
import { ErrorState, LoadingState } from '@/components/public-states'
import { listScholarships } from '@/lib/web-api'

export default function ScholarshipsContent() {
  const [search, setSearch] = useState('')
  const [items, setItems] = useState<Array<Record<string, unknown>> | null>(null)
  const [error, setError] = useState('')
  useEffect(() => { const params = new URLSearchParams({ page: '0', size: '50' }); if (search) params.set('search', search); listScholarships(params).then((result) => setItems(result.data)).catch((reason) => setError(reason.message)) }, [search])
  return <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"><h1 className="section-title">Scholarships in Japan</h1><p className="mt-2 text-ink-800/60 dark:text-ink-50/60">Government and university funding for your studies.</p><input className="input-field mt-8 max-w-md" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search scholarships..." />{error ? <div className="mt-8"><ErrorState message={error} /></div> : !items ? <div className="mt-8"><LoadingState /></div> : items.length === 0 ? <div className="glass-card mt-8 text-center text-ink-800/60 dark:text-ink-50/60">No scholarships have been published yet.</div> : <div className="mt-8 grid gap-6 md:grid-cols-2">{items.map((item) => <article className="glass-card" key={String(item.id)}><h2 className="font-display text-xl font-semibold text-sakura-500">{String(item.title)}</h2>{item.universityName ? <p className="mt-1 text-sm text-ink-800/60 dark:text-ink-50/60">{String(item.universityName)}</p> : null}<p className="mt-3 text-sm">{String(item.description || '')}</p><div className="mt-4 flex flex-wrap gap-2 text-xs"><span className="rounded-md glass px-2 py-1">¥{String(item.amountYearly || '—')}/yr</span><span className="rounded-md glass px-2 py-1">{String(item.coverage || 'Details pending')}</span><span className="rounded-md glass px-2 py-1">Deadline: {String(item.deadlineMonth || '—')}</span></div></article>)}</div>}</section>
}
