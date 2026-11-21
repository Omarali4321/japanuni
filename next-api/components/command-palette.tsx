'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { debounce } from 'lodash-es'
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/Motion'
import { UniversityCardSkeleton } from '@/components/ui/Skeleton'

interface University {
  id: number
  name: string
  city: string
  country: string
  imageUrl?: string
}

interface SearchResult {
  universities: University[]
  guides: { title: string; href: string; kind: string }[]
}

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult>({ universities: [], guides: [] })
  const [loading, setLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const search = useCallback(
    debounce(async (q: string) => {
      if (!q.trim() || q.length < 2) {
        setResults({ universities: [], guides: [] })
        return
      }
      setLoading(true)
      try {
        const [uniRes, guideRes] = await Promise.all([
          fetch(`/api/universities?search=${encodeURIComponent(q)}&size=5`),
          fetch(`/api/guides/search?q=${encodeURIComponent(q)}&size=3`),
        ])
        const [uniData, guideData] = await Promise.all([uniRes.json(), guideRes.json()])
        setResults({
          universities: uniData.data || [],
          guides: guideData.data || [],
        })
        setSelectedIndex(0)
      } catch {
        setResults({ universities: [], guides: [] })
      } finally {
        setLoading(false)
      }
    }, 200),
    []
  )

  useEffect(() => {
    search(query)
  }, [query, search])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(true)
      }
      if (e.key === 'Escape') {
        setOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  const handleSelect = (href: string) => {
    router.push(href)
    setOpen(false)
    setQuery('')
  }

  const totalResults = results.universities.length + results.guides.length

  const handleKeyNav = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((i) => Math.min(i + 1, totalResults - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const allResults = [...results.guides, ...results.universities]
      if (allResults[selectedIndex]) {
        if ('kind' in allResults[selectedIndex]) {
          handleSelect(allResults[selectedIndex].href)
        } else {
          handleSelect(`/universities/${allResults[selectedIndex].id}`)
        }
      }
    }
  }

  if (!open) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-start justify-center pt-20"
        onClick={() => { setOpen(false); setQuery('') }}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="w-full max-w-2xl bg-white dark:bg-ink-950 rounded-2xl shadow-2xl glass border border-white/10 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative p-4">
            <div className="flex items-center gap-3">
              <kbd className="px-2 py-1 text-xs bg-muted-100 dark:bg-muted-800 rounded font-mono">⌘</kbd>
              <kbd className="px-2 py-1 text-xs bg-muted-100 dark:bg-muted-800 rounded font-mono">K</kbd>
              <span className="text-sm text-ink-800/50 dark:text-ink-50/50">Open command palette</span>
            </div>
            <div className="relative mt-3">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-800/40 dark:text-ink-50/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0) }}
                onKeyDown={handleKeyNav}
                placeholder="Search universities, guides..."
                className="w-full px-10 py-3 pl-12 text-lg bg-muted-50 dark:bg-muted-800/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-sakura-500/50"
                aria-label="Search"
                autoComplete="off"
              />
              {loading && (
                <motion.div className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                  <svg className="w-full h-full text-sakura-500" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </motion.div>
              )}
            </div>
          </div>

          <div className="border-t border-white/10 max-h-[50vh] overflow-y-auto">
            <AnimatePresence mode="wait">
              {(results.universities.length > 0 || results.guides.length > 0) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {results.guides.length > 0 && (
                    <div className="p-4">
                      <h4 className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-ink-800/50 dark:text-ink-50/50">Guides</h4>
                      {results.guides.map((guide, index) => (
                        <Link
                          key={guide.href}
                          href={guide.href}
                          onClick={() => handleSelect(guide.href)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${selectedIndex === index ? 'bg-sakura-500/10' : 'hover:bg-white/5 dark:hover:bg-ink-800'} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sakura-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 dark:focus-visible:ring-offset-ink-950`}
                          aria-selected={selectedIndex === index}
                        >
                          <span className="w-8 h-8 rounded-lg bg-sakura-500/10 flex items-center justify-center text-sakura-500">
                            {guide.kind === 'visa' ? '🛂' : guide.kind === 'admission' ? '📋' : '🇯🇵'}
                          </span>
                          <div>
                            <p className="font-medium text-ink-800 dark:text-ink-50">{guide.title}</p>
                            <p className="text-xs text-ink-800/50 dark:text-ink-50/50 capitalize">{guide.kind} guide</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {results.universities.length > 0 && (
                    <div className="p-4">
                      <h4 className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-ink-800/50 dark:text-ink-50/50">Universities</h4>
                      {results.universities.map((uni, index) => {
                        const globalIndex = results.guides.length + index
                        return (
                          <Link
                            key={uni.id}
                            href={`/universities/${uni.id}`}
                            onClick={() => handleSelect(`/universities/${uni.id}`)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${selectedIndex === globalIndex ? 'bg-sakura-500/10' : 'hover:bg-white/5 dark:hover:bg-ink-800'} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sakura-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 dark:focus-visible:ring-offset-ink-950`}
                            aria-selected={selectedIndex === globalIndex}
                          >
                            <div className="w-10 h-10 rounded-lg bg-sakura-500/10 flex items-center justify-center overflow-hidden">
                              {uni.imageUrl ? (
                                <img src={uni.imageUrl} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-2xl">🏛️</span>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-ink-800 dark:text-ink-50 truncate">{uni.name}</p>
                              <p className="text-xs text-ink-800/50 dark:text-ink-50/50">{uni.city}, {uni.country}</p>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {(!loading && query.length >= 2 && totalResults === 0) && (
              <FadeIn className="p-8 text-center">
                <p className="text-ink-800/60 dark:text-ink-50/60">No results found for "{query}"</p>
                <p className="text-sm text-ink-800/40 dark:text-ink-50/40 mt-1">Try different keywords</p>
              </FadeIn>
            )}

            {(!loading && query.length < 2) && (
              <FadeIn className="p-8">
                <h4 className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-ink-800/50 dark:text-ink-50/50">Quick links</h4>
                <div className="grid grid-cols-2 gap-2 px-4">
                  {[
                    ['/universities', '🎓', 'Universities'],
                    ['/match', '🔍', 'Smart Match'],
                    ['/scholarships', '💴', 'Scholarships'],
                    ['/compare', '⚖️', 'Compare'],
                    ['/admission', '📋', 'Admission'],
                    ['/visa', '🛂', 'Visa'],
                    ['/student-life', '🇯🇵', 'Student Life'],
                    ['/dashboard', '📊', 'Dashboard'],
                  ].map(([href, icon, label]) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => handleSelect(href)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 dark:hover:bg-ink-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sakura-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 dark:focus-visible:ring-offset-ink-950"
                    >
                      <span className="text-lg">{icon}</span>
                      <span className="font-medium text-ink-800 dark:text-ink-50">{label}</span>
                    </Link>
                  ))}
                </div>
              </FadeIn>
            )}

            {loading && query.length >= 2 && (
              <div className="p-8">
                <StaggerContainer staggerDelay={0.05} className="grid gap-4 md:grid-cols-2 px-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <StaggerItem key={i}><UniversityCardSkeleton /></StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
            )}
          </div>

          <div className="px-4 py-3 border-t border-white/10 flex items-center justify-between text-xs text-ink-800/40 dark:text-ink-50/40">
            <span>⌘K to open • ↑↓ to navigate • Enter to select • Esc to close</span>
            <span>{totalResults} result{totalResults !== 1 ? 's' : ''}</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}