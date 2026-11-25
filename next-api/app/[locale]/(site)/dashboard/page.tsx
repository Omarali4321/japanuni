import { getTranslations, setRequestLocale } from 'next-intl/server'
import DashboardContent from './dashboard-content'

type Props = { params: { locale: string } }

export async function generateMetadata({ params: { locale } }: Props) {
  const t = await getTranslations({ locale, namespace: 'Dashboard' })
  return { title: t('profile'), robots: { index: false, follow: false } }
}

export default function Page({ params: { locale } }: Props) {
  setRequestLocale(locale)
  return <DashboardContent />
}
