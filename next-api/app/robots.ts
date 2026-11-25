import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'
import { routing } from '@/i18n/routing'

const PRIVATE_PATHS = ['/admin', '/dashboard', '/favorites']

export default function robots(): MetadataRoute.Robots {
  const prefixes = ['', ...routing.locales.filter((l) => l !== routing.defaultLocale).map((l) => `/${l}`)]
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', ...prefixes.flatMap((p) => PRIVATE_PATHS.map((path) => `${p}${path}`))],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
