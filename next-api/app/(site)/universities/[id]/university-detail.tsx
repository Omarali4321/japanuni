'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth-provider'
import { ErrorState } from '@/components/public-states'
import { addFavorite, createReview, deleteReview, getReviews, removeFavorite, type University } from '@/lib/web-api'
import { motion } from 'framer-motion'

type Review = { id: number; rating: number; comment: string | null; userName: string; createdAt: string }

interface UniversityDetailProps {
  university: University
}

function parsePrograms(programs: string | null): string[] {
  if (!programs) return []
  return programs.split('\n').map(p => p.trim()).filter(Boolean)
}

function parseFaculties(faculty: string | null): string[] {
  if (!faculty) return []
  return faculty.split('\n').map(f => f.trim()).filter(Boolean)
}

function getImageUrl(university: University): string {
  if (university.images && university.images.length > 0) return university.images[0]
  // Fallback to a nice default image based on university name
  return `https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80`
}

export default function UniversityDetail({ university }: UniversityDetailProps) {
  const { user } = useAuth()
  const [reviews, setReviews] = useState<Review[]>([])
  const [error, setError] = useState('')
  const [form, setForm] = useState({ rating: 5, comment: '' })
  const [pending, setPending] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [expandedPrograms, setExpandedPrograms] = useState(false)
  const [expandedFaculties, setExpandedFaculties] = useState(false)

  // Photo blur on scroll calculation
  // Start blur after 80px, ramp 0→12px over 360px
  const blurRadius = Math.min(Math.max((scrollY - 80) / 360, 0), 1) * 12

  // Fetch reviews on mount
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const items = await getReviews(String(university.id))
        setReviews(items)
      } catch (reason) {
        setError(reason instanceof Error ? reason.message : 'Could not load reviews')
      }
    }
    fetchReviews()
  }, [university.id])

  // Handle scroll for photo blur
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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

  if (error) return <div className="mx-auto max-w-content px-4 py-16"><ErrorState message={error} /></div>

  const programs = parsePrograms(university.programs)
  const faculties = parseFaculties(university.faculty)
  const displayPrograms = expandedPrograms ? programs : programs.slice(0, 8)
  const hasMorePrograms = programs.length > 8

  return (
    <section className="mx-auto max-w-content px-4 py-0 sm:px-6 lg:px-8">
      <Link href="/universities" className="inline-flex items-center gap-1 text-sm text-accent hover:underline mb-8">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Universities
      </Link>

      {/* Hero Photo with Blur on Scroll */}
      <div className="relative mb-8">
        <motion.div
          className="relative aspect-[664/750] max-w-[664px] mx-auto rounded-3xl overflow-hidden"
          style={{
            filter: `blur(${blurRadius}px)`
          }}
        >
          <img
            src={getImageUrl(university)}
            alt={`${university.name} campus`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-warm-bg/60 via-transparent to-transparent pointer-events-none" />
        </motion.div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
        <div>
          {/* University Title & Meta */}
          <div className="mb-8">
            <h1 className="font-display text-4xl md:text-5xl lg:text-[72px] font-bold text-ink leading-[1.1]">
              {university.name}
            </h1>
            <p className="mt-4 text-lg text-muted">
              {university.cityName || university.institutionType || 'Japan'}
              {university.ranking && <span className="ml-3 inline-flex items-center gap-1 px-2 py-1 text-xs bg-muted rounded-full">Rank #{university.ranking}</span>}
            </p>
          </div>

          {/* Programs - Expandable List */}
          <div className="card mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-semibold text-ink">Programs</h2>
              {hasMorePrograms && (
                <button
                  className="btn-ghost text-sm"
                  onClick={() => setExpandedPrograms(!expandedPrograms)}
                >
                  {expandedPrograms ? 'Show less' : `Show all ${programs.length} programs`}
                </button>
              )}
            </div>
            {programs.length > 0 ? (
              <ul className="space-y-2">
                {displayPrograms.map((program, index) => (
                  <li key={index} className="flex items-center gap-3 text-muted">
                    <svg className="w-5 h-5 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span className="text-sm">{program}</span>
                  </li>
                ))}
                {!expandedPrograms && hasMorePrograms && (
                  <li className="flex items-center gap-3 text-muted">
                    <svg className="w-5 h-5 text-muted flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="text-sm">and {programs.length - 8} more programs...</span>
                  </li>
                )}
              </ul>
            ) : (
              <p className="text-muted">Program details are not listed yet.</p>
            )}
          </div>

          {/* Faculties - Collapsible Block */}
          <div className="card mb-8">
            <button
              className="w-full flex items-center justify-between p-4"
              onClick={() => setExpandedFaculties(!expandedFaculties)}
            >
              <h2 className="font-display text-xl font-semibold text-ink">Faculties & Departments</h2>
              <svg
                className={`w-5 h-5 text-muted transition-transform ${expandedFaculties ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: expandedFaculties ? 'auto' : 0, opacity: expandedFaculties ? 1 : 0 }}
              className="overflow-hidden"
              style={{ transition: 'height 0.3s ease, opacity 0.2s ease' }}
            >
              <div className="px-4 pb-4 border-t border-border">
                {faculties.length > 0 ? (
                  <ul className="space-y-2">
                    {faculties.map((faculty, index) => (
                      <li key={index} className="flex items-center gap-3 text-muted">
                        <svg className="w-5 h-5 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span className="text-sm">{faculty}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="py-4 text-muted">Faculty information is not listed yet.</p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Official Links */}
          <div className="card mb-8">
            <h2 className="font-display text-xl font-semibold text-ink mb-4">Official sources</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <a
                href={`https://www.studyinjapan.go.jp/en/`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                <span>Study in Japan</span>
                <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              {university.sourceUrl ? (
                <a
                  href={university.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  <span>University website</span>
                  <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ) : (
                <div className="btn-secondary flex items-center gap-2 text-muted cursor-default">
                  <svg className="w-5 h-5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  <span>University website</span>
                  <span className="text-xs">(not available)</span>
                </div>
              )}
            </div>
            <p className="mt-4 text-sm text-muted">
              ℹ️ Catalog data should be verified with the respective university or official source before making decisions.
            </p>
          </div>

          {/* Reviews */}
          <div className="card">
            <h2 className="font-display text-xl font-semibold text-ink mb-4">Reviews ({reviews.length})</h2>
            {user ? (
              <form onSubmit={submitReview} className="mb-6 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">Rating</label>
                  <select className="input-field" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}>
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <option key={rating} value={rating}>{rating} stars</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">Your experience</label>
                  <textarea className="input-field" rows={3} maxLength={2000} value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} placeholder="Share your experience..." />
                </div>
                <button className="btn-primary" disabled={pending}>{pending ? 'Submitting...' : 'Submit review'}</button>
              </form>
            ) : (
              <p className="mb-6 text-sm text-muted">Sign in to leave a review.</p>
            )}
            {reviews.length ? (
              <div className="space-y-4 border-t border-border pt-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border-t border-border pt-4 first:border-0 first:pt-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-ink">{review.userName}</span>
                      <span className="text-accent">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                    </div>
                    {review.comment && <p className="mt-2 text-sm text-muted">{review.comment}</p>}
                    {user?.fullName === review.userName && (
                      <button className="mt-2 text-sm text-accent hover:underline" onClick={() => void removeReview(review.id)}>
                        Delete review
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted">No reviews yet.</p>
            )}
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
            <dl className="space-y-4 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Type</dt>
                <dd className="text-ink text-right">{university.institutionType || '—'}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Degree</dt>
                <dd className="text-ink text-right">{university.degree || '—'}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Intake</dt>
                <dd className="text-ink">{university.intake || '—'}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Instruction</dt>
                <dd className="text-ink text-right">{university.mediumOfInstruction || '—'}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Pre-arrival</dt>
                <dd className="text-ink">{university.preArrivalAdmission || '—'}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </section>
  )
}