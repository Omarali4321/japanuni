import { getTranslations, setRequestLocale } from 'next-intl/server'
import { seoAlternates } from '@/lib/seo'
import { Link } from '@/i18n/navigation'
import { FadeIn, SlideUp, StaggerContainer, StaggerItem } from '@/components/ui/Motion'

type Props = { params: { locale: string } }

export async function generateMetadata({ params: { locale } }: Props) {
  const t = await getTranslations({ locale, namespace: 'Help' })
  return { title: t('metaTitle'), description: t('metaDescription'), alternates: seoAlternates(locale, '/help') }
}

const categories = [
  {
    title: 'c_start',
    icon: '🚀',
    articles: [
      { title: 'a_register', href: '/register' },
      { title: 'a_firstUni', href: '/universities' },
      { title: 'a_undergrad', href: '/admission/1' },
      { title: 'a_eju', href: '/admission/3' },
    ],
  },
  {
    title: 'c_apps',
    icon: '📋',
    articles: [
      { title: 'a_grad', href: '/admission/2' },
      { title: 'a_docs', href: '/admission/4' },
    ],
  },
  {
    title: 'c_schol',
    icon: '💴',
    articles: [
      { title: 'a_allSchol', href: '/scholarships' },
    ],
  },
  {
    title: 'c_visa',
    icon: '🛂',
    articles: [
      { title: 'a_coe', href: '/visa/1' },
      { title: 'a_extension', href: '/visa/2' },
      { title: 'a_work', href: '/visa/3' },
      { title: 'a_postWork', href: '/visa/4' },
    ],
  },
  {
    title: 'c_life',
    icon: '🇯🇵',
    articles: [
      { title: 'a_housing', href: '/student-life/1' },
      { title: 'a_cost', href: '/student-life/2' },
      { title: 'a_parttime', href: '/student-life/3' },
      { title: 'a_health', href: '/student-life/4' },
      { title: 'a_langschools', href: '/student-life/5' },
    ],
  },
  {
    title: 'c_using',
    icon: '⚙️',
    articles: [
      { title: 'a_match', href: '/match' },
      { title: 'a_compare', href: '/universities' },
      { title: 'a_favorites', href: '/favorites' },
      { title: 'a_reviews', href: '/universities' },
    ],
  },
]

const popularArticles = [
  { title: 'a_coe', category: 'k_visa', readTime: 8, href: '/visa/1' },
  { title: 'a_housing', category: 'k_life', readTime: 7, href: '/student-life/1' },
  { title: 'a_grad', category: 'k_adm', readTime: 10, href: '/admission/2' },
  { title: 'a_cost', category: 'k_life', readTime: 7, href: '/student-life/2' },
]

export default async function HelpPage({ params: { locale } }: Props) {
  setRequestLocale(locale)
  const t = await getTranslations('Help')
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <FadeIn>
        <h1 className="section-title">{t('title')}</h1>
        <p className="mt-3 max-w-2xl text-ink-800/60 dark:text-ink-50/60">
          {t('subtitle')}
        </p>
      </FadeIn>

      <SlideUp delay={0.1} className="mt-10">
        <div className="bg-sakura-500/5 border border-sakura-500/20 rounded-2xl p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🔍</span>
            <div>
              <h2 className="font-display text-xl font-semibold">{t('searchTitle')}</h2>
              <p className="text-sm text-ink-800/60 dark:text-ink-50/60">{t('searchHint')}</p>
            </div>
          </div>
          <form className="relative max-w-xl">
            <input
              type="search"
              placeholder={t('searchPlaceholder')}
              aria-label={t('searchLabel')}
              className="input-field pl-12 pr-4"
              autoComplete="off"
            />
            <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-800/40 dark:text-ink-50/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </form>
        </div>
      </SlideUp>

      <SlideUp delay={0.2} className="mt-12">
        <h2 className="font-display text-2xl font-semibold mb-6">{t('popular')}</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {popularArticles.map((article, index) => (
            <StaggerItem key={index} customDelay={index * 0.05}>
              <Link href={article.href} className="glass-card p-6 hover:border-sakura-500/30 transition-all group">
                <div className="flex items-center gap-2 text-xs text-sakura-500 font-medium mb-2">
                  <span>{t(article.category)}</span>
                  <span>•</span>
                  <span>{t('readTime', { min: article.readTime })}</span>
                </div>
                <h3 className="font-semibold text-ink-800 dark:text-ink-50 group-hover:text-sakura-500 transition-colors">{t(article.title)}</h3>
              </Link>
            </StaggerItem>
          ))}
        </div>
      </SlideUp>

      <SlideUp delay={0.3} className="mt-16">
        <h2 className="font-display text-2xl font-semibold mb-6">{t('browse')}</h2>
        <StaggerContainer staggerDelay={0.1} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, catIndex) => (
            <StaggerItem key={category.title} customDelay={catIndex * 0.05}>
              <div className="glass-card p-6 hover:border-sakura-500/30 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{category.icon}</span>
                  <h3 className="font-display text-xl font-semibold">{t(category.title)}</h3>
                </div>
                <ul className="space-y-3">
                  {category.articles.map((article) => (
                    <li key={article.title}>
                      <Link href={article.href} className="text-sm text-ink-800/70 dark:text-ink-50/70 hover:text-sakura-500 transition-colors flex items-center gap-2 group">
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                        {t(article.title)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </SlideUp>

      <SlideUp delay={0.4} className="mt-16">
        <div className="glass-card p-8 md:p-12 text-center">
          <h2 className="font-display text-2xl font-semibold mb-3">{t('stillTitle')}</h2>
          <p className="text-ink-800/60 dark:text-ink-50/60 mb-6 max-w-xl mx-auto">
            {t('stillText')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-primary">{t('contact')}</Link>
            <Link href="/faq" className="btn-secondary">{t('viewFaq')}</Link>
          </div>
        </div>
      </SlideUp>
    </div>
  )
}