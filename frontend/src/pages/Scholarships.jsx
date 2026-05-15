import { useEffect, useState } from 'react'
import SEO from '../components/SEO'
import Hero from '../components/Hero'
import LoadingSpinner from '../components/LoadingSpinner'
import ScrollReveal from '../components/ScrollReveal'
import { scholarshipApi } from '../api/services'

export default function Scholarships() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    setLoading(true)
    scholarshipApi.search({ search: search || undefined, page: 0, size: 50 })
      .then((res) => setItems(res.data.content))
      .finally(() => setLoading(false))
  }, [search])

  return (
    <>
      <SEO title="Scholarships" description="MEXT and university scholarships for international students in Japan." />
      <Hero title="Scholarships in Japan" subtitle="Government and university funding for your studies." badge="Funding" cta={null} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ScrollReveal>
          <input
            type="search"
            placeholder="Search scholarships..."
            className="input-field max-w-md mb-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </ScrollReveal>
        {loading ? <LoadingSpinner /> : (
          <div className="grid md:grid-cols-2 gap-6">
            {items.map((s, i) => (
              <ScrollReveal key={s.id} delay={i * 0.05}>
                <article className="glass-card">
                  <h3 className="font-display font-semibold text-lg text-sakura-500">{s.title}</h3>
                  {s.universityName && <p className="text-sm mt-1 text-ink-800/60 dark:text-ink-50/60">{s.universityName}</p>}
                  <p className="mt-3 text-sm text-ink-800/80 dark:text-ink-50/80">{s.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs">
                    {s.amountYearly && <span className="px-2 py-1 rounded-md glass">¥{Number(s.amountYearly).toLocaleString()}/yr</span>}
                    {s.coverage && <span className="px-2 py-1 rounded-md glass">{s.coverage}</span>}
                    {s.deadlineMonth && <span className="px-2 py-1 rounded-md glass">Deadline: {s.deadlineMonth}</span>}
                  </div>
                  {s.eligibility && <p className="mt-3 text-xs text-ink-800/60 dark:text-ink-50/60"><strong>Eligibility:</strong> {s.eligibility}</p>}
                </article>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
