'use client'

import { useState } from 'react'
import { FadeIn, SlideUp, StaggerContainer, StaggerItem } from '@/components/ui/Motion'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSubmitted(true)
    setSubmitting(false)
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const contactInfo = [
    { icon: '📧', title: 'General Inquiries', value: 'hello@japanuni.com', href: 'mailto:hello@japanuni.com' },
    { icon: '🤝', title: 'Partnerships', value: 'partners@japanuni.com', href: 'mailto:partners@japanuni.com' },
    { icon: '📰', title: 'Press & Media', value: 'press@japanuni.com', href: 'mailto:press@japanuni.com' },
    { icon: '🛠️', title: 'Technical Support', value: 'support@japanuni.com', href: 'mailto:support@japanuni.com' },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <FadeIn>
        <h1 className="section-title">Contact Us</h1>
        <p className="mt-3 max-w-2xl text-ink-800/60 dark:text-ink-50/60">
          Have questions, feedback, or want to partner with us? We'd love to hear from you.
        </p>
      </FadeIn>

      <SlideUp delay={0.1} className="mt-12 grid gap-8 lg:grid-cols-2">
        <div>
          <FadeIn>
            <h2 className="font-display text-2xl font-semibold mb-6">Send us a message</h2>
          </FadeIn>
          {submitted ? (
            <FadeIn>
              <div className="glass-card p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center text-3xl">✓</div>
                <h3 className="font-display text-xl font-semibold mb-2">Message sent!</h3>
                <p className="text-ink-800/60 dark:text-ink-50/60 mb-6">Thanks for reaching out. We'll get back to you within 24 hours.</p>
                <button onClick={() => setSubmitted(false)} className="btn-secondary">Send another message</button>
              </div>
            </FadeIn>
          ) : (
            <FadeIn>
              <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-ink-800/70 dark:text-ink-50/70 mb-1">Name</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="input-field"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-ink-800/70 dark:text-ink-50/70 mb-1">Email</label>
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
                  <label htmlFor="subject" className="block text-sm font-medium text-ink-800/70 dark:text-ink-50/70 mb-1">Subject</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="input-field"
                  >
                    <option value="">Select a topic</option>
                    <option value="general">General inquiry</option>
                    <option value="partnership">Partnership opportunity</option>
                    <option value="press">Press / Media</option>
                    <option value="technical">Technical support</option>
                    <option value="feedback">Feedback / Suggestion</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-ink-800/70 dark:text-ink-50/70 mb-1">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="input-field resize-none"
                    placeholder="Tell us how we can help..."
                  />
                </div>
                <button type="submit" disabled={submitting} className="btn-primary w-full sm:w-auto">
                  {submitting ? 'Sending...' : 'Send message'}
                </button>
              </form>
            </FadeIn>
          )}
        </div>

        <div>
          <FadeIn>
            <h2 className="font-display text-2xl font-semibold mb-6">Other ways to reach us</h2>
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
            <h3 className="font-display text-xl font-semibold mb-4">Follow us</h3>
            <div className="flex flex-wrap gap-3">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-sakura-500/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sakura-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 dark:focus-visible:ring-offset-ink-950" aria-label="Twitter">𝕏</a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-sakura-500/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sakura-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 dark:focus-visible:ring-offset-ink-950" aria-label="GitHub">⌘</a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-sakura-500/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sakura-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 dark:focus-visible:ring-offset-ink-950" aria-label="Discord">💬</a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-sakura-500/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sakura-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 dark:focus-visible:ring-offset-ink-950" aria-label="YouTube">▶️</a>
            </div>
          </FadeIn>

          <FadeIn delay={0.3} className="mt-10 p-6 glass rounded-xl bg-sakura-500/5 border-sakura-500/20">
            <h3 className="font-display text-lg font-semibold mb-2">For universities & partners</h3>
            <p className="text-ink-800/60 dark:text-ink-50/60">
              Interested in listing your institution or partnering with JapanUni? 
              <a href="mailto:partners@japanuni.com" className="text-sakura-500 hover:underline font-medium">Contact our partnerships team</a>.
            </p>
          </FadeIn>
        </div>
      </SlideUp>
    </div>
  )
}