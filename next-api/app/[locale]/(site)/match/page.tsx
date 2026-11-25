import { getTranslations, setRequestLocale } from 'next-intl/server'
import { seoAlternates } from '@/lib/seo'
import MatchContent from './match-content'

type Props = { params: { locale: string } }

export async function generateMetadata({ params: { locale } }: Props) {
  const t = await getTranslations({ locale, namespace: 'Match' })
  return { title: t('metaTitle'), description: t('metaDescription'), alternates: seoAlternates(locale, '/match') }
}

export default function Page({ params: { locale } }: Props) {
  setRequestLocale(locale)
  return <MatchContent />
}
