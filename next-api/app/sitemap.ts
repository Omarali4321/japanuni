import type { MetadataRoute } from 'next'
import { getGuides, getUniversitiesIndex } from '@/lib/data'
import { SITE_URL } from '@/lib/site'

const STATIC_PATHS = [
  '', '/universities', '/scholarships', '/admission', '/visa', '/student-life',
  '/match', '/compare', '/faq', '/help', '/contact', '/privacy', '/terms', '/cookies',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = STATIC_PATHS.map((path) => ({ url: `${SITE_URL}${path}` }))
  const universities = (getUniversitiesIndex() ?? []).map((u: { id: number }) => ({
    url: `${SITE_URL}/universities/${u.id}`,
  }))
  const guides = (['admission', 'visa', 'student-life'] as const).flatMap((type) =>
    (getGuides(type) ?? []).map((g: { id: number }) => ({ url: `${SITE_URL}/${type}/${g.id}` })),
  )
  return [...pages, ...universities, ...guides]
}
