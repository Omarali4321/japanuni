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
      setError('Select at least 2 universities with ?ids=1,3')
      setIsLoading(false)
      return
    }
    if (ids.length > 4) {
      setError('You can compare up to 4 universities. Please adjust your selection.')
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
      <section className="mx-auto max-w-content px-4 py-8 sm:px-6 lg:px-8">
        <FadeIn>
          <h1 className="section-title">Compare Universities</h1>
          <div className="mt-8"><ErrorState message={error} /></div>
        </FadeIn>
      </section>
    )
  }

  if (isLoading || !items) {
    return (
      <section className="mx-auto max-w-content px-4 py-8 sm:px-6 lg:px-8">
        <FadeIn>
          <Link href="/universities" className="text-sm text-accent">← Universities</Link>
          <h1 className="section-title mt-4">Compare Universities</h1>
        </FadeIn>
        <SlideUp delay={0.1}>
          <CompareTableSkeleton cols={3} rows={6} />
        </SlideUp>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-content px-4 py-8 sm:px-6 lg:px-8">
      <FadeIn>
        <Link href="/universities" className="text-sm text-accent">← Universities</Link>
        <h1 className="section-title mt-4">Compare Universities</h1>
      </FadeIn>
      <SlideUp delay={0.1}>
        <div className="mt-8 overflow-x-auto card">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="p-4">Criteria</th>
                {items.map((item) => (
                  <th className="min-w-[220px] p-4 font-display" key={item.id}>
                    <Link href={`/universities/${item.id}`} className="hover:text-accent">{item.name}</Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(([label, getter], rowIndex) => (
                <StaggerItem key={label as string} customDelay={rowIndex * 0.03}>
                  <tr className="border-b border-border align-top">
                    <td className="p-4 font-medium text-muted">{label as string}</td>
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
