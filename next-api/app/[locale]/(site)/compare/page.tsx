import { Suspense } from 'react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { seoAlternates } from '@/lib/seo'
import CompareContent from './compare-content'

type Props = { params: { locale: string } }

export async function generateMetadata({ params: { locale } }: Props) {
  const t = await getTranslations({ locale, namespace: 'Compare' })
  return { title: t('metaTitle'), alternates: seoAlternates(locale, '/compare') }
}

export default async function Page({ params: { locale } }: Props) {
  setRequestLocale(locale)
  const t = await getTranslations('Compare')
  return <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-12">{t('loading')}</div>}><CompareContent /></Suspense>
}
