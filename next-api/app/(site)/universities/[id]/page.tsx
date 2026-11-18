import { getUniversityById, findUniversitiesByIds } from '@/lib/data'
import { notFound } from 'next/navigation'
import UniversityDetail from './university-detail'

export async function generateStaticParams() {
  const { getUniversitiesIndex } = await import('@/lib/data')
  const universities = getUniversitiesIndex() ?? []
  return universities.map((u) => ({ id: String(u.id) }))
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const universityId = Number(id)
  const university = getUniversityById(universityId)
  if (!university) notFound()
  return <UniversityDetail university={university} />
}
