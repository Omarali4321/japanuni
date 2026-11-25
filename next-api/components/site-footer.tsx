'use client'

import { Link } from '@/i18n/navigation'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { StaggerContainer, StaggerItem } from '@/components/ui/Motion'

const footerLinks = {
  explore: [
    ['/universities', 'universities'],
    ['/match', 'smartMatch'],
    ['/scholarships', 'scholarships'],
    ['/compare', 'compare'],
  ],
  resources: [
    ['/admission', 'admissionGuide'],
    ['/visa', 'visaGuide'],
    ['/student-life', 'studentLife'],
    ['/dashboard', 'dashboard'],
  ],
  support: [
    ['/help', 'helpCenter'],
    ['/contact', 'contactUs'],
    ['/faq', 'faq'],
  ],
  legal: [
    ['/privacy', 'privacy'],
    ['/terms', 'terms'],
    ['/cookies', 'cookies'],
  ],
} as const

export function SiteFooter() {
  const t = useTranslations('Footer')
  const tn = useTranslations('Nav')
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email && email.includes('@')) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  return (
    <footer className="mt-auto border-t border-border bg-soft-surface relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 relative">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          <motion.div className="lg:col-span-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Link href="/" className="font-display text-xl font-bold text-accent">JapanUni</Link>
            <p className="mt-3 max-w-md text-sm text-muted">{t('tagline')}</p>
          </motion.div>

          <StaggerContainer staggerDelay={0.1} className="grid grid-cols-2 gap-8">
            <StaggerItem>
              <h4 className="mb-3 font-semibold text-ink">{t('explore')}</h4>
              <div className="space-y-2 text-sm text-muted">
                {footerLinks.explore.map(([href, label]) => (
                  <Link key={href} href={href} className="block hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm">{t.has(label) ? t(label) : tn(label)}</Link>
                ))}
              </div>
            </StaggerItem>
            <StaggerItem>
              <h4 className="mb-3 font-semibold text-ink">{t('resources')}</h4>
              <div className="space-y-2 text-sm text-muted">
                {footerLinks.resources.map(([href, label]) => (
                  <Link key={href} href={href} className="block hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm">{t.has(label) ? t(label) : tn(label)}</Link>
                ))}
              </div>
            </StaggerItem>
            <StaggerItem>
              <h4 className="mb-3 font-semibold text-ink">{t('support')}</h4>
              <div className="space-y-2 text-sm text-muted">
                {footerLinks.support.map(([href, label]) => (
                  <Link key={href} href={href} className="block hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm">{t.has(label) ? t(label) : tn(label)}</Link>
                ))}
              </div>
            </StaggerItem>
            <StaggerItem>
              <h4 className="mb-3 font-semibold text-ink">{t('legal')}</h4>
              <div className="space-y-2 text-sm text-muted">
                {footerLinks.legal.map(([href, label]) => (
                  <Link key={href} href={href} className="block hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm">{t.has(label) ? t(label) : tn(label)}</Link>
                ))}
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>

        <motion.div className="mt-12 pt-8 border-t border-border" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <p className="text-xs text-muted/60">{t('copyright', { year: new Date().getFullYear() })}</p>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto" aria-label={t('newsletterAria')}>
              <label htmlFor="footer-email" className="sr-only">{t('emailLabel')}</label>
              <input
                id="footer-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('emailPlaceholder')}
                className="input-field flex-1 min-w-[200px]"
                disabled={subscribed}
                aria-describedby="newsletter-status"
              />
              <button
                type="submit"
                disabled={subscribed || !email || !email.includes('@')}
                className="btn-primary px-4 py-2 text-sm whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {subscribed ? t('subscribed') : t('subscribe')}
              </button>
              <p id="newsletter-status" className="sr-only" aria-live="polite">
                {subscribed ? t('subscribedStatus') : ''}
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}