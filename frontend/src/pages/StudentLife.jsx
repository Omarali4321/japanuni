import { useEffect, useState } from 'react'
import SEO from '../components/SEO'
import Hero from '../components/Hero'
import LoadingSpinner from '../components/LoadingSpinner'
import ScrollReveal from '../components/ScrollReveal'
import { guideApi } from '../api/services'

const fallbackImages = {
  Culture: 'https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&w=1200&q=80',
}

export default function StudentLife() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    guideApi.studentLife()
      .then((res) => setArticles(res.data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <SEO title="Student Life" description="Cost of living, culture, and housing for students in Japan." />
      <Hero title="Student Life in Japan" subtitle="What to expect as an international student." badge="Life" cta={null} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? <LoadingSpinner /> : (
          <div className="grid md:grid-cols-3 gap-6">
            {articles.map((a, i) => (
              <ScrollReveal key={a.id} delay={i * 0.1}>
                <article className="glass-card overflow-hidden p-0">
                  {a.imageUrl && (
                    <img
                      src={fallbackImages[a.category] || a.imageUrl}
                      alt={a.title}
                      className="w-full h-40 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&w=1200&q=80'
                      }}
                    />
                  )}
                  <div className="p-6">
                    <span className="text-xs text-sakura-500 font-medium">{a.category}</span>
                    <h2 className="font-display text-lg font-semibold mt-2">{a.title}</h2>
                    <p className="mt-3 text-sm text-ink-800/80 dark:text-ink-50/80">{a.content}</p>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
