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
  const [form, setForm] = useState({ field: 'Computer Science', budgetYearly: '700000', ieltsScore: '6.5', jlptLevel: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submit(event: React.FormEvent) {
    event.preventDefault()
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
          cityId: null, // City data not available in CSV
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
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid items-start gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <FadeIn>
          <form onSubmit={submit} className="glass-card space-y-5">
            <h1 className="font-display text-2xl font-semibold">Find your best-fit university</h1>
            <p className="text-sm text-ink-800/60 dark:text-ink-50/60">Match your goals against the current catalog.</p>
            
            <div className="space-y-1.5">
              <label htmlFor="field" className="block text-sm font-medium text-ink-800 dark:text-ink-50">
                Study interest <span className="text-sakura-500" aria-hidden="true">*</span>
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
              <p className="text-xs text-ink-800/40 dark:text-ink-50/40">Enter your primary field of study</p>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="budgetYearly" className="block text-sm font-medium text-ink-800 dark:text-ink-50">
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
              <p className="text-xs text-ink-800/40 dark:text-ink-50/40">Optional. Leave empty to ignore budget filtering.</p>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="ieltsScore" className="block text-sm font-medium text-ink-800 dark:text-ink-50">
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
              <p className="text-xs text-ink-800/40 dark:text-ink-50/40">Optional. For English-taught programs.</p>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="jlptLevel" className="block text-sm font-medium text-ink-800 dark:text-ink-50">
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
              <p className="text-xs text-ink-800/40 dark:text-ink-50/40">Optional. For Japanese-taught programs.</p>
            </div>

            <p className="text-xs text-ink-800/40 dark:text-ink-50/40">City filter hidden — city data not available in source CSV.</p>
            <button className="btn-primary w-full" disabled={loading} type="submit">
              {loading ? 'Matching...' : 'Find matches'}
            </button>
          </form>
        </FadeIn>
        <SlideUp delay={0.1}>
          <div className="space-y-4">
            {error && <FadeIn><ErrorState message={error} /></FadeIn>}
            {loading && <FadeIn><div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <MatchResultSkeleton key={i} />)}</div></FadeIn>}
            {!loading && !results.length && !error && <FadeIn><div className="glass-card text-ink-800/60 dark:text-ink-50/60">Your matches will appear here.</div></FadeIn>}
            <StaggerContainer staggerDelay={0.08}>
              {results.map((result, index) => (
                <StaggerItem key={result.university.id} customDelay={index * 0.05}>
                  <HoverLift>
                    <article className="glass-card">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-sakura-500">{result.fitLevel}</p>
                          <h2 className="mt-2 font-display text-xl font-semibold">{result.university.name}</h2>
                          <p className="text-sm text-ink-800/60 dark:text-ink-50/60">{result.university.cityName || 'Japan'} · Score {result.score}</p>
                        </div>
                        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-sakura-500/10 text-2xl font-bold text-sakura-500">{result.score}</div>
                      </div>
                      <div className="mt-4 grid gap-4 text-sm md:grid-cols-2">
                        <div>
                          <h3 className="font-semibold">Why it fits</h3>
                          <ul className="mt-2 space-y-1 text-ink-800/70 dark:text-ink-50/70">{result.reasons.map((item) => <li key={item}>• {item}</li>)}</ul>
                        </div>
                        <div>
                          <h3 className="font-semibold">Watch points</h3>
                          <ul className="mt-2 space-y-1 text-ink-800/70 dark:text-ink-50/70">{result.gaps.map((item) => <li key={item}>• {item}</li>)}</ul>
                        </div>
                      </div>
                      <Link href={`/universities/${result.university.id}`} className="btn-secondary mt-5">View university</Link>
                    </article>
                  </HoverLift>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </SlideUp>
      </div>
    </section>
  )
}
