import { Suspense } from 'react'
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server'
import { listUniversitiesServer } from '@/lib/server-api'
import { seoAlternates } from '@/lib/seo'
import { UniversityListClient } from './university-list-client'
import { UniversityCardSkeleton } from '@/components/ui/Skeleton'

export const dynamic = 'force-dynamic'

type Props = { params: { locale: string } }

export async function generateMetadata({ params: { locale } }: Props) {
  const t = await getTranslations({ locale, namespace: 'Universities' })
  return { title: t('metaTitle'), description: t('metaDescription'), alternates: seoAlternates(locale, '/universities') }
}

async function getInitialData() {
  const params = new URLSearchParams({ page: '0', size: '12' })
  return listUniversitiesServer(params)
}

function UniversitiesSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
      {Array.from({ length: 12 }).map((_, i) => (
        <UniversityCardSkeleton key={i} />
      ))}
    </div>
  )
}

export default async function Page({ params: { locale } }: Props) {
  setRequestLocale(locale)
  const initialData = await getInitialData()
  const format = await getFormatter()
  // Current build date for data freshness indicator
  const buildDate = format.dateTime(new Date(), { year: 'numeric', month: 'long', day: 'numeric' })
  return (
    <Suspense fallback={<UniversitiesSkeleton />}>
      <UniversityListClient initialData={initialData} buildDate={buildDate} />
    </Suspense>
  )
}
