'use client'

import { useEffect, useState } from 'react'
import { ErrorState } from '@/components/public-states'
import { listScholarships } from '@/lib/web-api'
import { FadeIn, SlideUp, StaggerContainer, StaggerItem, HoverLift } from '@/components/ui/Motion'
import { ListItemSkeleton } from '@/components/ui/Skeleton'

export default function ScholarshipsContent() {
  const [search, setSearch] = useState('')
  const [items, setItems] = useState<Array<Record<string, unknown>> | null>(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const params = new URLSearchParams({ page: '0', size: '50' })
    if (search) params.set('search', search)
    setIsLoading(true)
    listScholarships(params)
      .then((result) => setItems(result.data))
      .catch((reason) => setError(reason.message))
      .finally(() => setIsLoading(false))
  }, [search])

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <FadeIn>
        <h1 className="section-title">Scholarships in Japan</h1>
        <p className="mt-2 text-ink-800/60 dark:text-ink-50/60">Government and university funding for your studies.</p>
        <input className="input-field mt-8 max-w-md" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search scholarships..." />
      </FadeIn>
      <SlideUp delay={0.1}>
        {error && <FadeIn><div className="mt-8"><ErrorState message={error} /></div></FadeIn>}
        {isLoading && (
          <StaggerContainer staggerDelay={0.08} className="mt-8 grid gap-6 md:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <StaggerItem key={i}><ListItemSkeleton /></StaggerItem>
            ))}
          </StaggerContainer>
        )}
        {!isLoading && items?.length === 0 && <FadeIn><div className="glass-card mt-8 text-center text-ink-800/60 dark:text-ink-50/60">No scholarships have been published yet.</div></FadeIn>}
        {!isLoading && items && items.length > 0 && (
          <StaggerContainer staggerDelay={0.08} className="mt-8 grid gap-6 md:grid-cols-2">
            {items.map((item, index) => (
              <StaggerItem key={String(item.id)} customDelay={index * 0.05}>
                <HoverLift>
                  <article className="glass-card">
                    <h2 className="font-display text-xl font-semibold text-sakura-500">{String(item.title)}</h2>
                    {item.universityName ? <p className="mt-1 text-sm text-ink-800/60 dark:text-ink-50/60">{String(item.universityName)}</p> : null}
                    <p className="mt-3 text-sm">{String(item.description || '')}</p>
                    <div className="mt-4 flex flex-wrap gap-2 text-xs">
                      <span className="rounded-md glass px-2 py-1">¥{String(item.amountYearly || '—')}/yr</span>
                      <span className="rounded-md glass px-2 py-1">{String(item.coverage || 'Details pending')}</span>
                      <span className="rounded-md glass px-2 py-1">Deadline: {String(item.deadlineMonth || '—')}</span>
                    </div>
                  </article>
                </HoverLift>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </SlideUp>
    </section>
  )
}
