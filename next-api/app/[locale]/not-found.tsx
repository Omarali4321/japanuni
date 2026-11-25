import { Link } from '@/i18n/navigation'

import { useTranslations } from 'next-intl'

export default function NotFound() {
  const t = useTranslations('NotFound')
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide opacity-60">404</p>
      <h1 className="text-3xl font-bold">{t('title')}</h1>
      <p className="opacity-70">{t('text')}</p>
      <Link href="/" className="btn-primary">{t('home')}</Link>
    </main>
  )
}
