import { useEffect, useState } from 'react'
import SEO from '../components/SEO'
import Hero from '../components/Hero'
import LoadingSpinner from '../components/LoadingSpinner'
import ScrollReveal from '../components/ScrollReveal'
import { guideApi } from '../api/services'

export default function Visa() {
  const [guides, setGuides] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    guideApi.visa()
      .then((res) => setGuides(res.data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <SEO title="Visa Guide" description="Student visa requirements and process for studying in Japan." />
      <Hero title="Visa Guide" subtitle="Student visa, COE, and part-time work permissions." badge="Visa" cta={null} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? <LoadingSpinner /> : (
          <div className="space-y-6">
            {guides.map((g, i) => (
              <ScrollReveal key={g.id} delay={i * 0.1}>
                <article className="glass-card">
                  {g.visaType && <span className="text-xs font-medium text-sakura-500 uppercase">{g.visaType}</span>}
                  <h2 className="font-display text-xl font-semibold mt-2">{g.title}</h2>
                  <p className="mt-3 text-ink-800/80 dark:text-ink-50/80 leading-relaxed">{g.content}</p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
