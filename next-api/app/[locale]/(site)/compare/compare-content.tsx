'use client'

import { Link } from '@/i18n/navigation'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useApiError } from '@/lib/use-api-error'
import { typeLabel } from '@/components/university-card'
import { compareUniversities, type University } from '@/lib/web-api'
import { ErrorState } from '@/components/public-states'
import { FadeIn, SlideUp, StaggerItem } from '@/components/ui/Motion'
import { CompareTableSkeleton } from '@/components/ui/Skeleton'

export default function CompareContent() {
  const params = useSearchParams()
  const t = useTranslations('Compare')
  const tc = useTranslations('UniversityCard')
  const apiError = useApiError()
  const [items, setItems] = useState<University[] | null>(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    const ids = (params.get('ids') || '').split(',').map(Number).filter(Boolean)
    if (ids.length < 2) {
      setError(t('selectAtLeast'))
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    compareUniversities(ids)
      .then(setItems)
      .catch((reason) => setError(apiError(reason)))
      .finally(() => setIsLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  const rows = [
    ['rowCity', (u: University) => u.cityName || '—'],
    ['rowType', (u: University) => (u.institutionType ? typeLabel(u.institutionType, tc) : '—')],
    ['rowDegree', (u: University) => u.degree || '—'],
    ['rowInstruction', (u: University) => u.mediumOfInstruction || '—'],
    ['rowPreArrival', (u: University) => u.preArrivalAdmission || '—'],
    ['rowPrograms', (u: University) => u.programs || '—'],
  ]

  if (error) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <FadeIn>
          <Link href="/universities" className="text-sm text-accent hover:underline mb-4 inline-block">{t('back')}</Link>
          <h1 className="section-title">{t('title')}</h1>
          <div className="mt-8"><ErrorState message={error} /></div>
          <div className="mt-8 text-center">
            <Link className="btn-primary h-[48px] px-8 text-base" href="/universities">
              {t('selectCta')}
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
          <Link href="/universities" className="text-sm text-accent hover:underline mb-4 inline-block">{t('back')}</Link>
          <h1 className="section-title mt-4">{t('title')}</h1>
          <p className="mt-2 text-muted">{t('intro')}</p>
          <div className="mt-8 text-center">
            <Link className="btn-primary h-[48px] px-8 text-base" href="/universities">
              {t('selectCta')}
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
        <Link href="/universities" className="text-sm text-accent hover:underline mb-4 inline-block">{t('back')}</Link>
        <h1 className="section-title mt-4">{t('title')}</h1>
      </FadeIn>
      <SlideUp delay={0.1}>
        <div className="mt-8 overflow-x-auto rounded-2xl border border-border bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="p-4 font-medium text-ink/60 bg-soft-surface">{t('criteria')}</th>
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
                    <td className="p-4 font-medium text-ink/60 bg-soft-surface/50">{t(label as 'rowCity')}</td>
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
