import { getTranslations } from 'next-intl/server'
import { seoAlternates } from '@/lib/seo'

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'Contact' })
  return { title: t('metaTitle'), description: t('metaDescription'), alternates: seoAlternates(locale, '/contact') }
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
