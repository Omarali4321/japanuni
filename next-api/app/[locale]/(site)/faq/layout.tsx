import { getTranslations } from 'next-intl/server'
import { seoAlternates } from '@/lib/seo'

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'FAQ' })
  return { title: t('metaTitle'), description: t('metaDescription'), alternates: seoAlternates(locale, '/faq') }
}

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return children
}
