'use client'

import { Link } from '@/i18n/navigation'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { useAuth } from './auth-provider'
import { CommandPalette } from './command-palette'
import { LanguageSwitcher } from './language-switcher'

const navLinks = [
  ['/universities', 'universities'],
  ['/match', 'smartMatch'],
  ['/scholarships', 'scholarships'],
  ['/admission', 'admission'],
  ['/visa', 'visa'],
  ['/student-life', 'studentLife'],
] as const

const authLinks = [
  ['/dashboard', 'dashboard'],
  ['/favorites', 'favorites'],
] as const

export function SiteNavbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const { user, logout } = useAuth()
  const t = useTranslations('Nav')

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 h-nav transition-all duration-300 ${scrolled ? 'bg-background/80 backdrop-blur-md shadow-card' : 'bg-background'} border-b border-border`}>
        <nav className="mx-auto flex h-full max-w-content items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="font-display text-xl font-bold text-accent">
            JapanUni
          </Link>
          <div className="hidden items-center gap-5 xl:gap-8 xl:flex">
            {navLinks.map(([href, label]) => (
              <Link key={href} href={href} className="whitespace-nowrap text-sm font-medium text-muted transition-colors hover:text-accent relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-accent after:transition-all hover:after:w-full focus-visible-ring rounded-sm">
                {t(label)}
              </Link>
            ))}
            {user && authLinks.map(([href, label]) => (
              <Link key={href} href={href} className="whitespace-nowrap text-sm font-medium text-muted transition-colors hover:text-accent relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-accent after:transition-all hover:after:w-full focus-visible-ring rounded-sm">
                {t(label)}
              </Link>
            ))}
          </div>
          <div className="hidden items-center gap-3 xl:flex">
            <LanguageSwitcher />
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 card transition-colors hover:bg-soft-surface focus-visible-ring"
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                >
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent font-medium text-sm">
                    {user.fullName?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-medium text-ink hidden sm:block">{user.fullName || t('defaultUser')}</span>
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="absolute right-0 mt-2 w-48 card shadow-card-hover rounded-lg border border-border py-2"
                    >
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-muted hover:text-accent hover:bg-soft-surface"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                        {t('dashboard')}
                      </Link>
                      <Link
                        href="/favorites"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-muted hover:text-accent hover:bg-soft-surface"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
                        {t('favorites')}
                      </Link>
                      <hr className="my-2 border-border" />
                      <button
                        onClick={logout}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-accent hover:bg-soft-surface"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        {t('logout')}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="btn-ghost text-sm">{t('logIn')}</Link>
                <Link href="/register" className="btn-primary text-sm">{t('signUp')}</Link>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="xl:hidden p-2 rounded-lg card transition-colors hover:bg-soft-surface focus-visible-ring"
            aria-label={t('toggleMenu')}
            aria-expanded={open}
          >
            <svg className="w-6 h-6 text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </nav>
      </header>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden fixed inset-x-0 top-0 z-40 pt-16 bg-background border-b border-border shadow-lg"
          >
            <nav className="mx-auto max-w-content px-4 py-6 space-y-4">
              {navLinks.map(([href, label]) => (
                <Link key={href} href={href} className="block py-3 text-lg font-medium text-muted hover:text-accent focus-visible-ring rounded-lg" onClick={() => setOpen(false)}>
                  {t(label)}
                </Link>
              ))}
              {user && authLinks.map(([href, label]) => (
                <Link key={href} href={href} className="block py-3 text-lg font-medium text-muted hover:text-accent focus-visible-ring rounded-lg" onClick={() => setOpen(false)}>
                  {t(label)}
                </Link>
              ))}
              <LanguageSwitcher className="mt-2" />
              {!user && (
                <div className="flex flex-col gap-2 pt-4 border-t border-border">
                  <Link href="/login" className="btn-ghost text-center">{t('logIn')}</Link>
                  <Link href="/register" className="btn-primary text-center">{t('signUp')}</Link>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
      <CommandPalette />
    </>
  )
}