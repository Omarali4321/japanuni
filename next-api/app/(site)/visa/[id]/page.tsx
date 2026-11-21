import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getGuides } from '@/lib/data'
import { FadeIn, SlideUp } from '@/components/ui/Motion'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  const guides = getGuides('visa') ?? []
  return guides.map((guide) => ({ id: String(guide.id) }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const guides = getGuides('visa') ?? []
  const guide = guides.find((g) => String(g.id) === id)
  if (!guide) return { title: 'Not Found' }
  return { title: `${guide.title} | Visa Guide | JapanUni` }
}

export default async function VisaDetailPage({ params }: Props) {
  const { id } = await params
  const guides = getGuides('visa') ?? []
  const guide = guides.find((g) => String(g.id) === id)

  if (!guide) notFound()

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <FadeIn>
        <Link href="/visa" className="inline-flex items-center gap-2 text-sm text-ink-800/60 dark:text-ink-50/60 hover:text-sakura-500 transition-colors mb-6">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Visa Guide
        </Link>
        {guide.visaType && (
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-sakura-500 mb-4">
            {guide.visaType}
          </span>
        )}
        <h1 className="section-title">{guide.title}</h1>
        <p className="mt-2 text-sm text-ink-800/50 dark:text-ink-50/50">
          Last updated: November 2024
        </p>
      </FadeIn>
      <SlideUp delay={0.1} className="mt-8">
        <article className="glass-card p-8 md:p-12">
          <div className="whitespace-pre-wrap text-base leading-relaxed text-ink-800/75 dark:text-ink-50/75">
            {guide.content}
          </div>
        </article>
      </SlideUp>
    </div>
  )
}