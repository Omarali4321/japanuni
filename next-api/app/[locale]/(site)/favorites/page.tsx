import { getTranslations, setRequestLocale } from 'next-intl/server'
import FavoritesContent from './favorites-content'

type Props = { params: { locale: string } }

export async function generateMetadata({ params: { locale } }: Props) {
  const t = await getTranslations({ locale, namespace: 'Favorites' })
  return { title: t('title'), robots: { index: false, follow: false } }
}

export default function Page({ params: { locale } }: Props) {
  setRequestLocale(locale)
  return <FavoritesContent />
}
