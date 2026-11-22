'use client'

import Link from 'next/link'
import { ErrorState } from './public-states'
import { FadeIn, SlideUp, StaggerContainer, StaggerItem, HoverLift } from '@/components/ui/Motion'
import { ListItemSkeleton } from '@/components/ui/Skeleton'
import { motion, AnimatePresence } from 'framer-motion'

interface Guide {
  id: number
  title: string
  content: string
  category: string | null
  sortOrder: number
  visaType?: string | null
  imageUrl?: string | null
}

interface ContentListProps {
  items: Guide[]
  title: string
  description: string
  kind: 'admission' | 'visa' | 'student'
}

const kindConfig = {
  admission: {
    gradient: 'from-white via-indigo-50/50 to-white',
    accent: 'indigo',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    bgColor: 'indigo-500/10',
    textColor: 'indigo-600',
    darkTextColor: 'indigo-400',
  },
  visa: {
    gradient: 'from-white via-emerald-50/50 to-white',
    accent: 'emerald',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    bgColor: 'emerald-500/10',
    textColor: 'emerald-600',
    darkTextColor: 'emerald-400',
  },
  student: {
    gradient: 'from-white via-sakura-50/50 to-white',
    accent: 'sakura',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    bgColor: 'sakura-500/10',
    textColor: 'sakura-600',
    darkTextColor: 'sakura-400',
  },
}

export function ContentList({ items, title, description, kind }: ContentListProps) {
  const basePath = kind === 'student' ? '/student-life' : `/${kind}`
  const config = kindConfig[kind]

  return (
    <section className="relative">
      {/* Hero Section */}
      <div className={`relative overflow-hidden bg-gradient-to-b ${config.gradient}`}>
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 h-[500px] w-[500px] rounded-full bg-[var(--accent-color)]/10 blur-[200px]" style={{ '--accent-color': `rgb(var(--${config.accent}-rgb))` } as React.CSSProperties} aria-hidden="true" />
          <div className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-[var(--accent-color)]/10 blur-[200px]" style={{ '--accent-color': `rgb(var(--${config.accent}-rgb))` } as React.CSSProperties} aria-hidden="true" />
        </div>
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="mx-auto max-w-3xl text-center">
              <span className={`inline-flex items-center gap-2 rounded-full ${config.bgColor} px-4 py-1.5 text-sm font-medium ${config.textColor} dark:${config.darkTextColor} mb-6`}>
                {config.icon}
                {kind === 'student' ? 'Student Life' : `${kind.charAt(0).toUpperCase() + kind.slice(1)} Guide`}
              </span>
              <h1 className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl lg:text-6xl">
                {title}
              </h1>
              <p className="mt-4 text-lg text-ink-800/60 dark:text-ink-50/60 max-w-2xl mx-auto">
                {description}
              </p>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {items?.length === 0 && (
            <FadeIn key="empty">
              <div className="glass-card p-12 text-center border border-white/20">
                <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-[var(--accent-color)]/10 flex items-center justify-center" style={{ '--accent-color': `rgb(var(--${config.accent}-rgb))` } as React.CSSProperties}>
                  {config.icon}
                </div>
                <h3 className="font-display text-xl font-semibold text-ink">No guides published yet</h3>
                <p className="mt-2 text-ink-800/60 dark:text-ink-50/60">Check back soon for comprehensive {kind} guides.</p>
              </div>
            </FadeIn>
          )}

          {items && items.length > 0 && (
            <FadeIn key="results">
              <div className="mb-4 text-sm text-ink-800/60 dark:text-ink-50/60">
                {items.length} guide{items.length !== 1 ? 's' : ''} available
              </div>
              <StaggerContainer staggerDelay={0.06} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {items.map((item, index) => (
                  <StaggerItem key={String(item.id)} customDelay={index * 0.04}>
                    <HoverLift>
                      <Link href={`${basePath}/${item.id}`} className="block">
                        <article className="glass-card p-6 border border-white/20 overflow-hidden h-full flex flex-col">
                          {(kind === 'student' || kind === 'admission') && typeof item.imageUrl === 'string' && item.imageUrl ? (
                            <div className="relative mb-4 -mx-6 -mt-6 h-48">
                              <img
                                src={item.imageUrl}
                                alt={item.title}
                                className="h-full w-full object-cover rounded-t-xl"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/20 to-transparent rounded-t-xl" />
                            </div>
                          ) : (
                            <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${config.bgColor} ${config.textColor} dark:${config.darkTextColor}`}>
                              {config.icon}
                            </div>
                          )}
                          <div className="flex-1 flex flex-col">
                            <span className={`text-xs font-semibold uppercase tracking-wider ${config.textColor} dark:${config.darkTextColor}`}>
                              {item.category || item.visaType || 'General'}
                            </span>
                            <h2 className="mt-2 font-display text-xl font-semibold text-ink truncate">
                              {item.title}
                            </h2>
                            <p className="mt-auto text-sm leading-relaxed text-ink-800/60 dark:text-ink-50/60 flex items-center gap-1">
                              Read more
                              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </p>
                          </div>
                        </article>
                      </Link>
                    </HoverLift>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </FadeIn>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
