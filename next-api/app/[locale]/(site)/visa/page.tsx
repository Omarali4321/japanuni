import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getGuides } from '@/lib/data'
import { ContentList } from '@/components/content-list'
import { seoAlternates } from '@/lib/seo'

type Props = { params: { locale: string } }

export async function generateMetadata({ params: { locale } }: Props) {
  const t = await getTranslations({ locale, namespace: 'Guides' })
  return { title: t('visaTitle'), description: t('visaDesc'), alternates: seoAlternates(locale, '/visa') }
}

export default async function Page({ params: { locale } }: Props) {
  setRequestLocale(locale)
  const t = await getTranslations('Guides')
  const guides = getGuides('visa') ?? []
  return <ContentList items={guides} title={t('visaTitle')} description={t('visaDesc')} kind="visa" />
}
