'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useTheme } from './theme-provider'

const links = [
  ['/universities', 'Universities'],
  ['/match', 'Smart Match'],
  ['/scholarships', 'Scholarships'],
  ['/admission', 'Admission'],
  ['/visa', 'Visa'],
  ['/student-life', 'Student Life'],
]

export function SiteNavbar() {
  const [open, setOpen] = useState(false)
  const { dark, toggle } = useTheme()

  return (
    <header className="fixed inset-x-0 top-0 z-50 glass border-b border-white/10">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="bg-gradient-to-r from-sakura-500 to-sakura-600 bg-clip-text font-display text-xl font-bold text-transparent">
          JapanUni
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          {links.map(([href, label]) => <Link key={href} href={href} className="text-sm font-medium text-ink-800/70 transition-colors hover:text-sakura-500 dark:text-ink-50/70">{label}</Link>)}
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <button type="button" onClick={toggle} className="rounded-lg p-2 glass" aria-label="Toggle theme">{dark ? '☀️' : '🌙'}</button>
          <Link href="/login" className="text-sm font-medium hover:text-sakura-500">Login</Link>
          <Link href="/register" className="btn-primary px-4 py-2 text-sm">Sign up</Link>
        </div>
        <button type="button" className="p-2 text-2xl md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">{open ? '✕' : '☰'}</button>
      </nav>
      {open && <div className="flex flex-col gap-3 border-t border-white/10 p-4 glass md:hidden">
        {links.map(([href, label]) => <Link key={href} href={href} onClick={() => setOpen(false)}>{label}</Link>)}
        <Link href="/login" onClick={() => setOpen(false)}>Login</Link>
        <Link href="/register" className="btn-primary text-center" onClick={() => setOpen(false)}>Sign up</Link>
      </div>}
    </header>
  )
}
