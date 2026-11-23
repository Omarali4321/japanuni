'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/components/auth-provider'
import { addFavorite, createReview, deleteReview, getReviews, removeFavorite, type University } from '@/lib/web-api'
import { FadeIn, SlideUp } from '@/components/ui/Motion'

type Review = { id: number; rating: number; comment: string | null; userName: string }

function splitCatalogItems(value: string | null) {
  if (!value) return []
  return [...new Map(value.split('|').map((item) => item.trim()).filter(Boolean).map((item) => [item.toLocaleLowerCase(), item])).values()]
}

function getPhotoUrl(university: University): string | null {
  return university.images?.[0] ?? null
}

function formatProgramCount(count: number) {
  if (count > 10) return `${count} listed`
  if (count > 0) return `${count} listed`
  return '—'
}

interface UniversityDetailProps {
  university: University
}

export default function UniversityDetail({ university }: UniversityDetailProps) {
  const { user } = useAuth()
  const photoUrl = getPhotoUrl(university)
  const isPlaceholder = university.imageIsPlaceholder ?? !photoUrl
  const [reviews, setReviews] = useState<Review[]>([])
  const [error, setError] = useState('')
  const [reviewsUnavailable, setReviewsUnavailable] = useState(false)
  const [form, setForm] = useState({ rating: 5, comment: '' })
  const [pending, setPending] = useState(false)
  
  const [activeTab, setActiveTab] = useState<'overview' | 'programs' | 'faculties' | 'reviews'>('overview')

  // Fetch reviews on mount
  useEffect(() => {
    getReviews(String(university.id))
      .then((items) => {
        setReviews(items)
        setReviewsUnavailable(false)
      })
      .catch(() => setReviewsUnavailable(true))
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

  const programs = splitCatalogItems(university.programs)
  const faculties = splitCatalogItems(university.faculty)

  // Stat cards data
  const stats = [
    { label: '01 / PROGRAMS', value: formatProgramCount(programs.length), desc: 'Programs listed' },
    { label: '02 / INTAKE', value: university.intake || 'April & October', desc: 'Two entry periods' },
    { label: '03 / LANGUAGES', value: university.mediumOfInstruction || 'Japanese / English', desc: 'Varies by program' },
    { label: '04 / DEGREES', value: university.degree || "Bachelor's to doctoral", desc: 'Explore available pathways' },
  ]

  return (
    <>
      {error && (
        <div role="alert" className="mx-auto max-w-7xl px-4 pt-4 text-sm text-red-700">
          {error}
        </div>
      )}
      {/* Large photo header with blur on scroll and stat cards */}
      <div className="relative w-full bg-[#fdfdfc]">
        {/* Hero Section */}
        <section className="relative pt-[96px] pb-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Back link and tagline */}
            <div className="flex items-center justify-between mb-8">
              <Link href="/universities" className="inline-flex items-center gap-1 text-xs font-medium text-[#67716a] hover:text-accent transition-colors uppercase tracking-wide">
                ← ALL UNIVERSITIES
              </Link>
              <p className="text-right text-xs font-semibold text-accent tracking-wider max-w-xs">
                YOUR NEXT CHAPTER, IN JAPAN
              </p>
            </div>

            {/* University name and description */}
            <div className="mb-8">
              <h1 className="font-['Playfair_Display'] font-normal leading-[1.1] text-[52px] md:text-[72px] lg:text-[80px] text-[#252c28] max-w-4xl">
                {university.name}.
              </h1>
              <p className="mt-4 text-lg md:text-xl text-[#252c28] max-w-3xl leading-relaxed">
                A {university.institutionType?.toLowerCase() || 'national'} university. A world of possibilities.
              </p>
            </div>

            {/* Programs description and actions */}
            <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="text-[#67716a] text-base md:text-lg leading-relaxed max-w-2xl">
                <p>Explore {programs.length} programs across undergraduate and graduate</p>
                <p>studies. Find the path that fits your ambitions.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Link
                  href="#programs"
                  className="inline-flex items-center justify-center gap-2 h-[52px] px-8 rounded-[26px] bg-accent text-white font-medium text-base transition-colors hover:bg-accent/90"
                >
                  Explore {programs.length} programs →
                </Link>
                {university.sourceUrl && (
                  <a
                    href={university.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 h-[52px] px-8 rounded-[26px] border border-[#e0e5df] text-[#252c28] font-medium text-base transition-colors hover:bg-[#f5f7f3]"
                  >
                    University website ↗
                  </a>
                )}
              </div>
            </div>

            {/* Campus photo with rounded corners */}
            <div className="relative overflow-hidden rounded-bl-[20px] rounded-br-[100px] rounded-tl-[20px] rounded-tr-[20px] aspect-[1440/390] max-h-[420px]">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: photoUrl ? `url(${photoUrl})` : undefined,
                  backgroundColor: photoUrl ? undefined : '#f3eee8',
                }}
                aria-hidden="true"
              >
                {isPlaceholder && (
                  <div className="flex h-full items-center justify-center bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#f8e6df] via-[#f3eee8] to-[#e8ece5] px-6 text-center">
                    <div>
                      <p className="font-['Playfair_Display'] text-3xl text-[#343c36] md:text-5xl">{university.name}</p>
                      <p className="mt-3 text-[10px] font-medium uppercase tracking-[0.22em] text-[#748078]">Campus photo coming soon</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Badge and note */}
            <div className="mt-4 flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-[20px] bg-[#fdfdfc] border border-[#e0e5df]">
                <span className="text-xs font-medium text-[#252c28]">
                  JAPAN / {university.institutionType?.toUpperCase() || 'NATIONAL'} UNIVERSITY
                </span>
              </div>
              {!isPlaceholder && university.imageSourceUrl ? (
                <a href={university.imageSourceUrl} target="_blank" rel="noreferrer" className="text-right text-xs text-[#67716a] underline underline-offset-2 hover:text-accent">
                  {university.imageIsIllustrative ? 'Illustrative campus photo' : 'Campus photo'}
                  {university.imageAttribution ? ` · ${university.imageAttribution}` : ''}
                  {university.imageLicense ? ` · ${university.imageLicense}` : ''}
                  {' · Wikimedia Commons'}
                </a>
              ) : (
                <p className="text-xs text-[#67716a]">Campus photo coming soon</p>
              )}
            </div>

            {/* Stat Cards */}
            <div className="mt-8 grid gap-4 md:grid-cols-4">
              {stats.map((stat, index) => (
                <div key={index} className="p-4">
                  <p className="text-xs font-semibold text-[#67716a] uppercase tracking-wide">{stat.label}</p>
                  <p className="mt-1 font-['Playfair_Display'] text-[32px] md:text-[36px] text-[#252c28]">{stat.value}</p>
                  <p className="mt-2 text-sm text-[#67716a]">{stat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <section className="border-t border-[#d7d8d0] border-b border-[#d7d8d0] bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <p className="text-xs font-semibold text-[#67716a] uppercase tracking-wide">EXPLORE THE UNIVERSITY</p>
              <div className="flex gap-6" role="tablist" aria-label="University sections">
                {[
                  { id: 'overview', label: 'Overview', count: null },
                  { id: 'programs', label: 'Programs', count: programs.length },
                  { id: 'faculties', label: 'Faculties', count: faculties.length },
                  { id: 'reviews', label: 'Reviews', count: reviews.length }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    aria-controls={`panel-${tab.id}`}
                    id={`tab-${tab.id}`}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`relative px-2 py-3 text-sm font-medium transition-colors flex items-center gap-2 ${
                      activeTab === tab.id ? 'text-accent' : 'text-[#67716a] hover:text-[#252c28]'
                    }`}
                  >
                    {tab.label}
                    {tab.count !== null && (
                      <span className="text-xs text-[#67716a]">({tab.count})</span>
                    )}
                    {activeTab === tab.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
            <div>
              {/* Tab Panels with AnimatePresence */}
              <AnimatePresence mode="wait">
                {/* Overview Tab - Summary only */}
                {activeTab === 'overview' && (
                  <motion.div
                    key="overview"
                    id="panel-overview"
                    role="tabpanel"
                    aria-labelledby="tab-overview"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-8"
                  >
                    {/* Quick Academic Summary */}
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="bg-[#f5f7f3] rounded-[14px] p-6">
                        <h3 className="font-medium text-[#252c28] text-base mb-3">Programs offered</h3>
                        <p className="font-['Playfair_Display'] font-normal text-4xl text-[#252c28]">{programs.length}</p>
                        <p className="mt-1 text-sm text-[#67716a]">Academic programs across all levels</p>
                      </div>
                      <div className="bg-[#f5f7f3] rounded-[14px] p-6">
                        <h3 className="font-medium text-[#252c28] text-base mb-3">Faculties & departments</h3>
                        <p className="font-['Playfair_Display'] font-normal text-4xl text-[#252c28]">{faculties.length}</p>
                        <p className="mt-1 text-sm text-[#67716a]">Academic units and departments</p>
                      </div>
                    </div>

                    {/* Featured Programs Preview */}
                    {programs.length > 0 && (
                      <div>
                        <div className="flex items-baseline justify-between gap-2 mb-4">
                          <h2 className="font-['Playfair_Display'] font-normal text-2xl text-[#252c28]">Featured programs</h2>
                          <button
                            type="button"
                            onClick={() => setActiveTab('programs')}
                            className="text-sm text-accent hover:underline font-medium"
                          >
                            View all {programs.length} →
                          </button>
                        </div>
                        <ul className="space-y-2">
                          {programs.slice(0, 5).map((program, index) => (
                            <li key={`${index}-${program}`} className="text-base text-[#252c28] border-b border-[#e0e5df] pb-3 last:border-0">
                              {program}
                            </li>
                          ))}
                        </ul>
                        {programs.length > 5 && (
                          <p className="mt-2 text-sm text-[#67716a]">+{programs.length - 5} more programs</p>
                        )}
                      </div>
                    )}

                    {/* Featured Faculties Preview */}
                    {faculties.length > 0 && (
                      <div className="border-t border-[#e0e5df] pt-8">
                        <div className="flex items-baseline justify-between gap-2 mb-4">
                          <h3 className="font-medium text-[#252c28] text-base">Featured faculties</h3>
                          <button
                            type="button"
                            onClick={() => setActiveTab('faculties')}
                            className="text-sm text-accent hover:underline font-medium"
                          >
                            View all {faculties.length} →
                          </button>
                        </div>
                        <div className="bg-[#f5f7f3] rounded-[14px] p-4">
                          <ul className="space-y-2">
                            {faculties.slice(0, 5).map((faculty, index) => (
                              <li key={`${index}-${faculty}`} className="text-sm text-[#252c28]">{faculty}</li>
                            ))}
                          </ul>
                          {faculties.length > 5 && (
                            <p className="mt-2 text-sm text-[#67716a]">+{faculties.length - 5} more faculties</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Degree Options */}
                    <div className="border-t border-[#e0e5df] pt-8">
                      <h3 className="font-semibold text-[13px] text-[#252c28] tracking-wide uppercase">Degree options</h3>
                      <div className="mt-4 text-sm text-[#67716a] leading-relaxed">
                        <p>{university.degree || "Bachelor's Degree · Master's Degree · Doctoral Degree"}</p>
                        {university.degree && university.degree.includes('Professional') && (
                          <p>Master of Education (Professional Degree)</p>
                        )}
                      </div>
                    </div>

                    {/* Intake & Language Summary */}
                    <div className="border-t border-[#e0e5df] pt-8 grid gap-4 sm:grid-cols-2">
                      <div className="bg-[#f5f7f3] rounded-[14px] p-4">
                        <h4 className="font-semibold text-[13px] text-[#252c28] tracking-wide uppercase mb-2">Main intake</h4>
                        <p className="text-sm text-[#67716a]">{university.intake || 'April'}</p>
                      </div>
                      <div className="bg-[#f5f7f3] rounded-[14px] p-4">
                        <h4 className="font-semibold text-[13px] text-[#252c28] tracking-wide uppercase mb-2">Medium of instruction</h4>
                        <p className="text-sm text-[#67716a]">{university.mediumOfInstruction || 'Japanese'}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Programs Tab */}
                {activeTab === 'programs' && (
                  <motion.div
                    key="programs"
                    id="panel-programs"
                    role="tabpanel"
                    aria-labelledby="tab-programs"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <h2 className="font-['Playfair_Display'] font-normal text-3xl text-[#252c28]">Programs</h2>
                      <p className="text-sm text-[#67716a]">{programs.length} listed</p>
                    </div>
                    <div className="space-y-2">
                      {programs.length > 0 ? (
                        programs.map((program, index) => (
                          <div key={`${index}-${program}`} className="text-base text-[#252c28] border-b border-[#e0e5df] pb-3 last:border-0">
                            {program}
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-[#67716a] py-8 text-center">No programs listed for this university.</p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Faculties Tab */}
                {activeTab === 'faculties' && (
                  <motion.div
                    key="faculties"
                    id="panel-faculties"
                    role="tabpanel"
                    aria-labelledby="tab-faculties"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <h2 className="font-['Playfair_Display'] font-normal text-3xl text-[#252c28]">Faculties & Departments</h2>
                      <p className="text-sm text-[#67716a]">{faculties.length} listed</p>
                    </div>
                    <div className="space-y-2">
                      {faculties.length > 0 ? (
                        faculties.map((faculty, index) => (
                          <div key={`${index}-${faculty}`} className="text-sm text-[#252c28] border-b border-[#e0e5df] pb-3 last:border-0">
                            {faculty}
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-[#67716a] py-8 text-center">No faculties listed for this university.</p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                  <motion.div
                    key="reviews"
                    id="panel-reviews"
                    role="tabpanel"
                    aria-labelledby="tab-reviews"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <h2 className="font-['Playfair_Display'] font-normal text-3xl text-[#252c28]">Reviews</h2>
                      <p className="text-sm text-[#67716a]">{reviews.length} reviews</p>
                    </div>
                    <div className="space-y-4">
                      {user ? (
                        <form onSubmit={submitReview} className="mb-6 p-4 bg-[#f5f7f3] rounded-[14px] space-y-3">
                          <div className="flex items-center gap-4">
                            <label className="text-sm font-medium text-[#252c28]">Rating</label>
                            <select className="input-field w-auto" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}>
                              {[5, 4, 3, 2, 1].map((rating) => (
                                <option key={rating} value={rating}>{rating} stars</option>
                              ))}
                            </select>
                          </div>
                          <textarea className="input-field w-full" rows={3} maxLength={2000} value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} placeholder="Your experience..." />
                          <button className="btn-primary" disabled={pending}>{pending ? 'Submitting...' : 'Submit review'}</button>
                        </form>
                      ) : (
                        <p className="text-sm text-[#67716a]">Sign in to leave a review.</p>
                      )}
                      {reviewsUnavailable ? (
                        <p role="status" className="mt-3 text-sm text-[#67716a]">Reviews are temporarily unavailable. The university information is still available.</p>
                      ) : reviews.length ? (
                        reviews.map((review) => (
                          <div key={review.id} className="border-t border-[#e0e5df] pt-4">
                            <div className="flex justify-between">
                              <span className="font-medium text-[#252c28]">{review.userName}</span>
                              <span className="text-accent">{'★'.repeat(review.rating)}</span>
                            </div>
                            {review.comment && <p className="mt-2 text-sm text-[#67716a]">{review.comment}</p>}
                            {user?.fullName === review.userName && (
                              <button className="mt-2 text-xs text-red-500" onClick={() => void removeReview(review.id)}>
                                Delete review
                              </button>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="mt-3 text-sm text-[#67716a]">No reviews yet.</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sidebar - Official Source & Reviews */}
            <aside>
              <div className="sticky top-[120px] space-y-6">
                {/* Official Source Panel */}
                <div className="bg-[#f5f7f3] rounded-[20px] p-6">
                  <h3 className="font-['Playfair_Display'] font-normal text-2xl text-[#252c28]">Official source</h3>
                  <p className="mt-4 text-sm text-[#67716a] leading-relaxed">
                    This listing is based on the Study in Japan school search. Information is supplied by schools and may not include every institution; confirm current details directly with the university.
                  </p>
                  <div className="mt-6 space-y-3">
                    <a
                      href={`https://www.studyinjapan.go.jp/en/search-for-schools/school_search.php?lang=en&offset=0&go=go&narabikae=2&limit=25&school_name=${encodeURIComponent(university.name)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
                    >
                      View in Study in Japan catalog ↗
                    </a>
                    {university.sourceUrl && (
                      <a
                        href={university.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-sm font-medium text-[#252c28] hover:underline"
                      >
                        University website ↗
                      </a>
                    )}
                  </div>
                </div>

                {/* Reviews Panel */}
                <div className="border border-[#e0e5df] rounded-[20px] p-6">
                  <h3 className="font-['Playfair_Display'] font-normal text-2xl text-[#252c28]">Reviews ({reviews.length})</h3>
                  {reviewsUnavailable ? (
                    <p className="mt-4 text-sm text-[#67716a]">Reviews are temporarily unavailable.</p>
                  ) : reviews.length > 0 ? (
                    <p className="mt-4 text-sm text-[#67716a]">Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}.</p>
                  ) : (
                    <p className="mt-4 text-sm text-[#67716a]">No reviews yet.</p>
                  )}
                  {user ? (
                    <a
                      href="#reviews"
                      className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
                    >
                      Sign in to leave a review ↗
                    </a>
                  ) : (
                    <p className="mt-6 text-xs text-[#67716a]">Pre-arrival admission information available on the university website.</p>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </>
  )
}
