import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getGuides } from '@/lib/data'
import { FadeIn, SlideUp } from '@/components/ui/Motion'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  const guides = getGuides('student-life') ?? []
  return guides.map((guide) => ({ id: String(guide.id) }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const guides = getGuides('student-life') ?? []
  const guide = guides.find((g) => String(g.id) === id)
  if (!guide) return { title: 'Not Found' }
  return { title: `${guide.title} | Student Life | JapanUni` }
}

export default async function StudentLifeDetailPage({ params }: Props) {
  const { id } = await params
  const guides = getGuides('student-life') ?? []
  const guide = guides.find((g) => String(g.id) === id)

  if (!guide) notFound()

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <FadeIn>
        <Link href="/student-life" className="inline-flex items-center gap-2 text-sm text-ink-800/60 dark:text-ink-50/60 hover:text-sakura-500 transition-colors mb-6">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Student Life
        </Link>
        {guide.category && (
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-sakura-500 mb-4">
            {guide.category}
          </span>
        )}
        <h1 className="section-title">{guide.title}</h1>
        <p className="mt-2 text-sm text-ink-800/50 dark:text-ink-50/50">
          Last updated: November 2024
        </p>
      </FadeIn>
      <SlideUp delay={0.1} className="mt-8">
        <article className="glass-card p-8 md:p-12 border border-white/20">
          {guide.imageUrl && (
            <img
              src={guide.imageUrl}
              alt={guide.title}
              className="mb-8 h-64 w-full rounded-xl object-cover"
            />
          )}
          <div className="prose prose-ink max-w-none dark:prose-invert">
            {guide.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-6 text-base leading-relaxed text-ink-800/80 dark:text-ink-50/80 whitespace-pre-wrap">
                {paragraph}
              </p>
            ))}
          </div>
        </article>
      </SlideUp>
    </div>
  )
}