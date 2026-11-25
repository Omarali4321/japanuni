import { Metadata } from 'next'
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server'
import { seoAlternates } from '@/lib/seo'
import { notFound } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { getGuides } from '@/lib/data'
import { FadeIn, SlideUp } from '@/components/ui/Motion'
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer'

interface Props {
  params: Promise<{ locale: string; id: string }>
}

export async function generateStaticParams() {
  const guides = getGuides('student-life') ?? []
  return guides.map((guide) => ({ id: String(guide.id) }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params
  const t = await getTranslations({ locale, namespace: 'Guides' })
  const guides = getGuides('student-life') ?? []
  const guide = guides.find((g) => String(g.id) === id)
  if (!guide) return { title: t('notFound') }
  return {
    title: `${guide.title} | ${t('metastudent')}`,
    alternates: seoAlternates(locale, `/student-life/${id}`),
    openGraph: { title: guide.title, locale: locale === 'ru' ? 'ru_RU' : locale === 'kk' ? 'kk_KZ' : 'en_US' },
  }
}

export default async function StudentLifeDetailPage({ params }: Props) {
  const { locale, id } = await params
  setRequestLocale(locale)
  const t = await getTranslations('Guides')
  const format = await getFormatter()
  const guides = getGuides('student-life') ?? []
  const guide = guides.find((g) => String(g.id) === id)

  if (!guide) notFound()

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <FadeIn>
        <Link href="/student-life" className="inline-flex items-center gap-2 text-sm text-ink-800/60 dark:text-ink-50/60 hover:text-sakura-500 transition-colors mb-6">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t('backstudent')}
        </Link>
        {guide.category && (
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-sakura-500 mb-4">
            {guide.category}
          </span>
        )}
        <h1 className="section-title">{guide.title}</h1>
        <p className="mt-2 text-sm text-ink-800/50 dark:text-ink-50/50">
          {t('lastUpdated', { date: format.dateTime(new Date(Date.UTC(2024, 10, 1)), { month: 'long', year: 'numeric', timeZone: 'UTC' }) })}
        </p>
      </FadeIn>
      <SlideUp delay={0.1} className="mt-8">
        <article className="glass-card p-8 md:p-12 border border-white/20">
          {guide.imageUrl && (
            <img
              src={guide.imageUrl}
              alt={guide.title}
              className="mb-8 h-64 w-full rounded-xl object-cover"
            />
          )}
          <MarkdownRenderer content={guide.content} />
        </article>
      </SlideUp>
    </div>
  )
}