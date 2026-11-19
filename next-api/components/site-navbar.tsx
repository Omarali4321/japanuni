'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from './theme-provider'
import { useAuth } from './auth-provider'
import { CommandPalette } from './command-palette'

const links = [
  ['/universities', 'Universities'],
  ['/match', 'Smart Match'],
  ['/scholarships', 'Scholarships'],
  ['/admission', 'Admission'],
  ['/visa', 'Visa'],
  ['/student-life', 'Student Life'],
]

const authLinks = [
  ['/dashboard', 'Dashboard'],
  ['/favorites', 'Favorites'],
]

export function SiteNavbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const { dark, toggle } = useTheme()
  const { user, logout } = useAuth()

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
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 dark:bg-ink-950/80 backdrop-blur-md shadow-md' : 'glass'} border-b border-white/10`}>
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="bg-gradient-to-r from-sakura-500 to-sakura-600 bg-clip-text font-display text-xl font-bold text-transparent">
            JapanUni
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            {links.map(([href, label]) => (
              <Link key={href} href={href} className="text-sm font-medium text-ink-800/70 transition-colors hover:text-sakura-500 dark:text-ink-50/70 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-sakura-500 after:transition-all hover:after:w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sakura-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 dark:focus-visible:ring-offset-ink-950 rounded-sm">
                {label}
              </Link>
            ))}
            {user && authLinks.map(([href, label]) => (
              <Link key={href} href={href} className="text-sm font-medium text-ink-800/70 transition-colors hover:text-sakura-500 dark:text-ink-50/70 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-sakura-500 after:transition-all hover:after:w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sakura-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 dark:focus-visible:ring-offset-ink-950 rounded-sm">
                {label}
              </Link>
            ))}
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <button type="button" onClick={toggle} className="rounded-lg p-2 glass transition-colors hover:bg-sakura-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sakura-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 dark:focus-visible:ring-offset-ink-950" aria-label="Toggle theme">
              {dark ? '☀️' : '🌙'}
            </button>
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 glass transition-colors hover:bg-sakura-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sakura-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 dark:focus-visible:ring-offset-ink-950"
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sakura-500 to-sakura-600 flex items-center justify-center text-white font-medium text-sm">
                    {user.fullName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-ink-800 dark:text-ink-50">
                    {user.fullName || 'Account'}
                  </span>
                  <motion.span
                    className="text-xs"
                    animate={{ rotate: userMenuOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    ▼
                  </motion.span>
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-ink-900 shadow-lg border border-white/10 py-2 glass z-50"
                      role="menu"
                    >
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-sm text-ink-800 dark:text-ink-50 hover:bg-sakura-500/10"
                        role="menuitem"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/favorites"
                        className="block px-4 py-2 text-sm text-ink-800 dark:text-ink-50 hover:bg-sakura-500/10"
                        role="menuitem"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Favorites
                      </Link>
                      <hr className="my-2 border-white/10" />
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10"
                        role="menuitem"
                        onClick={() => { setUserMenuOpen(false); void logout() }}
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium hover:text-sakura-500 hidden sm:block">Login</Link>
                <Link href="/register" className="btn-primary px-4 py-2 text-sm">Sign up</Link>
              </>
            )}
          </div>
          <button type="button" className="p-2 text-2xl md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sakura-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 dark:focus-visible:ring-offset-ink-950 rounded-lg" onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open}>
            {open ? '✕' : '☰'}
          </button>
        </nav>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-white/10 glass md:hidden overflow-hidden"
            >
              <div className="p-4 flex flex-col gap-3">
                {links.map(([href, label]) => (
                  <Link key={href} href={href} onClick={() => setOpen(false)} className="text-sm font-medium text-ink-800/70 hover:text-sakura-500 dark:text-ink-50/70 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sakura-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 dark:focus-visible:ring-offset-ink-950 rounded-lg px-2">
                    {label}
                  </Link>
                ))}
                <hr className="border-white/10" />
                {user ? (
                  <>
                    {authLinks.map(([href, label]) => (
                      <Link key={href} href={href} onClick={() => setOpen(false)} className="text-sm font-medium text-ink-800/70 hover:text-sakura-500 dark:text-ink-50/70 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sakura-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 dark:focus-visible:ring-offset-ink-950 rounded-lg px-2">{label}</Link>
                    ))}
                    <button className="text-left text-sm text-red-500 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 dark:focus-visible:ring-offset-ink-950 rounded-lg px-2" onClick={() => { setOpen(false); void logout() }}>Logout</button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setOpen(false)} className="text-sm font-medium text-ink-800/70 hover:text-sakura-500 dark:text-ink-50/70 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sakura-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 dark:focus-visible:ring-offset-ink-950 rounded-lg px-2">Login</Link>
                    <Link href="/register" className="btn-primary text-center py-2" onClick={() => setOpen(false)}>Sign up</Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      <CommandPalette />
    </>
  )
}
