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

const languages = [
  ['en', 'English', '🇺🇸'],
  ['ja', '日本語', '🇯🇵'],
  ['ko', '한국어', '🇰🇷'],
  ['zh', '中文', '🇨🇳'],
  ['vi', 'Tiếng Việt', '🇻🇳'],
]

export function SiteFooter() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [lang, setLang] = useState('en')

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
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full glass flex items-center justify-center text-sm hover:bg-sakura-500/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sakura-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 dark:focus-visible:ring-offset-ink-950" aria-label="Twitter">𝕏</a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full glass flex items-center justify-center text-sm hover:bg-sakura-500/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sakura-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 dark:focus-visible:ring-offset-ink-950" aria-label="GitHub">⌘</a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full glass flex items-center justify-center text-sm hover:bg-sakura-500/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sakura-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 dark:focus-visible:ring-offset-ink-950" aria-label="Discord">💬</a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full glass flex items-center justify-center text-sm hover:bg-sakura-500/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sakura-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 dark:focus-visible:ring-offset-ink-950" aria-label="YouTube">▶️</a>
            </div>
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

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2" aria-label="Newsletter signup">
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

              <div className="relative">
                <button
                  onClick={() => {
                    const currentIndex = languages.findIndex(([c]) => c === lang)
                    const nextIndex = (currentIndex + 1) % languages.length
                    setLang(languages[nextIndex][0])
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg glass border border-white/10 hover:bg-sakura-500/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sakura-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 dark:focus-visible:ring-offset-ink-950"
                  aria-label="Select language"
                  aria-haspopup="listbox"
                >
                  <span>{languages.find(([c]) => c === lang)?.[2] || '🇺🇸'}</span>
                  <span className="hidden sm:inline">{languages.find(([c]) => c === lang)?.[1] || 'English'}</span>
                  <span className="text-xs">▼</span>
                </button>
                <div className="absolute bottom-full left-0 mb-2 w-40 rounded-lg glass border border-white/10 shadow-lg overflow-hidden z-50" role="listbox">
                  {languages.map(([code, name, flag]) => (
                    <button
                      key={code}
                      onClick={() => setLang(code)}
                      className={`w-full px-3 py-2 text-sm flex items-center gap-2 transition-colors ${lang === code ? 'bg-sakura-500/10' : 'hover:bg-white/5 dark:hover:bg-ink-800'} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sakura-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 dark:focus-visible:ring-offset-ink-950`}
                      role="option"
                      aria-selected={lang === code}
                    >
                      <span>{flag}</span>
                      <span>{name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
