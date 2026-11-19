'use client'

import Link from 'next/link'
import { ErrorState } from './public-states'
import { FadeIn, SlideUp, StaggerContainer, StaggerItem, HoverLift } from '@/components/ui/Motion'
import { ListItemSkeleton } from '@/components/ui/Skeleton'

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

export function ContentList({ items, title, description, kind }: ContentListProps) {
  const basePath = kind === 'student' ? '/student-life' : `/${kind}`

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <FadeIn>
        <h1 className="section-title">{title}</h1>
        <p className="mt-2 text-ink-800/60 dark:text-ink-50/60">{description}</p>
      </FadeIn>
      <SlideUp delay={0.1}>
        {items?.length === 0 && <FadeIn><div className="glass-card mt-8 text-center text-ink-800/60 dark:text-ink-50/60">No content has been published yet.</div></FadeIn>}
        {items && items.length > 0 && (
          <StaggerContainer staggerDelay={0.08} className="mt-8 grid gap-6 md:grid-cols-3">
            {items.map((item, index) => (
              <StaggerItem key={String(item.id)} customDelay={index * 0.05}>
                <HoverLift>
                  <Link href={`${basePath}/${item.id}`} className="block">
                    <article className="glass-card">
                      {kind === 'student' && typeof item.imageUrl === 'string' && item.imageUrl ? (
                        <img src={item.imageUrl} alt="" className="mb-5 h-40 w-full rounded-xl object-cover" />
                      ) : null}
                      <p className="text-xs font-semibold uppercase tracking-wider text-sakura-500">{item.category || item.visaType || ''}</p>
                      <h2 className="mt-2 font-display text-xl font-semibold">{item.title}</h2>
                      <p className="mt-3 text-sm leading-relaxed text-ink-800/75 dark:text-ink-50/75">
                        Read more →
                      </p>
                    </article>
                  </Link>
                </HoverLift>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </SlideUp>
    </section>
  )
}
