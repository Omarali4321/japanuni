'use client'

import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import { routing, type Locale } from '@/i18n/routing'

const LABELS: Record<Locale, { short: string; name: string }> = {
  en: { short: 'EN', name: 'English' },
  ru: { short: 'RU', name: 'Русский' },
  kk: { short: 'KK', name: 'Қазақша' },
}

export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const locale = useLocale()
  const t = useTranslations('Nav')
  const router = useRouter()
  const pathname = usePathname()

  const switchTo = (next: Locale) => {
    if (next === locale) return
    // read the query on click (useSearchParams would force every page into CSR bailout)
    const query = Object.fromEntries(new URLSearchParams(window.location.search).entries())
    // next-intl sets the NEXT_LOCALE cookie on the next request; path is kept.
    router.replace({ pathname, query } as Parameters<typeof router.replace>[0], { locale: next })
  }

  return (
    <div role="group" aria-label={t('language')} className={`inline-flex items-center rounded-lg border border-border bg-background p-0.5 ${className}`}>
      {routing.locales.map((l) => {
        const active = l === locale
        return (
          <button
            key={l}
            type="button"
            lang={l}
            title={LABELS[l].name}
            aria-label={LABELS[l].name}
            aria-pressed={active}
            onClick={() => switchTo(l)}
            className={`rounded-md px-2 py-1 text-xs font-semibold transition-colors focus-visible-ring ${active ? 'bg-accent text-on-accent' : 'text-muted hover:text-accent'}`}
          >
            {LABELS[l].short}
          </button>
        )
      })}
    </div>
  )
}
