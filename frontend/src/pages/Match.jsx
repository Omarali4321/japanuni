import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import Hero from '../components/Hero'
import LoadingSpinner from '../components/LoadingSpinner'
import ScrollReveal from '../components/ScrollReveal'
import { cityApi, universityApi } from '../api/services'

const initialForm = {
  field: 'Computer Science',
  budgetYearly: '700000',
  ieltsScore: '6.5',
  jlptLevel: '',
  cityId: '',
}

export default function Match() {
  const [form, setForm] = useState(initialForm)
  const [cities, setCities] = useState([])
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    cityApi.list().then((res) => setCities(res.data)).catch(() => {})
  }, [])

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const payload = {
        field: form.field,
        budgetYearly: form.budgetYearly ? Number(form.budgetYearly) : null,
        ieltsScore: form.ieltsScore ? Number(form.ieltsScore) : null,
        jlptLevel: form.jlptLevel || null,
        cityId: form.cityId ? Number(form.cityId) : null,
      }
      const { data } = await universityApi.match(payload)
      setResults(data)
    } catch {
      setError('Could not calculate matches. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SEO title="Smart Match" description="Find Japanese universities that fit your budget, language scores, and study goals." />
      <Hero
        title="Find your best-fit university"
        subtitle="Enter your goals and get ranked matches from JapanUni's university database."
        badge="Smart Match"
        cta={null}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 items-start">
          <ScrollReveal>
            <form onSubmit={submit} className="glass-card space-y-5">
              <div>
                <h2 className="font-display text-2xl font-semibold">Your profile</h2>
                <p className="mt-2 text-sm text-ink-800/60 dark:text-ink-50/60">
                  This matcher uses rules from the current database. It does not call paid AI APIs.
                </p>
              </div>

              <label className="block">
                <span className="text-sm font-medium">Study interest</span>
                <input
                  className="input-field mt-2"
                  value={form.field}
                  onChange={(e) => update('field', e.target.value)}
                  placeholder="Computer Science, Business, Medicine..."
                />
              </label>

              <div className="grid sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm font-medium">Yearly tuition budget (¥)</span>
                  <input
                    type="number"
                    min="0"
                    className="input-field mt-2"
                    value={form.budgetYearly}
                    onChange={(e) => update('budgetYearly', e.target.value)}
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium">IELTS score</span>
                  <input
                    type="number"
                    min="0"
                    max="9"
                    step="0.5"
                    className="input-field mt-2"
                    value={form.ieltsScore}
                    onChange={(e) => update('ieltsScore', e.target.value)}
                  />
                </label>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm font-medium">JLPT level</span>
                  <select className="input-field mt-2" value={form.jlptLevel} onChange={(e) => update('jlptLevel', e.target.value)}>
                    <option value="">Not sure</option>
                    <option value="N1">N1</option>
                    <option value="N2">N2</option>
                    <option value="N3">N3</option>
                    <option value="N4">N4</option>
                    <option value="N5">N5</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-sm font-medium">Preferred city</span>
                  <select className="input-field mt-2" value={form.cityId} onChange={(e) => update('cityId', e.target.value)}>
                    <option value="">Any city</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>{city.name}</option>
                    ))}
                  </select>
                </label>
              </div>

              <button type="submit" className="btn-primary w-full" disabled={loading}>
                {loading ? 'Matching...' : 'Find matches'}
              </button>
            </form>
          </ScrollReveal>

          <section className="space-y-4">
            {error && <p className="glass-card text-red-500 dark:text-red-400">{error}</p>}
            {loading ? (
              <LoadingSpinner />
            ) : results.length > 0 ? (
              results.map((result, index) => (
                <ScrollReveal key={result.university.id} delay={index * 0.05}>
                  <article className="glass-card">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-sakura-500 font-semibold">
                          {result.fitLevel}
                        </p>
                        <h3 className="font-display text-xl font-semibold mt-2">{result.university.name}</h3>
                        <p className="text-sm text-ink-800/60 dark:text-ink-50/60 mt-1">
                          {result.university.cityName} · Rank #{result.university.ranking}
                        </p>
                      </div>
                      <div className="shrink-0">
                        <div className="h-16 w-16 rounded-2xl bg-sakura-500/10 border border-sakura-500/20 grid place-items-center">
                          <span className="font-display text-2xl font-bold text-sakura-500">{result.score}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-semibold mb-2">Why it fits</h4>
                        <ul className="space-y-2 text-ink-800/70 dark:text-ink-50/70">
                          {result.reasons.length > 0 ? result.reasons.map((reason) => (
                            <li key={reason}>• {reason}</li>
                          )) : <li>• Balanced option based on your profile.</li>}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Watch points</h4>
                        <ul className="space-y-2 text-ink-800/60 dark:text-ink-50/60">
                          {result.gaps.length > 0 ? result.gaps.map((gap) => (
                            <li key={gap}>• {gap}</li>
                          )) : <li>• No major gaps found from listed data.</li>}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2 text-xs">
                      <span className="px-2 py-1 rounded-md glass">¥{Number(result.university.tuitionFeeYearly).toLocaleString()}/year</span>
                      <span className="px-2 py-1 rounded-md glass">IELTS {result.university.ieltsRequirement}</span>
                      <span className="px-2 py-1 rounded-md glass">JLPT {result.university.jlptRequirement}</span>
                    </div>

                    <Link to={`/universities/${result.university.id}`} className="btn-secondary mt-5">
                      View university
                    </Link>
                  </article>
                </ScrollReveal>
              ))
            ) : (
              <ScrollReveal>
                <div className="glass-card">
                  <h2 className="font-display text-2xl font-semibold">Your matches will appear here</h2>
                  <p className="mt-2 text-ink-800/60 dark:text-ink-50/60">
                    Try the default profile or adjust it to your real goals.
                  </p>
                </div>
              </ScrollReveal>
            )}
          </section>
        </div>
      </main>
    </>
  )
}
