'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { StaggerContainer, StaggerItem } from '@/components/ui/Motion'

const footerLinks = {
  explore: [
    ['/universities', 'Universities'],
    ['/match', 'Smart Match'],
    ['/scholarships', 'Scholarships'],
    ['/compare', 'Compare'],
  ],
  resources: [
    ['/admission', 'Admission Guide'],
    ['/visa', 'Visa Guide'],
    ['/student-life', 'Student Life'],
    ['/dashboard', 'Dashboard'],
  ],
  support: [
    ['/help', 'Help Center'],
    ['/contact', 'Contact Us'],
    ['/faq', 'FAQ'],
    ['/api-docs', 'API Docs'],
  ],
  legal: [
    ['/privacy', 'Privacy Policy'],
    ['/terms', 'Terms of Service'],
    ['/cookies', 'Cookie Policy'],
  ],
}

// Language switcher removed - multi-language support planned for future release
// const languages = [
//   ['en', 'English', '🇺🇸'],
//   ['ja', '日本語', '🇯🇵'],
//   ['ko', '한국어', '🇰🇷'],
//   ['zh', '中文', '🇨🇳'],
//   ['vi', 'Tiếng Việt', '🇻🇳'],
// ]

export function SiteFooter() {
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
    <footer className="mt-auto border-t border-white/10 glass relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-sakura-500/5 via-transparent to-transparent" aria-hidden="true" />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 relative">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          <motion.div className="lg:col-span-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Link href="/" className="font-display text-xl font-bold text-sakura-500">JapanUni</Link>
            <p className="mt-3 max-w-md text-sm text-ink-800/60 dark:text-ink-50/60">Your gateway to studying in Japan. Explore universities, scholarships, visa guides, and student life.</p>
          </motion.div>

          <StaggerContainer staggerDelay={0.1} className="grid grid-cols-2 gap-8">
            <StaggerItem>
              <h4 className="mb-3 font-semibold">Explore</h4>
              <div className="space-y-2 text-sm text-ink-800/60 dark:text-ink-50/60">
                {footerLinks.explore.map(([href, label]) => (
                  <Link key={href} href={href} className="block hover:text-sakura-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sakura-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 dark:focus-visible:ring-offset-ink-950 rounded-sm">{label}</Link>
                ))}
              </div>
            </StaggerItem>
            <StaggerItem>
              <h4 className="mb-3 font-semibold">Resources</h4>
              <div className="space-y-2 text-sm text-ink-800/60 dark:text-ink-50/60">
                {footerLinks.resources.map(([href, label]) => (
                  <Link key={href} href={href} className="block hover:text-sakura-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sakura-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 dark:focus-visible:ring-offset-ink-950 rounded-sm">{label}</Link>
                ))}
              </div>
            </StaggerItem>
            <StaggerItem>
              <h4 className="mb-3 font-semibold">Support</h4>
              <div className="space-y-2 text-sm text-ink-800/60 dark:text-ink-50/60">
                {footerLinks.support.map(([href, label]) => (
                  <Link key={href} href={href} className="block hover:text-sakura-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sakura-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 dark:focus-visible:ring-offset-ink-950 rounded-sm">{label}</Link>
                ))}
              </div>
            </StaggerItem>
            <StaggerItem>
              <h4 className="mb-3 font-semibold">Legal</h4>
              <div className="space-y-2 text-sm text-ink-800/60 dark:text-ink-50/60">
                {footerLinks.legal.map(([href, label]) => (
                  <Link key={href} href={href} className="block hover:text-sakura-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sakura-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 dark:focus-visible:ring-offset-ink-950 rounded-sm">{label}</Link>
                ))}
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>

        <motion.div className="mt-12 pt-8 border-t border-white/10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <p className="text-xs text-ink-800/40 dark:text-ink-50/40">© {new Date().getFullYear()} JapanUni. Built for students dreaming of Japan.</p>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto" aria-label="Newsletter signup">
              <label htmlFor="footer-email" className="sr-only">Email address</label>
              <input
                id="footer-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 min-w-[200px] px-4 py-2 text-sm rounded-lg glass border border-white/10 focus:outline-none focus:ring-2 focus:ring-sakura-500/50 dark:bg-ink-800"
                disabled={subscribed}
                aria-describedby="newsletter-status"
              />
              <button
                type="submit"
                disabled={subscribed || !email || !email.includes('@')}
                className="btn-primary px-4 py-2 text-sm whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {subscribed ? 'Subscribed!' : 'Subscribe'}
              </button>
              <p id="newsletter-status" className="sr-only" aria-live="polite">
                {subscribed ? 'Successfully subscribed to newsletter' : ''}
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
