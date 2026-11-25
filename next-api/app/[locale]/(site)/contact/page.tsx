'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useApiError } from '@/lib/use-api-error'
import { ApiError } from '@/lib/web-api'
import { FadeIn, SlideUp, StaggerContainer, StaggerItem } from '@/components/ui/Motion'

export default function ContactPage() {
  const t = useTranslations('Contact')
  const apiError = useApiError()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      
      if (!response.ok) {
        throw new ApiError(response.status === 400 ? 'VALIDATION_ERROR' : undefined, 'Failed to send message')
      }
      
      setSubmitted(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (err) {
      setError(apiError(err))
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const contactInfo = [
    { icon: '📧', title: t('general'), value: 'hello@japanuni.com', href: 'mailto:hello@japanuni.com' },
    { icon: '🤝', title: t('partnerships'), value: 'partners@japanuni.com', href: 'mailto:partners@japanuni.com' },
    { icon: '📰', title: t('press'), value: 'press@japanuni.com', href: 'mailto:press@japanuni.com' },
    { icon: '🛠️', title: t('support'), value: 'support@japanuni.com', href: 'mailto:support@japanuni.com' },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <FadeIn>
        <h1 className="section-title">{t('title')}</h1>
        <p className="mt-3 max-w-2xl text-ink-800/60 dark:text-ink-50/60">
          {t('intro')}
        </p>
      </FadeIn>

      <SlideUp delay={0.1} className="mt-12 grid gap-8 lg:grid-cols-2">
        <div>
          <FadeIn>
            <h2 className="font-display text-2xl font-semibold mb-6">{t('sendTitle')}</h2>
          </FadeIn>
          {submitted ? (
            <FadeIn>
              <div className="glass-card p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center text-3xl">✓</div>
                <h3 className="font-display text-xl font-semibold mb-2">{t('sent')}</h3>
                <p className="text-ink-800/60 dark:text-ink-50/60 mb-6">{t('sentText')}</p>
                <button onClick={() => setSubmitted(false)} className="btn-secondary">{t('another')}</button>
              </div>
            </FadeIn>
          ) : (
            <FadeIn>
              <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
                {error && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm">
                    {error}
                  </div>
                )}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-ink-800/70 dark:text-ink-50/70 mb-1">{t('name')}</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="input-field"
                      placeholder={t('namePlaceholder')}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-ink-800/70 dark:text-ink-50/70 mb-1">{t('email')}</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="input-field"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-ink-800/70 dark:text-ink-50/70 mb-1">{t('subject')}</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="input-field"
                  >
                    <option value="">{t('selectTopic')}</option>
                    <option value="general">{t('topicGeneral')}</option>
                    <option value="partnership">{t('topicPartnership')}</option>
                    <option value="press">{t('topicPress')}</option>
                    <option value="technical">{t('topicTechnical')}</option>
                    <option value="feedback">{t('topicFeedback')}</option>
                    <option value="other">{t('topicOther')}</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-ink-800/70 dark:text-ink-50/70 mb-1">{t('message')}</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="input-field resize-none"
                    placeholder={t('messagePlaceholder')}
                  />
                </div>
                <button type="submit" disabled={submitting} className="btn-primary w-full sm:w-auto">
                  {submitting ? t('sending') : t('send')}
                </button>
              </form>
            </FadeIn>
          )}
        </div>

        <div>
          <FadeIn>
            <h2 className="font-display text-2xl font-semibold mb-6">{t('otherWays')}</h2>
          </FadeIn>
          <StaggerContainer staggerDelay={0.1} className="space-y-4">
            {contactInfo.map((item, index) => (
              <StaggerItem key={item.title} customDelay={index * 0.05}>
                <a href={item.href} className="glass-card p-4 flex items-center gap-4 hover:border-sakura-500/30 transition-all group">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <h3 className="font-semibold text-ink-800 dark:text-ink-50 group-hover:text-sakura-500 transition-colors">{item.title}</h3>
                    <p className="text-sm text-ink-800/60 dark:text-ink-50/60">{item.value}</p>
                  </div>
                </a>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <FadeIn delay={0.2} className="mt-10">
            <h3 className="font-display text-xl font-semibold mb-4">{t('follow')}</h3>
            <div className="flex flex-wrap gap-3">
              <a href="https://twitter.com/japanuni" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-sakura-500/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sakura-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 dark:focus-visible:ring-offset-ink-950" aria-label="Twitter (X)">
                <svg className="w-6 h-6 text-ink-800 dark:text-ink-50" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 9.24-3.933 1.008L11.91 13.55l-7.075 7.696-3.425-1.017 7.878-8.553L.108 4.803l3.875-.985 6.693 7.271 7.298-8.291Z"/></svg>
              </a>
              <a href="https://github.com/japanuni" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-sakura-500/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sakura-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 dark:focus-visible:ring-offset-ink-950" aria-label="GitHub">
                <svg className="w-6 h-6 text-ink-800 dark:text-ink-50" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
              </a>
              <a href="https://discord.gg/japanuni" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-sakura-500/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sakura-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 dark:focus-visible:ring-offset-ink-950" aria-label="Discord">
                <svg className="w-6 h-6 text-ink-800 dark:text-ink-50" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 .077.077 0 0 0-.032.129 13.33 13.33 0 0 0-.244 2.34.075.075 0 0 0 .023.055c.52.933 1.357 1.853 2.53 2.438.208.1.43.15.66.155.38.009.687-.095.95-.25.216-.123.38-.297.492-.49a5.083 5.083 0 0 0 .492-1.934.077.077 0 0 0-.052-.084c-1.733-.34-3.424-1.268-4.662-2.737a.077.077 0 0 0-.106-.017.077.077 0 0 0-.016.112 10.19 10.19 0 0 0-.714 2.213.077.077 0 0 0 .02.086 7.31 7.31 0 0 0 1.48 2.418.074.074 0 0 0 .085-.013c.346-.25.657-.542.926-.872a.077.077 0 0 0-.038-.116 11.09 11.09 0 0 1-1.692-5.62c0-.448.034-.89.106-1.317a.079.079 0 0 0-.02-.106.077.077 0 0 0-.08-.024c-.943.29-1.77.74-2.448 1.331a.077.077 0 0 0-.04.124c-.083.38-.13.765-.13 1.154 0 .572.117 1.123.337 1.642a.077.077 0 0 0 .033.07.079.079 0 0 0 .087-.03c.48-1.073 1.23-2.014 2.245-2.795a.077.077 0 0 0 .017-.106.074.074 0 0 0-.056-.077c-.95-.466-1.821-1.042-2.572-1.71a.076.076 0 0 0-.11-.014.077.077 0 0 0-.06.121 9.2 9.2 0 0 0-1.006 3.43.077.077 0 0 0 .028.08.074.074 0 0 0 .092-.028c.722-1.206 1.617-2.299 2.658-3.227a.077.077 0 0 0-.007-.114.07.07 0 0 0-.078-.032c-1.235.31-2.282.886-3.112 1.68a.078.078 0 0 0-.026.126c.147 2.122.902 3.86 2.102 5.125a.076.076 0 0 0 .08.03.075.075 0 0 0 .05-.02c1.113-.81 1.947-1.86 2.454-3.076a.077.077 0 0 0-.029-.111.072.072 0 0 0-.081-.014c-.758.89-1.687 1.678-2.772 2.32a.077.077 0 0 0 .027.113.075.075 0 0 0 .079.017c2.612-1.335 5.102-2.362 7.362-3.044a.076.076 0 0 0 .06-.06.076.076 0 0 0-.016-.112ZM7.555 12.28a2.97 2.97 0 0 1-.377-1.332.077.077 0 0 0-.105.023 4.567 4.567 0 0 0-.468 2.156.076.076 0 0 0 .05.1.077.077 0 0 0 .08-.017c.32-.812.73-1.58 1.22-2.28a.078.078 0 0 0-.01-.126.073.073 0 0 0-.09-.007Zm8.89 0a.077.077 0 0 0-.105-.023c-.49.7-.9 1.468-1.22 2.28a.077.077 0 0 0 .02.113.075.075 0 0 0 .08.017c.164-.225.324-.463.468-.713a.077.077 0 0 0-.05-.092Z"/></svg>
              </a>
              <a href="https://youtube.com/@japanuni" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-sakura-500/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sakura-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 dark:focus-visible:ring-offset-ink-950" aria-label="YouTube">
                <svg className="w-6 h-6 text-ink-800 dark:text-ink-50" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z"/></svg>
              </a>
            </div>
          </FadeIn>

          <FadeIn delay={0.3} className="mt-10 p-6 glass rounded-xl bg-sakura-500/5 border-sakura-500/20">
            <h3 className="font-display text-lg font-semibold mb-2">{t('forPartners')}</h3>
            <p className="text-ink-800/60 dark:text-ink-50/60">
              {t('forPartnersText')}{' '}
              <a href="mailto:partners@japanuni.com" className="text-sakura-500 hover:underline font-medium">{t('forPartnersLink')}</a>.
            </p>
          </FadeIn>
        </div>
      </SlideUp>
    </div>
  )
}