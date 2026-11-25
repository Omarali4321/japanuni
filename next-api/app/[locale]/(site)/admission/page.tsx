import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getGuides } from '@/lib/data'
import { ContentList } from '@/components/content-list'
import { seoAlternates } from '@/lib/seo'

type Props = { params: { locale: string } }

export async function generateMetadata({ params: { locale } }: Props) {
  const t = await getTranslations({ locale, namespace: 'Guides' })
  return { title: t('admissionTitle'), description: t('admissionDesc'), alternates: seoAlternates(locale, '/admission') }
}

export default async function Page({ params: { locale } }: Props) {
  setRequestLocale(locale)
  const t = await getTranslations('Guides')
  const guides = getGuides('admission') ?? []
  return <ContentList items={guides} title={t('admissionTitle')} description={t('admissionDesc')} kind="admission" />
}
