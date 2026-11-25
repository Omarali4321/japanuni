import { getTranslations, setRequestLocale } from 'next-intl/server'
import { LegalPage } from '@/components/legal-page'
import { seoAlternates } from '@/lib/seo'

type Props = { params: { locale: string } }

export async function generateMetadata({ params: { locale } }: Props) {
  const t = await getTranslations({ locale, namespace: 'Privacy' })
  return { title: t('title'), description: t('metaDescription'), alternates: seoAlternates(locale, '/privacy') }
}

export default function Page({ params: { locale } }: Props) {
  setRequestLocale(locale)
  return <LegalPage namespace="Privacy" sections={8} />
}
