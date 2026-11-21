'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ErrorState } from '@/components/public-states'
import { listContent } from '@/lib/web-api'
import { FadeIn, SlideUp, StaggerContainer, StaggerItem, HoverLift } from '@/components/ui/Motion'
import { MatchResultSkeleton } from '@/components/ui/Skeleton'

type MatchResult = {
  university: { id: number; name: string; cityName: string | null; ranking: number | null; tuitionFeeYearly: string | null; ieltsRequirement: number | null; jlptRequirement: string | null }
  score: number
  fitLevel: string
  reasons: string[]
  gaps: string[]
}

export default function MatchContent() {
  const [results, setResults] = useState<MatchResult[]>([])
  const [form, setForm] = useState({ field: '', budgetYearly: '', ieltsScore: '', jlptLevel: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    if (!form.field.trim()) return
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/universities/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          field: form.field,
          budgetYearly: Number(form.budgetYearly) || null,
          ieltsScore: Number(form.ieltsScore) || null,
          jlptLevel: form.jlptLevel || null,
          cityId: null,
        }),
      })
      const body = await response.json()
      if (!response.ok) throw new Error(body.error?.message || 'Could not calculate matches')
      setResults(body.data)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not calculate matches')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mx-auto max-w-content px-4 py-8 sm:px-6 lg:px-8">
      <FadeIn>
        <h1 className="section-title">Smart Match</h1>
        <p className="mt-2 text-muted">Find universities that match your study interests and preferences</p>
      </FadeIn>
      <SlideUp delay={0.1}>
        <div className="mt-8 grid gap-8 lg:grid-cols-[380px_1fr]">
          {/* Form Panel */}
          <FadeIn>
            <form onSubmit={submit} className="card space-y-6 p-6 lg:p-8 sticky top-24">
              <div>
                <h2 className="font-display text-xl font-semibold text-ink">Find your best-fit university</h2>
                <p className="mt-2 text-sm text-muted">Match your goals against 233 Japanese universities</p>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="field" className="block text-sm font-medium text-ink">
                  Study interest <span className="text-accent" aria-hidden="true">*</span>
                </label>
                <input
                  id="field"
                  type="text"
                  className="input-field"
                  value={form.field}
                  onChange={(e) => setForm({ ...form, field: e.target.value })}
                  placeholder="e.g., Computer Science, Business, Medicine"
                  required
                  autoComplete="off"
                />
                <p className="text-xs text-muted">Enter your primary field of study</p>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="budgetYearly" className="block text-sm font-medium text-ink">
                  Yearly tuition budget (JPY)
                </label>
                <input
                  id="budgetYearly"
                  type="number"
                  className="input-field"
                  value={form.budgetYearly}
                  onChange={(e) => setForm({ ...form, budgetYearly: e.target.value })}
                  placeholder="e.g., 800000"
                  min="0"
                  step="10000"
                  autoComplete="off"
                />
                <p className="text-xs text-muted">Optional. Leave empty to ignore budget filtering.</p>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="ieltsScore" className="block text-sm font-medium text-ink">
                  IELTS score
                </label>
                <input
                  id="ieltsScore"
                  type="number"
                  className="input-field"
                  value={form.ieltsScore}
                  onChange={(e) => setForm({ ...form, ieltsScore: e.target.value })}
                  placeholder="e.g., 6.5"
                  min="0"
                  max="9"
                  step="0.5"
                  autoComplete="off"
                />
                <p className="text-xs text-muted">Optional. For English-taught programs.</p>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="jlptLevel" className="block text-sm font-medium text-ink">
                  JLPT level
                </label>
                <select
                  id="jlptLevel"
                  className="input-field"
                  value={form.jlptLevel}
                  onChange={(e) => setForm({ ...form, jlptLevel: e.target.value })}
                  autoComplete="off"
                >
                  <option value="">Not sure / not applicable</option>
                  {['N1', 'N2', 'N3', 'N4', 'N5'].map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
                <p className="text-xs text-muted">Optional. For Japanese-taught programs.</p>
              </div>

              <button className="btn-primary w-full" disabled={loading || !form.field.trim()} type="submit">
                {loading ? 'Matching...' : 'Find matches'}
              </button>
            </form>
          </FadeIn>

          {/* Results Panel */}
          <SlideUp delay={0.1}>
            <div className="space-y-4">
              {error && <FadeIn><ErrorState message={error} /></FadeIn>}
              {loading && <FadeIn><div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <MatchResultSkeleton key={i} />)}</div></FadeIn>}
              {!loading && !results.length && !error && <FadeIn><div className="card text-center py-12 text-muted">Your matches will appear here after submitting the form.</div></FadeIn>}
              <StaggerContainer staggerDelay={0.08}>
                {results.map((result, index) => (
                  <StaggerItem key={result.university.id} customDelay={index * 0.05}>
                    <HoverLift>
                      <article className="card">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-accent">{result.fitLevel}</p>
                            <h2 className="mt-2 font-display text-xl font-semibold text-ink">{result.university.name}</h2>
                            <p className="text-sm text-muted">{result.university.cityName || 'Japan'} · Score {result.score}</p>
                          </div>
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-2xl font-bold text-accent">{result.score}</div>
                        </div>
                        <div className="mt-4 grid gap-4 text-sm md:grid-cols-2">
                          <div>
                            <h3 className="font-semibold text-ink">Why it fits</h3>
                            <ul className="mt-2 space-y-1 text-muted">{result.reasons.map((item) => <li key={item} className="flex items-center gap-2">• {item}</li>)}</ul>
                          </div>
                          <div>
                            <h3 className="font-semibold text-ink">Watch points</h3>
                            <ul className="mt-2 space-y-1 text-muted">{result.gaps.map((item) => <li key={item} className="flex items-center gap-2">• {item}</li>)}</ul>
                          </div>
                        </div>
                        <Link href={`/universities/${result.university.id}`} className="btn-secondary mt-5 w-full sm:w-auto">View university</Link>
                      </article>
                    </HoverLift>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </SlideUp>
        </div>
      </SlideUp>
    </section>
  )
}
