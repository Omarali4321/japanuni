import { SITE_URL } from '@/lib/site'
import { routing } from '@/i18n/routing'

export const OG_LOCALES: Record<string, string> = { en: 'en_US', ru: 'ru_RU', kk: 'kk_KZ' }

/** Path with locale prefix applied (en has none). `path` is '' or starts with '/'. */
export function localizedUrl(locale: string, path: string) {
  const prefix = locale === routing.defaultLocale ? '' : `/${locale}`
  return `${SITE_URL}${prefix}${path}` || SITE_URL
}

/** canonical + hreflang alternates for Next metadata. */
export function seoAlternates(locale: string, path: string) {
  const languages: Record<string, string> = {}
  for (const l of routing.locales) languages[l] = localizedUrl(l, path)
  languages['x-default'] = localizedUrl(routing.defaultLocale, path)
  return { canonical: localizedUrl(locale, path), languages }
}
