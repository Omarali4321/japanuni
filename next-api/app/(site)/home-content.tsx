'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { UniversityCard } from '@/components/university-card'
import { ErrorState, LoadingState } from '@/components/public-states'
import { listUniversities, type University } from '@/lib/web-api'

export default function HomeContent() {
  const [universities, setUniversities] = useState<University[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    listUniversities(new URLSearchParams({ page: '0', size: '3' })).then((result) => setUniversities(result.data)).catch((reason) => setError(reason.message))
  }, [])

  return <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
    <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
      <div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-sakura-500">🇯🇵 Study in Japan</p><h1 className="mt-4 font-display text-4xl font-bold md:text-6xl">Your journey to Japanese universities starts here</h1><p className="mt-5 max-w-2xl text-lg text-ink-800/70 dark:text-ink-50/70">Compare programs, discover scholarships, and plan your student life in Japan.</p><div className="mt-8 flex flex-wrap gap-4"><Link className="btn-primary" href="/universities">Explore Universities</Link><Link className="btn-secondary" href="/compare">Compare choices</Link></div></div>
      <div className="glass-card"><p className="text-sm font-semibold text-sakura-500">JapanUni guide</p><h2 className="mt-3 font-display text-2xl font-semibold">One place for research, comparison, and planning.</h2><div className="mt-6 grid grid-cols-2 gap-3 text-sm"><div className="rounded-xl bg-sakura-500/10 p-4">🎓 Universities</div><div className="rounded-xl bg-sakura-500/10 p-4">💴 Scholarships</div><div className="rounded-xl bg-sakura-500/10 p-4">📋 Admission</div><div className="rounded-xl bg-sakura-500/10 p-4">🛂 Visa help</div></div></div>
    </section>
    <section className="mt-20"><div className="mb-8 flex items-end justify-between"><div><h2 className="section-title">Featured universities</h2><p className="mt-2 text-ink-800/60 dark:text-ink-50/60">Explore institutions from the current catalog.</p></div><Link href="/universities" className="btn-secondary">View all</Link></div>{error ? <ErrorState message={error} /> : universities.length ? <div className="grid gap-6 md:grid-cols-3">{universities.map((university) => <UniversityCard key={university.id} university={university} />)}</div> : <LoadingState />}</section>
  </div>
}
