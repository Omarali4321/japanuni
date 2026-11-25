'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { FadeIn, SlideUp, StaggerContainer, StaggerItem } from '@/components/ui/Motion'

const faqs = [
  { key: 'general', count: 4 },
  { key: 'universities', count: 4 },
  { key: 'scholarships', count: 3 },
  { key: 'admission', count: 3 },
  { key: 'life', count: 3 },
  { key: 'account', count: 3 },
].map(({ key, count }) => ({ key, questions: Array.from({ length: count }, (_, i) => i + 1) }))

export default function FAQPage() {
  const t = useTranslations('FAQ')
  const [openCategory, setOpenCategory] = useState<string | null>(null)

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <FadeIn>
        <h1 className="section-title">{t('title')}</h1>
        <p className="mt-3 max-w-2xl text-ink-800/60 dark:text-ink-50/60">
          {t('subtitle')}
        </p>
      </FadeIn>

      <SlideUp delay={0.1} className="mt-10">
        <StaggerContainer staggerDelay={0.1} className="space-y-6">
          {faqs.map((category, catIndex) => (
            <StaggerItem key={category.key} customDelay={catIndex * 0.05}>
              <div className="glass-card overflow-hidden">
                <button
                  onClick={() => setOpenCategory(openCategory === category.key ? null : category.key)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 dark:hover:bg-ink-800/50 transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sakura-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 dark:focus-visible:ring-offset-ink-950"
                  aria-expanded={openCategory === category.key}
                >
                  <h2 className="font-display text-xl font-semibold">{t(`${category.key}.title`)}</h2>
                  <span className="text-2xl transition-transform duration-200" style={{ transform: openCategory === category.key ? 'rotate(180deg)' : 'rotate(0deg)' }} aria-hidden="true">
                    ▼
                  </span>
                </button>
                {openCategory === category.key && (
                  <div className="border-t border-white/10 px-6 pb-6">
                    <StaggerContainer staggerDelay={0.05} className="space-y-4 mt-4">
                      {category.questions.map((n, qIndex) => (
                        <StaggerItem key={n} customDelay={qIndex * 0.03}>
                          <details className="group">
                            <summary className="flex items-center justify-between cursor-pointer list-none p-3 rounded-lg hover:bg-white/5 dark:hover:bg-ink-800/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sakura-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 dark:focus-visible:ring-offset-ink-950">
                              <p className="font-medium text-ink-800 dark:text-ink-50 pr-8">{t(`${category.key}.q${n}`)}</p>
                              <span className="text-sakura-500 transition-transform duration-200 group-open:rotate-180">▼</span>
                            </summary>
                            <div className="pt-2 pb-4 px-3 text-ink-800/70 dark:text-ink-50/70 leading-relaxed">
                              {t(`${category.key}.a${n}`)}
                            </div>
                          </details>
                        </StaggerItem>
                      ))}
                    </StaggerContainer>
                  </div>
                )}
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </SlideUp>

      <SlideUp delay={0.2} className="mt-16">
        <div className="glass-card p-8 md:p-12 text-center">
          <h2 className="font-display text-2xl font-semibold mb-3">{t('stillTitle')}</h2>
          <p className="text-ink-800/60 dark:text-ink-50/60 mb-6 max-w-xl mx-auto">
            {t('stillText')}
          </p>
          <Link href="/contact" className="btn-primary inline-block">{t('contact')}</Link>
        </div>
      </SlideUp>
    </div>
  )
}