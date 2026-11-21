import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getGuides } from '@/lib/data'
import { FadeIn, SlideUp } from '@/components/ui/Motion'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  const guides = getGuides('admission') ?? []
  return guides.map((guide) => ({ id: String(guide.id) }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const guides = getGuides('admission') ?? []
  const guide = guides.find((g) => String(g.id) === id)
  if (!guide) return { title: 'Not Found' }
  return { title: `${guide.title} | Admission Guide | JapanUni` }
}

export default async function AdmissionDetailPage({ params }: Props) {
  const { id } = await params
  const guides = getGuides('admission') ?? []
  const guide = guides.find((g) => String(g.id) === id)

  if (!guide) notFound()

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <FadeIn>
        <Link href="/admission" className="inline-flex items-center gap-2 text-sm text-muted hover:text-accent transition-colors mb-6">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Admission Guide
        </Link>
        {guide.category && (
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-accent mb-4">
            {guide.category}
          </span>
        )}
        <h1 className="section-title">{guide.title}</h1>
        <p className="mt-2 text-sm text-muted">
          Last updated: November 2024
        </p>
      </FadeIn>
      <SlideUp delay={0.1} className="mt-8">
        <article className="card p-8 md:p-12">
          <div className="whitespace-pre-wrap text-base leading-relaxed text-muted">
            {guide.content}
          </div>
        </article>
      </SlideUp>
    </div>
  )
}