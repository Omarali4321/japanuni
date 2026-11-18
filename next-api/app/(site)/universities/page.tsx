import { Suspense } from 'react'
import { listUniversitiesServer } from '@/lib/server-api'
import { UniversityListClient } from './university-list-client'
import { UniversityCardSkeleton } from '@/components/ui/Skeleton'

export const dynamic = 'force-dynamic'

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

export default async function Page() {
  const initialData = await getInitialData()
  return (
    <Suspense fallback={<UniversitiesSkeleton />}>
      <UniversityListClient initialData={initialData} />
    </Suspense>
  )
}
