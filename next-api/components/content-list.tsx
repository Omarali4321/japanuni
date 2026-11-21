'use client'

import Link from 'next/link'
import { FadeIn, SlideUp, StaggerContainer, StaggerItem, HoverLift } from '@/components/ui/Motion'

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
    <section className="mx-auto max-w-content px-4 py-16 sm:px-6 lg:px-8">
      <FadeIn>
        <h1 className="section-title">{title}</h1>
        <p className="mt-2 text-muted">{description}</p>
      </FadeIn>
      <SlideUp delay={0.1}>
        {items?.length === 0 && <FadeIn><div className="card mt-8 text-center text-muted py-8">No content has been published yet.</div></FadeIn>}
        {items && items.length > 0 && (
          <StaggerContainer staggerDelay={0.08} className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item, index) => (
              <StaggerItem key={String(item.id)} customDelay={index * 0.05}>
                <HoverLift>
                  <Link href={`${basePath}/${item.id}`} className="block">
                    <article className="card overflow-hidden transition-all duration-300 hover:shadow-xl">
                      {kind === 'student' && typeof item.imageUrl === 'string' && item.imageUrl ? (
                        <img src={item.imageUrl} alt="" className="h-48 w-full object-cover" />
                      ) : null}
                      <div className="p-6">
                        <p className="text-xs font-semibold uppercase tracking-wider text-accent">{item.category || item.visaType || ''}</p>
                        <h2 className="mt-2 font-display text-lg font-semibold text-ink">{item.title}</h2>
                        <p className="mt-3 text-sm leading-relaxed text-muted">
                          Read more →
                        </p>
                      </div>
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
