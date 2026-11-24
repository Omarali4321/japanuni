'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useAuth } from './auth-provider'
import { FadeIn, SlideUp } from '@/components/ui/Motion'
import { motion } from 'framer-motion'

export function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const router = useRouter()
  const { refresh } = useAuth()
  const [form, setForm] = useState({ email: '', password: '', fullName: '' })
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  const [, setFocusedField] = useState<string | null>(null)

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setPending(true)
    setError('')
    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const body = await response.json()
      if (!response.ok) throw new Error(body.error?.message || 'Authentication failed')
      await refresh()
      router.push('/dashboard')
      router.refresh()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Authentication failed')
    } finally {
      setPending(false)
    }
  }

  const config = mode === 'login' ? {
    accent: 'indigo',
    bgColor: 'indigo-500/10',
    textColor: 'indigo-600',
    darkTextColor: 'indigo-400',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
      </svg>
    ),
    title: 'Welcome Back',
    subtitle: 'Sign in to save favorites, compare universities, and track your applications.',
    ctaText: 'Sign In',
    switchText: "Don't have an account?",
    switchLink: '/register',
    switchLinkText: 'Create one',
  } : {
    accent: 'sakura',
    bgColor: 'sakura-500/10',
    textColor: 'sakura-600',
    darkTextColor: 'sakura-400',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
      </svg>
    ),
    title: 'Create Your Account',
    subtitle: 'Start planning your study journey in Japan. Save universities, compare programs, and get personalized matches.',
    ctaText: 'Create Account',
    switchText: 'Already have an account?',
    switchLink: '/login',
    switchLinkText: 'Sign in',
  }

  return (
    <div className="relative min-h-screen flex">
      {/* Hero/Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-ink-50/50 to-white" />
        <div className="absolute top-1/4 left-1/4 h-[500px] w-[500px] rounded-full bg-[var(--accent-color)]/10 blur-[200px]" style={{ '--accent-color': `rgb(var(--${config.accent}-rgb))` } as React.CSSProperties} aria-hidden="true" />
        <div className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-[var(--accent-color)]/10 blur-[200px]" style={{ '--accent-color': `rgb(var(--${config.accent}-rgb))` } as React.CSSProperties} aria-hidden="true" />
      </div>

      {/* Main Form Card - Centered */}
      <div className="relative flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-full max-w-md"
        >
          {/* Brand Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <span className={`w-12 h-12 rounded-2xl flex items-center justify-center ${config.bgColor} ${config.textColor} dark:${config.darkTextColor}`}>
                {config.icon}
              </span>
            </Link>
            <FadeIn>
              <h1 className="font-display text-4xl font-bold tracking-tight text-ink">{config.title}</h1>
              <p className="mt-3 text-lg text-ink-800/60 dark:text-ink-50/60">{config.subtitle}</p>
            </FadeIn>
          </div>

          {/* Form Card */}
          <FadeIn delay={0.1}>
            <SlideUp delay={0.15}>
              <form onSubmit={submit} className="glass-card p-8 border border-white/20 shadow-xl">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 rounded-xl bg-sakura-500/5 border border-sakura-500/20"
                    role="alert"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-sakura-500/10 flex items-center justify-center">
                        <svg className="w-5 h-5 text-sakura-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <p className="text-sm text-ink-800/80 dark:text-ink-50/80">{error}</p>
                    </div>
                  </motion.div>
                )}

                {mode === 'register' && (
                  <div className="space-y-1.5 mb-5">
                    <label htmlFor="fullName" className="block text-sm font-medium text-ink-800 dark:text-ink-50">
                      Full Name
                    </label>
                    <div className="relative">
                      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-800/30 dark:text-ink-50/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <input
                        id="fullName"
                        type="text"
                        className="input-field pl-10"
                        required
                        minLength={2}
                        maxLength={100}
                        placeholder="Your full name"
                        value={form.fullName}
                        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                        onFocus={() => setFocusedField('fullName')}
                        onBlur={() => setFocusedField(null)}
                        autoComplete="name"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1.5 mb-5">
                  <label htmlFor="email" className="block text-sm font-medium text-ink-800 dark:text-ink-50">
                    Email Address
                  </label>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-800/30 dark:text-ink-50/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <input
                      id="email"
                      type="email"
                      className="input-field pl-10"
                      required
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 mb-6">
                  <label htmlFor="password" className="block text-sm font-medium text-ink-800 dark:text-ink-50">
                    Password
                  </label>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-800/30 dark:text-ink-50/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <input
                      id="password"
                      type="password"
                      className="input-field pl-10 pr-12"
                      required
                      minLength={6}
                      maxLength={100}
                      placeholder="••••••••"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={pending}
                  className="btn-primary w-full py-3 text-base font-medium"
                >
                  {pending ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                    </span>
                  ) : (
                    config.ctaText
                  )}
                </button>
              </form>
            </SlideUp>
          </FadeIn>

          {/* Switch Link */}
          <FadeIn delay={0.2}>
            <p className="mt-6 text-center text-sm text-ink-800/60 dark:text-ink-50/60">
              {config.switchText}{' '}
              <Link href={config.switchLink} className="font-medium text-sakura-500 hover:text-sakura-600 hover:underline transition-colors">
                {config.switchLinkText}
              </Link>
            </p>
          </FadeIn>

          {/* Benefits List */}
          <FadeIn delay={0.25}>
            <div className="mt-8 glass-card p-5 border border-white/20">
              <h3 className="font-medium text-ink mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-sakura-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Why join JapanUni?
              </h3>
              <ul className="space-y-2 text-sm text-ink-800/60 dark:text-ink-50/60">
                <li className="flex items-start gap-2">
                  <svg className="flex-shrink-0 mt-0.5 w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save & compare universities
                </li>
                <li className="flex items-start gap-2">
                  <svg className="flex-shrink-0 mt-0.5 w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Get personalized AI matches
                </li>
                <li className="flex items-start gap-2">
                  <svg className="flex-shrink-0 mt-0.5 w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Access admission guides & visa info
                </li>
                <li className="flex items-start gap-2">
                  <svg className="flex-shrink-0 mt-0.5 w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Track applications & deadlines
                </li>
              </ul>
            </div>
          </FadeIn>
        </motion.div>
      </div>
    </div>
  )
}
