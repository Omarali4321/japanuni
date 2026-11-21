'use client'

import { useState, useEffect } from 'react'
import { ErrorState } from '@/components/public-states'
import { FadeIn, SlideUp, StaggerContainer, StaggerItem, HoverLift } from '@/components/ui/Motion'
import { ListItemSkeleton } from '@/components/ui/Skeleton'

interface Scholarship {
  id: number
  title: string
  description: string | null
  amountYearly: string | null
  coverage: string | null
  deadlineMonth: string | null
  eligibility: string | null
  universityId: number | null
}

interface ScholarshipsContentProps {
  initialScholarships: Scholarship[]
}

export default function ScholarshipsContent({ initialScholarships }: ScholarshipsContentProps) {
  const [search, setSearch] = useState('')
  const [items, setItems] = useState<Scholarship[]>(initialScholarships)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Client-side search filtering
  useEffect(() => {
    if (!search) {
      setItems(initialScholarships)
      return
    }
    const filtered = initialScholarships.filter((item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase()) ||
      item.eligibility?.toLowerCase().includes(search.toLowerCase())
    )
    setItems(filtered)
  }, [search, initialScholarships])

  return (
    <section className="mx-auto max-w-content px-4 py-8 sm:px-6 lg:px-8">
      <FadeIn>
        <h1 className="section-title">Scholarships</h1>
        <p className="mt-2 text-muted">Government and university funding for your studies in Japan</p>
        <div className="mt-6">
          <input className="input-field max-w-md" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search scholarships..." />
        </div>
      </FadeIn>
      <SlideUp delay={0.1}>
        {error && <FadeIn><div className="mt-8"><ErrorState message={error} /></div></FadeIn>}
        {isLoading && (
          <StaggerContainer staggerDelay={0.08} className="mt-8 grid gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <StaggerItem key={i}><ListItemSkeleton /></StaggerItem>
            ))}
          </StaggerContainer>
        )}
        {!isLoading && items?.length === 0 && <FadeIn><div className="card mt-8 text-center py-8 text-muted">No scholarships match your search.</div></FadeIn>}
        {!isLoading && items && items.length > 0 && (
          <StaggerContainer staggerDelay={0.08} className="mt-8 grid gap-6">
            {items.map((item, index) => (
              <StaggerItem key={String(item.id)} customDelay={index * 0.05}>
                <HoverLift>
                  <article className="card">
                    <h2 className="font-display text-xl font-semibold text-ink">{item.title}</h2>
                    {item.universityId ? <p className="mt-1 text-sm text-muted">University-specific</p> : null}
                    <p className="mt-3 text-sm text-muted">{item.description || ''}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.amountYearly && <span className="badge-type">¥{item.amountYearly}/yr</span>}
                      {item.coverage && <span className="badge-language">{item.coverage}</span>}
                      {item.deadlineMonth && <span className="badge-intake">Deadline: {item.deadlineMonth}</span>}
                      {item.eligibility && <span className="badge-type">Eligibility: {item.eligibility}</span>}
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
