import { Metadata } from 'next'
import Link from 'next/link'
import { FadeIn, SlideUp, StaggerContainer, StaggerItem } from '@/components/ui/Motion'

export const metadata: Metadata = {
  title: 'Help Center | JapanUni',
  description: 'Find answers to common questions about studying in Japan, using JapanUni, and more.',
}

const categories = [
  {
    title: 'Getting Started',
    icon: '🚀',
    articles: [
      { title: 'How to create an account', href: '/register' },
      { title: 'Finding your first university', href: '/universities' },
      { title: 'Undergraduate Application Process', href: '/admission/1' },
      { title: 'EJU Examination Guide', href: '/admission/3' },
    ],
  },
  {
    title: 'Applications & Admissions',
    icon: '📋',
    articles: [
      { title: 'Graduate School Application Guide', href: '/admission/2' },
      { title: 'Document Preparation Checklist', href: '/admission/4' },
    ],
  },
  {
    title: 'Scholarships & Funding',
    icon: '💴',
    articles: [
      { title: 'Browse all scholarships', href: '/scholarships' },
    ],
  },
  {
    title: 'Visa & Immigration',
    icon: '🛂',
    articles: [
      { title: 'Student Visa (COE) Application', href: '/visa/1' },
      { title: 'Visa Extension & Renewal', href: '/visa/2' },
      { title: 'Work Permission for Students', href: '/visa/3' },
      { title: 'Post-Graduation Work Visa', href: '/visa/4' },
    ],
  },
  {
    title: 'Student Life',
    icon: '🇯🇵',
    articles: [
      { title: 'Finding Accommodation in Japan', href: '/student-life/1' },
      { title: 'Cost of Living Breakdown', href: '/student-life/2' },
      { title: 'Part-Time Job Guide', href: '/student-life/3' },
      { title: 'Healthcare & Insurance', href: '/student-life/4' },
      { title: 'Japanese Language Schools', href: '/student-life/5' },
    ],
  },
  {
    title: 'Using JapanUni',
    icon: '⚙️',
    articles: [
      { title: 'How to use Smart Match', href: '/match' },
      { title: 'Comparing universities side-by-side', href: '/universities' },
      { title: 'Saving favorites and creating lists', href: '/favorites' },
      { title: 'Writing university reviews', href: '/universities' },
    ],
  },
]

const popularArticles = [
  { title: 'Student Visa (COE) Application', category: 'Visa', readTime: '8 min', href: '/visa/1' },
  { title: 'Finding Accommodation in Japan', category: 'Student Life', readTime: '7 min', href: '/student-life/1' },
  { title: 'Graduate School Application Guide', category: 'Admissions', readTime: '10 min', href: '/admission/2' },
  { title: 'Cost of Living Breakdown', category: 'Student Life', readTime: '7 min', href: '/student-life/2' },
]

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <FadeIn>
        <h1 className="section-title">Help Center</h1>
        <p className="mt-3 max-w-2xl text-ink-800/60 dark:text-ink-50/60">
          Find answers to common questions about studying in Japan and using JapanUni.
        </p>
      </FadeIn>

      <SlideUp delay={0.1} className="mt-10">
        <div className="bg-sakura-500/5 border border-sakura-500/20 rounded-2xl p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🔍</span>
            <div>
              <h2 className="font-display text-xl font-semibold">Search help articles</h2>
              <p className="text-sm text-ink-800/60 dark:text-ink-50/60">Type a question or keyword</p>
            </div>
          </div>
          <form className="relative max-w-xl">
            <input
              type="search"
              placeholder="Search help articles..."
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
        <h2 className="font-display text-2xl font-semibold mb-6">Popular articles</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {popularArticles.map((article, index) => (
            <StaggerItem key={index} customDelay={index * 0.05}>
              <Link href={article.href} className="glass-card p-6 hover:border-sakura-500/30 transition-all group">
                <div className="flex items-center gap-2 text-xs text-sakura-500 font-medium mb-2">
                  <span>{article.category}</span>
                  <span>•</span>
                  <span>{article.readTime}</span>
                </div>
                <h3 className="font-semibold text-ink-800 dark:text-ink-50 group-hover:text-sakura-500 transition-colors">{article.title}</h3>
              </Link>
            </StaggerItem>
          ))}
        </div>
      </SlideUp>

      <SlideUp delay={0.3} className="mt-16">
        <h2 className="font-display text-2xl font-semibold mb-6">Browse by category</h2>
        <StaggerContainer staggerDelay={0.1} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, catIndex) => (
            <StaggerItem key={category.title} customDelay={catIndex * 0.05}>
              <div className="glass-card p-6 hover:border-sakura-500/30 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{category.icon}</span>
                  <h3 className="font-display text-xl font-semibold">{category.title}</h3>
                </div>
                <ul className="space-y-3">
                  {category.articles.map((article) => (
                    <li key={article.title}>
                      <Link href={article.href} className="text-sm text-ink-800/70 dark:text-ink-50/70 hover:text-sakura-500 transition-colors flex items-center gap-2 group">
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                        {article.title}
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
          <h2 className="font-display text-2xl font-semibold mb-3">Still need help?</h2>
          <p className="text-ink-800/60 dark:text-ink-50/60 mb-6 max-w-xl mx-auto">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-primary">Contact Support</Link>
            <Link href="/faq" className="btn-secondary">View FAQ</Link>
          </div>
        </div>
      </SlideUp>
    </div>
  )
}