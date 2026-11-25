import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getScholarships } from '@/lib/data'
import { seoAlternates } from '@/lib/seo'
import ScholarshipsContent from './scholarships-content'

type Props = { params: { locale: string } }

export async function generateMetadata({ params: { locale } }: Props) {
  const t = await getTranslations({ locale, namespace: 'Scholarships' })
  return { title: t('metaTitle'), description: t('metaDescription'), alternates: seoAlternates(locale, '/scholarships') }
}

export default function Page({ params: { locale } }: Props) {
  setRequestLocale(locale)
  const scholarships = getScholarships() ?? []
  return <ScholarshipsContent initialScholarships={scholarships} />
}
