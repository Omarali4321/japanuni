'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useAuth } from '@/components/auth-provider'
import { ErrorState, LoadingState } from '@/components/public-states'
import { addFavorite, createReview, deleteReview, getReviews, getUniversity, removeFavorite, type University } from '@/lib/web-api'

type Review = { id: number; rating: number; comment: string | null; userName: string }

export default function DetailContent({ id }: { id: string }) {
  const { user } = useAuth()
  const [university, setUniversity] = useState<University | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [error, setError] = useState('')
  const [form, setForm] = useState({ rating: 5, comment: '' })
  const [pending, setPending] = useState(false)

  useEffect(() => {
    Promise.all([getUniversity(id), getReviews(id)])
      .then(([item, items]) => { setUniversity(item); setReviews(items) })
      .catch((reason) => setError(reason.message))
  }, [id])

  if (error) return <div className="mx-auto max-w-7xl px-4 py-16"><ErrorState message={error} /></div>
  if (!university) return <div className="mx-auto max-w-7xl px-4 py-16"><LoadingState /></div>

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
          <div className="glass-card"><h2 className="font-display text-xl font-semibold">Programs</h2><p className="mt-3 whitespace-pre-wrap text-ink-800/75 dark:text-ink-50/75">{university.programs || 'Program details are not listed yet.'}</p></div>
          <div className="glass-card"><h2 className="font-display text-xl font-semibold">Source information</h2><p className="mt-3 text-sm text-ink-800/70 dark:text-ink-50/70">{university.faculty || 'Faculty information is not listed yet.'}</p>{university.sourceUrl && <a className="mt-4 inline-block text-sm text-sakura-500 hover:underline" href={university.sourceUrl} target="_blank" rel="noreferrer">Open source page</a>}</div>
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
