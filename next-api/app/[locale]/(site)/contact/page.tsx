'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useApiError } from '@/lib/use-api-error'
import { ApiError } from '@/lib/web-api'
import { FadeIn, SlideUp } from '@/components/ui/Motion'

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

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <FadeIn>
        <h1 className="section-title">{t('title')}</h1>
        <p className="mt-3 max-w-2xl text-ink-800/60 dark:text-ink-50/60">
          {t('intro')}
        </p>
      </FadeIn>

      <SlideUp delay={0.1} className="mx-auto mt-12 max-w-2xl">
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

      </SlideUp>
    </div>
  )
}