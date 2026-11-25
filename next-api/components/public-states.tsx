import { useTranslations } from 'next-intl'

export function LoadingState() {
  const t = useTranslations('States')
  return <div className="card animate-pulse text-center text-muted py-8">{t('loading')}</div>
}

export function ErrorState({ message }: { message: string }) {
  return <div className="card text-center text-accent py-8">{message}</div>
}
