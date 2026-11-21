// Build trigger
'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useAuth } from '@/components/auth-provider'
import { ErrorState, LoadingState } from '@/components/public-states'
import { addFavorite, createReview, deleteReview, getReviews, getUniversity, removeFavorite, type University } from '@/lib/web-api'

type Review = { id: number; rating: number; comment: string | null; userName: string }

function splitCatalogItems(value: string | null) {
  if (!value) return []
  return [...new Map(value.split('|').map((item) => item.trim()).filter(Boolean).map((item) => [item.toLocaleLowerCase(), item])).values()]
}

export default function DetailContent({ id }: { id: string }) {
  const { user } = useAuth()
  const [university, setUniversity] = useState<University | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [error, setError] = useState('')
  const [form, setForm] = useState({ rating: 5, comment: '' })
  const [pending, setPending] = useState(false)
  const [showAllPrograms, setShowAllPrograms] = useState(false)

  useEffect(() => {
    Promise.all([getUniversity(id), getReviews(id)])
      .then(([item, items]) => { setUniversity(item); setReviews(items); setShowAllPrograms(false) })
      .catch((reason) => setError(reason.message))
  }, [id])

  if (error) return <div className="mx-auto max-w-7xl px-4 py-16"><ErrorState message={error} /></div>
  if (!university) return <div className="mx-auto max-w-7xl px-4 py-16"><LoadingState /></div>

  const programs = splitCatalogItems(university.programs)
  const faculties = splitCatalogItems(university.faculty)
  const visiblePrograms = showAllPrograms ? programs : programs.slice(0, 8)

  async function toggleFavorite() {
    if (!university) return
    setPending(true)
    try {
      if (university.favorited) await removeFavorite(university.id)
      else await addFavorite(university.id)
      setUniversity({ ...university, favorited: !university.favorited })
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Could not update favorite') }
    finally { setPending(false) }
  }

  async function submitReview(event: React.FormEvent) {
    event.preventDefault(); setPending(true)
    try { await createReview(id, form); setReviews(await getReviews(id)); setForm({ rating: 5, comment: '' }) }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Could not create review') }
    finally { setPending(false) }
  }

  async function removeReview(reviewId: number) {
    try { await deleteReview(reviewId); setReviews(await getReviews(id)) }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Could not delete review') }
  }

  return <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <Link href="/universities" className="text-sm text-sakura-500">← Universities</Link>
    <div className="mt-4 grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
      <div>
        <h1 className="font-display text-4xl font-bold md:text-5xl">{university.name}</h1>
        <p className="mt-2 text-ink-800/60 dark:text-ink-50/60">{university.cityName || university.institutionType || 'Japan'} {university.ranking ? `· Rank #${university.ranking}` : ''}</p>
        <div className="mt-8 space-y-6">
          <div className="glass-card">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-display text-xl font-semibold">Programs</h2>
              {programs.length > 0 && <span className="text-sm text-ink-800/60 dark:text-ink-50/60">{programs.length} listed</span>}
            </div>
            {programs.length ? <ul className="mt-4 grid gap-x-8 gap-y-2 text-sm leading-relaxed text-ink-800/75 dark:text-ink-50/75 sm:grid-cols-2">
              {visiblePrograms.map((program, index) => <li key={`${index}-${program}`} className="border-b border-white/5 pb-2">{program}</li>)}
            </ul> : <p className="mt-3 text-sm text-ink-800/70 dark:text-ink-50/70">Program details are not listed yet.</p>}
            {programs.length > 8 && <button type="button" className="mt-4 text-sm font-medium text-sakura-500 hover:underline" aria-expanded={showAllPrograms} onClick={() => setShowAllPrograms((shown) => !shown)}>{showAllPrograms ? 'Show fewer programs' : `Show all ${programs.length} programs`}</button>}
          </div>
          {faculties.length > 0 && <details className="glass-card group">
            <summary className="cursor-pointer list-none font-display text-xl font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sakura-500">Faculties and departments <span className="ml-2 text-sm font-normal text-ink-800/60 dark:text-ink-50/60">({faculties.length})</span><span className="float-right text-sm text-sakura-500 group-open:rotate-180">⌄</span></summary>
            <ul className="mt-4 grid gap-x-8 gap-y-2 text-sm leading-relaxed text-ink-800/75 dark:text-ink-50/75 sm:grid-cols-2">
              {faculties.map((faculty, index) => <li key={`${index}-${faculty}`} className="border-b border-white/5 pb-2">{faculty}</li>)}
            </ul>
          </details>}
          <div className="glass-card">
            <h2 className="font-display text-xl font-semibold">Official source</h2>
            <p className="mt-2 text-sm text-ink-800/70 dark:text-ink-50/70">This listing is based on the Study in Japan school search. Information is supplied by schools and may not include every institution; confirm current details directly with the university.</p>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium">
              <a className="text-sakura-500 hover:underline" href={`https://www.studyinjapan.go.jp/en/search-for-schools/school_search.php?lang=en&offset=0&go=go&narabikae=2&limit=25&school_name=${encodeURIComponent(university.name)}`} target="_blank" rel="noreferrer">View in Study in Japan catalog <span aria-hidden="true">↗</span></a>
              {university.sourceUrl && <a className="text-sakura-500 hover:underline" href={university.sourceUrl} target="_blank" rel="noreferrer">University website <span aria-hidden="true">↗</span></a>}
            </div>
          </div>
          <div className="glass-card">
            <h2 className="font-display text-xl font-semibold">Reviews ({reviews.length})</h2>
            {user ? <form onSubmit={submitReview} className="mb-6 mt-4 space-y-3"><select className="input-field" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}>{[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} stars</option>)}</select><textarea className="input-field" rows={3} maxLength={2000} value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} placeholder="Your experience..." /><button className="btn-primary" disabled={pending}>{pending ? 'Submitting...' : 'Submit review'}</button></form> : <p className="mt-3 text-sm text-ink-800/60 dark:text-ink-50/60">Sign in to leave a review.</p>}
            {reviews.length ? <div className="space-y-4">{reviews.map((review) => <div key={review.id} className="border-t border-white/10 pt-4"><div className="flex justify-between"><span>{review.userName}</span><span>{'★'.repeat(review.rating)}</span></div>{review.comment && <p className="mt-2 text-sm text-ink-800/70 dark:text-ink-50/70">{review.comment}</p>}{user?.fullName === review.userName && <button className="mt-2 text-xs text-red-500" onClick={() => void removeReview(review.id)}>Delete review</button>}</div>)}</div> : <p className="mt-3 text-sm text-ink-800/60 dark:text-ink-50/60">No reviews yet.</p>}
          </div>
        </div>
      </div>
      <aside><div className="glass-card sticky top-24">{user && <button className="btn-secondary mb-5 w-full" disabled={pending} onClick={() => void toggleFavorite()}>{university.favorited ? '❤️ Saved' : '🤍 Save to favorites'}</button>}<dl className="space-y-3 text-sm"><div className="flex justify-between gap-4"><dt>Type</dt><dd>{university.institutionType || '—'}</dd></div><div className="flex justify-between gap-4"><dt>Degree</dt><dd className="text-right">{university.degree || '—'}</dd></div><div className="flex justify-between gap-4"><dt>Intake</dt><dd>{university.intake || '—'}</dd></div><div className="flex justify-between gap-4"><dt>Instruction</dt><dd className="text-right">{university.mediumOfInstruction || '—'}</dd></div><div className="flex justify-between gap-4"><dt>Pre-arrival</dt><dd>{university.preArrivalAdmission || '—'}</dd></div></dl></div></aside>
    </div>
  </section>
}
 
