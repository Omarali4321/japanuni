'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from './auth-provider'
import { CommandPalette } from './command-palette'

const navLinks = [
  ['/universities', 'Universities'],
  ['/match', 'Smart Match'],
  ['/scholarships', 'Scholarships'],
  ['/admission', 'Admission'],
  ['/visa', 'Visa'],
  ['/student-life', 'Student Life'],
]

const userLinks = [
  ['/dashboard', 'Dashboard'],
  ['/favorites', 'Favorites'],
]

export function SiteNavbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
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
      <header className={`fixed inset-x-0 top-0 z-50 h-nav bg-background/95 backdrop-blur-sm border-b border-border transition-shadow duration-200 ${scrolled ? 'shadow-card' : ''}`}>
        <nav className="mx-auto max-w-content flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="font-display text-xl font-bold text-ink" aria-label="JapanUni Home">
            JapanUni
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className="nav-link px-0 py-2"
              >
                {label}
              </Link>
            ))}
            {user && userLinks.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className="nav-link px-0 py-2"
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background hover:bg-warm-surface transition-colors duration-200 focus-visible-ring"
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                >
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center font-sans font-medium text-sm text-accent">
                    {user.fullName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="hidden sm:block font-sans text-sm font-medium text-ink">
                    {user.fullName || 'Account'}
                  </span>
                  <motion.span
                    className="text-xs text-muted"
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
                      className="absolute right-0 mt-2 w-48 rounded-card bg-background border border-border shadow-lg py-2 z-50"
                      role="menu"
                    >
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 font-sans text-sm text-ink hover:bg-warm-surface"
                        role="menuitem"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/favorites"
                        className="block px-4 py-2 font-sans text-sm text-ink hover:bg-warm-surface"
                        role="menuitem"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Favorites
                      </Link>
                      <hr className="my-2 border-border" />
                      <button
                        className="w-full text-left px-4 py-2 font-sans text-sm text-accent hover:bg-warm-surface"
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
                <Link href="/login" className="btn-ghost hidden sm:block">Login</Link>
                <Link href="/register" className="btn-primary">Sign up</Link>
              </>
            )}
          </div>

          <button
            type="button"
            className="p-2 font-sans text-xl md:hidden focus-visible-ring rounded-lg"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
            aria-expanded={open}
          >
            {open ? '✕' : '☰'}
          </button>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-border bg-background/95 backdrop-blur-sm md:hidden overflow-hidden"
            >
              <div className="p-4 flex flex-col gap-3">
                {navLinks.map(([href, label]) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className="font-sans text-sm font-medium text-ink/70 hover:text-accent py-2 focus-visible-ring rounded-lg px-2"
                  >
                    {label}
                  </Link>
                ))}
                <hr className="border-border" />
                {user ? (
                  <>
                    {userLinks.map(([href, label]) => (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setOpen(false)}
                        className="font-sans text-sm font-medium text-ink/70 hover:text-accent py-2 focus-visible-ring rounded-lg px-2"
                      >
                        {label}
                      </Link>
                    ))}
                    <button
                      className="text-left font-sans text-sm text-accent py-2 focus-visible-ring rounded-lg px-2"
                      onClick={() => { setOpen(false); void logout() }}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setOpen(false)}
                      className="font-sans text-sm font-medium text-ink/70 hover:text-accent py-2 focus-visible-ring rounded-lg px-2"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="btn-primary text-center py-2"
                      onClick={() => setOpen(false)}
                    >
                      Sign up
                    </Link>
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
