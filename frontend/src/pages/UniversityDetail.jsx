import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import SEO from '../components/SEO'
import LoadingSpinner from '../components/LoadingSpinner'
import ScrollReveal from '../components/ScrollReveal'
import { universityApi, favoriteApi } from '../api/services'
import { useAuth } from '../context/AuthContext'
import { getUniversityImage, getUniversityImageFallback } from '../utils/universityImages'

function DetailBackdrop({ src, alt }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let frame = 0

    const updateProgress = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight
        const next = scrollable > 0 ? window.scrollY / scrollable : 0
        setProgress(Math.min(1, Math.max(0, next)))
      })
    }

    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink-950">
      <img
        src={src}
        alt={alt}
        className="absolute inset-x-[-4%] top-[-7%] h-[114%] w-[108%] object-cover object-center transition-[filter,transform] duration-500 ease-out"
        style={{
          filter: `blur(${progress * 10}px) saturate(${1.08 - progress * 0.22})`,
          transform: `translate3d(0, ${progress * -56}px, 0) scale(${1.05 + progress * 0.05})`,
        }}
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,7,16,0.22),rgba(5,7,16,0.44)_42%,rgba(5,7,16,0.86)_100%),linear-gradient(90deg,rgba(5,7,16,0.34),rgba(5,7,16,0.10)_48%,rgba(5,7,16,0.34))]"
        style={{ opacity: 0.92 + progress * 0.2 }}
      />
    </div>
  )
}

export default function UniversityDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const [uni, setUni] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' })
  const [error, setError] = useState('')
  const [imgSrc, setImgSrc] = useState('')

  useEffect(() => {
    setLoading(true)
    Promise.all([universityApi.getById(id), universityApi.getReviews(id)])
      .then(([uRes, rRes]) => {
        setUni(uRes.data)
        setImgSrc(getUniversityImage(uRes.data))
        setReviews(rRes.data)
      })
      .catch(() => setError('University not found'))
      .finally(() => setLoading(false))
  }, [id])

  const toggleFavorite = async () => {
    if (!user) return
    try {
      if (uni.favorited) await favoriteApi.remove(uni.id)
      else await favoriteApi.add(uni.id)
      setUni({ ...uni, favorited: !uni.favorited })
    } catch { /* ignore */ }
  }

  const submitReview = async (e) => {
    e.preventDefault()
    if (!user) return
    try {
      await universityApi.addReview(id, reviewForm)
      setReviewForm({ rating: 5, comment: '' })
      const rRes = await universityApi.getReviews(id)
      setReviews(rRes.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review')
    }
  }

  if (loading) return <LoadingSpinner fullScreen />
  if (!uni) return <div className="py-20 text-center">{error || 'Not found'}</div>

  return (
    <>
      <SEO title={uni.name} description={uni.description?.slice(0, 160)} />
      <DetailBackdrop src={imgSrc || getUniversityImage(uni)} alt={uni.name} />
      <img
        src={imgSrc || getUniversityImage(uni)}
        alt=""
        className="hidden"
        onError={() => setImgSrc(getUniversityImageFallback(uni.name))}
      />
      <div className="relative min-h-[48vh] md:min-h-[56vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-ink-950/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 pb-10 md:pb-12 text-white">
          <Link to="/universities" className="text-sm text-white/70 hover:text-white">← Universities</Link>
          <h1 className="font-display text-4xl md:text-6xl font-bold mt-2 drop-shadow-[0_4px_24px_rgba(0,0,0,0.55)]">{uni.name}</h1>
          <p className="text-white/80">{uni.cityName} · Rank #{uni.ranking}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <ScrollReveal>
            <div className="glass-card">
              <h2 className="font-display text-xl font-semibold mb-4">About</h2>
              <p className="text-ink-800/80 dark:text-ink-50/80 leading-relaxed">{uni.description}</p>
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <div className="glass-card">
              <h2 className="font-display text-xl font-semibold mb-4">Programs</h2>
              <p className="text-ink-800/80 dark:text-ink-50/80">{uni.programs}</p>
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <div className="glass-card">
              <h2 className="font-display text-xl font-semibold mb-4">Dormitory</h2>
              <p className="text-ink-800/80 dark:text-ink-50/80">{uni.dormitoryInfo}</p>
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <div className="glass-card">
              <h2 className="font-display text-xl font-semibold mb-4">Reviews ({reviews.length})</h2>
              {user && (
                <form onSubmit={submitReview} className="mb-6 space-y-3">
                  <select className="input-field" value={reviewForm.rating} onChange={(e) => setReviewForm({ ...reviewForm, rating: +e.target.value })}>
                    {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} stars</option>)}
                  </select>
                  <textarea className="input-field" rows={3} placeholder="Your experience..." value={reviewForm.comment} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })} />
                  <button type="submit" className="btn-primary">Submit review</button>
                </form>
              )}
              <div className="space-y-4">
                {reviews.map((r) => (
                  <div key={r.id} className="border-t border-white/10 pt-4">
                    <div className="flex justify-between">
                      <span className="font-medium">{r.userName}</span>
                      <span>{'★'.repeat(r.rating)}</span>
                    </div>
                    {r.comment && <p className="text-sm mt-2 text-ink-800/70 dark:text-ink-50/70">{r.comment}</p>}
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>

        <div className="space-y-6">
          <ScrollReveal>
            <div className="glass-card sticky top-24">
              {user && (
                <button type="button" onClick={toggleFavorite} className="btn-secondary w-full mb-4">
                  {uni.favorited ? '❤️ Saved' : '🤍 Save to favorites'}
                </button>
              )}
              {uni.websiteUrl && (
                <a href={uni.websiteUrl} target="_blank" rel="noreferrer" className="btn-primary w-full block text-center mb-6">Official website</a>
              )}
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between"><dt className="text-ink-800/60">Tuition/year</dt><dd className="font-medium">¥{Number(uni.tuitionFeeYearly).toLocaleString()}</dd></div>
                <div className="flex justify-between"><dt>IELTS</dt><dd>{uni.ieltsRequirement || '—'}</dd></div>
                <div className="flex justify-between"><dt>TOEFL</dt><dd>{uni.toeflRequirement || '—'}</dd></div>
                <div className="flex justify-between"><dt>JLPT</dt><dd>{uni.jlptRequirement || '—'}</dd></div>
                <div className="flex justify-between"><dt>Acceptance</dt><dd>{uni.acceptanceRate}%</dd></div>
                {uni.costOfLivingMonthly && (
                  <div className="flex justify-between"><dt>Living cost/mo</dt><dd>¥{uni.costOfLivingMonthly.toLocaleString()}</dd></div>
                )}
              </dl>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </>
  )
}
