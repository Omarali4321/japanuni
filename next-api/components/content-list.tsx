'use client'

import { useEffect, useState } from 'react'
import { ErrorState } from './public-states'
import { listContent } from '@/lib/web-api'
import { FadeIn, SlideUp, StaggerContainer, StaggerItem, HoverLift } from '@/components/ui/Motion'
import { ListItemSkeleton } from '@/components/ui/Skeleton'

export function ContentList({ path, title, description, kind }: { path: string; title: string; description: string; kind: 'admission' | 'visa' | 'student' }) {
  const [items, setItems] = useState<Array<Record<string, unknown>> | null>(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    listContent(path)
      .then(setItems)
      .catch((reason) => setError(reason.message))
      .finally(() => setIsLoading(false))
  }, [path])

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <FadeIn>
        <h1 className="section-title">{title}</h1>
        <p className="mt-2 text-ink-800/60 dark:text-ink-50/60">{description}</p>
      </FadeIn>
      <SlideUp delay={0.1}>
        {error && <FadeIn><div className="mt-8"><ErrorState message={error} /></div></FadeIn>}
        {isLoading && (
          <StaggerContainer staggerDelay={0.08} className="mt-8 grid gap-6 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <StaggerItem key={i}><ListItemSkeleton hasAvatar={kind === 'student'} /></StaggerItem>
            ))}
          </StaggerContainer>
        )}
        {!isLoading && items?.length === 0 && <FadeIn><div className="glass-card mt-8 text-center text-ink-800/60 dark:text-ink-50/60">No content has been published yet.</div></FadeIn>}
        {!isLoading && items && items.length > 0 && (
          <StaggerContainer staggerDelay={0.08} className="mt-8 grid gap-6 md:grid-cols-3">
            {items.map((item, index) => (
              <StaggerItem key={String(item.id)} customDelay={index * 0.05}>
                <HoverLift>
                  <article className="glass-card">
                    {kind === 'student' && typeof item.imageUrl === 'string' && item.imageUrl ? (
                      <img src={item.imageUrl} alt="" className="mb-5 h-40 w-full rounded-xl object-cover" />
                    ) : null}
                    <p className="text-xs font-semibold uppercase tracking-wider text-sakura-500">{String(item.category || item.visaType || '')}</p>
                    <h2 className="mt-2 font-display text-xl font-semibold">{String(item.title)}</h2>
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink-800/75 dark:text-ink-50/75">{String(item.content)}</p>
                  </article>
                </HoverLift>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </SlideUp>
    </section>
  )
}
