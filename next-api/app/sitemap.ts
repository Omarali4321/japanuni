import type { MetadataRoute } from 'next'
import { getGuides, getUniversitiesIndex } from '@/lib/data'
import { routing } from '@/i18n/routing'
import { localizedUrl } from '@/lib/seo'

const STATIC_PATHS = [
  '', '/universities', '/scholarships', '/admission', '/visa', '/student-life',
  '/match', '/compare', '/faq', '/help', '/contact', '/privacy', '/terms', '/cookies',
]

function entry(path: string): MetadataRoute.Sitemap[number][] {
  return routing.locales.map((locale) => ({
    url: localizedUrl(locale, path),
    alternates: {
      languages: {
        ...Object.fromEntries(routing.locales.map((l) => [l, localizedUrl(l, path)])),
        'x-default': localizedUrl(routing.defaultLocale, path),
      },
    },
  })) as never
}

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...STATIC_PATHS,
    ...(getUniversitiesIndex() ?? []).map((u: { id: number }) => `/universities/${u.id}`),
    ...(['admission', 'visa', 'student-life'] as const).flatMap((type) =>
      (getGuides(type) ?? []).map((g: { id: number }) => `/${type}/${g.id}`),
    ),
  ]
  return paths.flatMap((path) => entry(path))
}
