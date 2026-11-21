'use client'

import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/components/auth-provider'
import { ErrorState } from '@/components/public-states'
import { addFavorite, createReview, deleteReview, getReviews, removeFavorite, type University } from '@/lib/web-api'
import { FadeIn, SlideUp, HoverLift } from '@/components/ui/Motion'

type Review = { id: number; rating: number; comment: string | null; userName: string }

function splitCatalogItems(value: string | null) {
  if (!value) return []
  return [...new Map(value.split('|').map((item) => item.trim()).filter(Boolean).map((item) => [item.toLocaleLowerCase(), item])).values()]
}

function getPhotoUrl(university: University): string {
  if (university.images && university.images.length > 0) {
    return university.images[0]
  }
  // Fallback to Unsplash with university name for variety
  const encodedName = encodeURIComponent(university.name)
  return `https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1328&h=1500&fit=crop&q=80&auto=format`
}

interface UniversityDetailProps {
  university: University
}

export default function UniversityDetail({ university }: UniversityDetailProps) {
  const { user } = useAuth()
  const [reviews, setReviews] = useState<Review[]>([])
  const [error, setError] = useState('')
  const [form, setForm] = useState({ rating: 5, comment: '' })
  const [pending, setPending] = useState(false)
  const [showAllPrograms, setShowAllPrograms] = useState(false)
  const [showAllFaculties, setShowAllFaculties] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const photoRef = useRef<HTMLDivElement>(null)

  // Photo blur on scroll: start after 80px, ramp 0→12px over 360px
  useEffect(() => {
    function handleScroll() {
      const y = window.scrollY
      setScrollY(y)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Fetch reviews on mount
  useEffect(() => {
    getReviews(String(university.id))
      .then(setReviews)
      .catch((reason) => setError(reason instanceof Error ? reason.message : 'Could not load reviews'))
  }, [university.id])

  async function toggleFavorite() {
    setPending(true)
    try {
      if (university.favorited) await removeFavorite(university.id)
      else await addFavorite(university.id)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not update favorite')
    } finally {
      setPending(false)
    }
  }

  async function submitReview(event: React.FormEvent) {
    event.preventDefault()
    setPending(true)
    try {
      await createReview(String(university.id), form)
      const items = await getReviews(String(university.id))
      setReviews(items)
      setForm({ rating: 5, comment: '' })
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not create review')
    } finally {
      setPending(false)
    }
  }

  async function removeReview(reviewId: number) {
    try {
      await deleteReview(reviewId)
      const items = await getReviews(String(university.id))
      setReviews(items)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not delete review')
    }
  }

  if (error) return <div className="mx-auto max-w-7xl px-4 py-16"><ErrorState message={error} /></div>

  const programs = splitCatalogItems(university.programs)
  const faculties = splitCatalogItems(university.faculty)
  const visiblePrograms = showAllPrograms ? programs : programs.slice(0, 8)
  const visibleFaculties = showAllFaculties ? faculties : faculties.slice(0, 8)

  // Photo blur calculation: progress = clamp((scrollY − 80) / 360, 0, 1); radius = 12 × progress px
  const blurRadius = Math.min(Math.max((scrollY - 80) / 360, 0), 1) * 12

  const photoUrl = getPhotoUrl(university)

  return (
    <>
      {/* Large photo header with blur on scroll */}
      <div className="relative w-full" style={{ height: '750px', maxHeight: '75vh' }}>
        <div
          ref={photoRef}
          className="absolute inset-0 bg-cover bg-center transition-all duration-700"
          style={{
            backgroundImage: `url(${photoUrl})`,
            filter: `blur(${blurRadius}px)`,
            transform: `translateY(${scrollY * 0.3}px)`
          }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full pb-12">
            <FadeIn>
              <Link href="/universities" className="inline-flex items-center gap-1 text-sm font-medium text-ink-600 hover:text-accent transition-colors mb-4">
                ← Universities
              </Link>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-ink max-w-3xl">{university.name}</h1>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-muted">
                <span className="badge-type">{university.institutionType || 'University'}</span>
                {university.intake && <span className="badge-intake">{university.intake}</span>}
                {university.mediumOfInstruction && <span className="badge-language">{university.mediumOfInstruction.split('|')[0].trim()}</span>}
              </div>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* Main content */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 -mt-12 relative z-10">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
          <div>
            <div className="mt-8 space-y-6">
              {/* Programs */}
              <div className="card">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="font-display text-xl font-semibold">Programs</h2>
                  {programs.length > 0 && <span className="text-sm text-muted">{programs.length} listed</span>}
                </div>
                {programs.length ? (
                  <ul className="mt-4 grid gap-x-8 gap-y-2 text-sm leading-relaxed text-ink/75 sm:grid-cols-2">
                    {visiblePrograms.map((program, index) => (
                      <li key={`${index}-${program}`} className="border-b border-border/50 pb-2">{program}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-muted">Program details are not listed yet.</p>
                )}
                {programs.length > 8 && (
                  <button
                    type="button"
                    className="mt-4 text-sm font-medium text-accent hover:underline"
                    aria-expanded={showAllPrograms}
                    onClick={() => setShowAllPrograms((shown) => !shown)}
                  >
                    {showAllPrograms ? 'Show fewer programs' : `Show all ${programs.length} programs`}
                  </button>
                )}
              </div>

              {/* Faculties */}
              {faculties.length > 0 && (
                <details className="card group">
                  <summary className="cursor-pointer list-none font-display text-xl font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
                    Faculties and departments <span className="ml-2 text-sm font-normal text-muted">({faculties.length})</span><span className="float-right text-sm text-accent group-open:rotate-180 transition-transform">⌄</span>
                  </summary>
                  <ul className="mt-4 grid gap-x-8 gap-y-2 text-sm leading-relaxed text-ink/75 sm:grid-cols-2">
                    {visibleFaculties.map((faculty, index) => (
                      <li key={`${index}-${faculty}`} className="border-b border-border/50 pb-2">{faculty}</li>
                    ))}
                  </ul>
                  {faculties.length > 8 && (
                    <div className="mt-4 pt-4 border-t border-border/50">
                      <button
                        type="button"
                        className="text-sm font-medium text-accent hover:underline"
                        aria-expanded={showAllFaculties}
                        onClick={() => setShowAllFaculties((shown) => !shown)}
                      >
                        {showAllFaculties ? 'Show fewer faculties' : `Show all ${faculties.length} faculties`}
                      </button>
                    </div>
                  )}
                </details>
              )}

              {/* Official source */}
              <div className="card">
                <h2 className="font-display text-xl font-semibold">Official source</h2>
                <p className="mt-2 text-sm text-muted">This listing is based on the Study in Japan school search. Information is supplied by schools and may not include every institution; confirm current details directly with the university.</p>
                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium">
                  <a className="text-accent hover:underline" href={`https://www.studyinjapan.go.jp/en/search-for-schools/school_search.php?lang=en&offset=0&go=go&narabikae=2&limit=25&school_name=${encodeURIComponent(university.name)}`} target="_blank" rel="noreferrer">View in Study in Japan catalog <span aria-hidden="true">↗</span></a>
                  {university.sourceUrl && <a className="text-accent hover:underline" href={university.sourceUrl} target="_blank" rel="noreferrer">University website <span aria-hidden="true">↗</span></a>}
                </div>
              </div>

              {/* Reviews */}
              <div className="card">
                <h2 className="font-display text-xl font-semibold">Reviews ({reviews.length})</h2>
                {user ? (
                  <form onSubmit={submitReview} className="mb-6 mt-4 space-y-3">
                    <select className="input-field" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}>
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <option key={rating} value={rating}>{rating} stars</option>
                      ))}
                    </select>
                    <textarea className="input-field" rows={3} maxLength={2000} value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} placeholder="Your experience..." />
                    <button className="btn-primary" disabled={pending}>{pending ? 'Submitting...' : 'Submit review'}</button>
                  </form>
                ) : (
                  <p className="mt-3 text-sm text-muted">Sign in to leave a review.</p>
                )}
                {reviews.length ? (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-t border-border/50 pt-4">
                        <div className="flex justify-between">
                          <span>{review.userName}</span>
                          <span>{'★'.repeat(review.rating)}</span>
                        </div>
                        {review.comment && <p className="mt-2 text-sm text-muted">{review.comment}</p>}
                        {user?.fullName === review.userName && (
                          <button className="mt-2 text-xs text-red-500" onClick={() => void removeReview(review.id)}>
                            Delete review
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-muted">No reviews yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside>
            <div className="card sticky top-24">
              {user && (
                <button className="btn-secondary mb-5 w-full" disabled={pending} onClick={() => void toggleFavorite()}>
                  {university.favorited ? '❤️ Saved' : '🤍 Save to favorites'}
                </button>
              )}
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Type</dt>
                  <dd className="text-ink font-medium">{university.institutionType || '—'}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Degree</dt>
                  <dd className="text-right text-ink font-medium">{university.degree || '—'}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Intake</dt>
                  <dd className="text-ink font-medium">{university.intake || '—'}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Instruction</dt>
                  <dd className="text-right text-ink font-medium">{university.mediumOfInstruction || '—'}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Pre-arrival</dt>
                  <dd className="text-ink font-medium">{university.preArrivalAdmission || '—'}</dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}