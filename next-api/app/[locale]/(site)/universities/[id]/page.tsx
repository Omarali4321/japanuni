import { getUniversityById } from '@/lib/data'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { seoAlternates, OG_LOCALES } from '@/lib/seo'
import UniversityDetail from './university-detail'

type Props = { params: Promise<{ locale: string; id: string }> }

export async function generateStaticParams() {
  const { getUniversitiesIndex } = await import('@/lib/data')
  const universities = getUniversitiesIndex() ?? []
  return universities.map((u) => ({ id: String(u.id) }))
}

export async function generateMetadata({ params }: Props) {
  const { locale, id } = await params
  const university = getUniversityById(Number(id))
  const t = await getTranslations({ locale, namespace: 'Universities' })
  if (!university) return { title: t('noResults') }
  return {
    title: university.name,
    description: t('detailDescription', { name: university.name }),
    alternates: seoAlternates(locale, `/universities/${id}`),
    openGraph: { title: university.name, locale: OG_LOCALES[locale] },
  }
}

export default async function Page({ params }: Props) {
  const { locale, id } = await params
  setRequestLocale(locale)
  const universityId = Number(id)
  const university = getUniversityById(universityId)
  if (!university) notFound()
  return <UniversityDetail university={university} />
}
