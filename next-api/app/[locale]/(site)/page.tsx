import { getTranslations, setRequestLocale } from 'next-intl/server'
import { seoAlternates } from '@/lib/seo'
import HomeContent from './home-content'

type Props = { params: { locale: string } }

export async function generateMetadata({ params: { locale } }: Props) {
  const t = await getTranslations({ locale, namespace: 'Home' })
  return { title: { absolute: `JapanUni — ${t('metaTitle')}` }, alternates: seoAlternates(locale, '') }
}

export default function Page({ params: { locale } }: Props) {
  setRequestLocale(locale)
  return <HomeContent />
}
