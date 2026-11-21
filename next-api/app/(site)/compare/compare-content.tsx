'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { compareUniversities, type University } from '@/lib/web-api'
import { ErrorState } from '@/components/public-states'
import { FadeIn, SlideUp, StaggerItem } from '@/components/ui/Motion'
import { CompareTableSkeleton } from '@/components/ui/Skeleton'

export default function CompareContent() {
  const params = useSearchParams()
  const [items, setItems] = useState<University[] | null>(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    const ids = (params.get('ids') || '').split(',').map(Number).filter(Boolean)
    if (ids.length < 2) {
      setError('Select at least 2 universities to compare')
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    compareUniversities(ids)
      .then(setItems)
      .catch((reason) => setError(reason.message))
      .finally(() => setIsLoading(false))
  }, [params])

  const rows = [
    ['City', (u: University) => u.cityName || '—'],
    ['Type', (u: University) => u.institutionType || '—'],
    ['Degree', (u: University) => u.degree || '—'],
    ['Instruction', (u: University) => u.mediumOfInstruction || '—'],
    ['Pre-arrival', (u: University) => u.preArrivalAdmission || '—'],
    ['Programs', (u: University) => u.programs || '—'],
  ]

  if (error) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <FadeIn>
          <Link href="/universities" className="text-sm text-accent hover:underline mb-4 inline-block">← Back to Universities</Link>
          <h1 className="section-title">Compare Universities</h1>
          <div className="mt-8"><ErrorState message={error} /></div>
          <div className="mt-8 text-center">
            <Link className="btn-primary h-[48px] px-8 text-base" href="/universities">
              Select Universities ↗
            </Link>
          </div>
        </FadeIn>
      </section>
    )
  }

  if (isLoading || !items) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <FadeIn>
          <Link href="/universities" className="text-sm text-accent hover:underline mb-4 inline-block">← Back to Universities</Link>
          <h1 className="section-title mt-4">Compare Universities</h1>
          <p className="mt-2 text-muted">Select universities from the catalog to compare them side by side.</p>
          <div className="mt-8 text-center">
            <Link className="btn-primary h-[48px] px-8 text-base" href="/universities">
              Select Universities ↗
            </Link>
          </div>
        </FadeIn>
        <SlideUp delay={0.1}>
          <CompareTableSkeleton cols={3} rows={6} />
        </SlideUp>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <FadeIn>
        <Link href="/universities" className="text-sm text-accent hover:underline mb-4 inline-block">← Back to Universities</Link>
        <h1 className="section-title mt-4">Compare Universities</h1>
      </FadeIn>
      <SlideUp delay={0.1}>
        <div className="mt-8 overflow-x-auto rounded-2xl border border-border bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="p-4 font-medium text-ink/60 bg-soft-surface">Criteria</th>
                {items.map((item) => (
                  <th className="min-w-[220px] p-4 font-display" key={item.id}>
                    <Link href={`/universities/${item.id}`} className="hover:text-accent transition-colors">{item.name}</Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(([label, getter], rowIndex) => (
                <StaggerItem key={label as string} customDelay={rowIndex * 0.03}>
                  <tr className="border-b border-border/50 align-top">
                    <td className="p-4 font-medium text-ink/60 bg-soft-surface/50">{label as string}</td>
                    {items.map((item) => (
                      <td className="p-4" key={item.id}>{(getter as (u: University) => string)(item)}</td>
                    ))}
                  </tr>
                </StaggerItem>
              ))}
            </tbody>
          </table>
        </div>
      </SlideUp>
    </section>
  )
}
