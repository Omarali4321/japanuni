import { getTranslations, setRequestLocale } from 'next-intl/server'
import { AuthForm } from '@/components/auth-form'
import { seoAlternates } from '@/lib/seo'

type Props = { params: { locale: string } }

export async function generateMetadata({ params: { locale } }: Props) {
  const t = await getTranslations({ locale, namespace: 'Auth' })
  return { title: t('loginCta'), alternates: seoAlternates(locale, '/login') }
}

export default function Page({ params: { locale } }: Props) {
  setRequestLocale(locale)
  return <AuthForm mode="login" />
}
