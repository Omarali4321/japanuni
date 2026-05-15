import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Hero from '../components/Hero'
import SEO from '../components/SEO'
import ScrollReveal from '../components/ScrollReveal'
import UniversityCard from '../components/UniversityCard'
import { universityApi } from '../api/services'

const features = [
  { icon: '🎓', title: 'Top Universities', desc: 'Explore UTokyo, Kyoto, Waseda, and more.' },
  { icon: '💴', title: 'Scholarships', desc: 'MEXT and university-specific funding.' },
  { icon: '📋', title: 'Admission Guides', desc: 'Step-by-step application support.' },
  { icon: '🛂', title: 'Visa Help', desc: 'Student visa requirements explained.' },
]

export default function Home() {
  const [featured, setFeatured] = useState([])

  useEffect(() => {
    universityApi.search({ page: 0, size: 3 }).then((res) => setFeatured(res.data.content)).catch(() => {})
  }, [])

  return (
    <>
      <SEO title="Home" description="Discover Japanese universities, scholarships, and study abroad resources." />
      <Hero
        badge="🇯🇵 Study in Japan"
        title="Your journey to Japanese universities starts here"
        subtitle="Compare programs, check IELTS, TOEFL & JLPT requirements, find scholarships, and plan your student life in Japan."
        cta="Explore Universities"
      />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <ScrollReveal>
          <h2 className="section-title text-center">Everything you need</h2>
          <p className="text-center text-ink-800/60 dark:text-ink-50/60 mt-3 max-w-xl mx-auto">
            One platform for research, comparison, and planning your study abroad adventure.
          </p>
        </ScrollReveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {features.map((f, i) => (
            <ScrollReveal key={f.title} delay={i * 0.1}>
              <motion.div className="glass-card text-center" whileHover={{ scale: 1.02 }}>
                <span className="text-4xl">{f.icon}</span>
                <h3 className="font-display font-semibold mt-4">{f.title}</h3>
                <p className="text-sm text-ink-800/60 dark:text-ink-50/60 mt-2">{f.desc}</p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-b from-transparent to-sakura-500/5 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <motion.div>
              <h2 className="section-title">Featured universities</h2>
              <p className="text-ink-800/60 dark:text-ink-50/60 mt-2">Japan&apos;s most sought-after institutions</p>
            </motion.div>
            <Link to="/universities" className="btn-secondary">View all</Link>
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-6">
            {featured.map((u, i) => (
              <UniversityCard key={u.id} university={u} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <ScrollReveal>
          <h2 className="section-title">Ready to begin?</h2>
          <p className="mt-4 text-ink-800/60 dark:text-ink-50/60">Create an account to save favorites and compare universities.</p>
          <div className="mt-8 flex gap-4 justify-center flex-wrap">
            <Link to="/register" className="btn-primary">Get started free</Link>
            <Link to="/admission" className="btn-secondary">Read admission guide</Link>
          </div>
        </ScrollReveal>
      </section>
    </>
  )
}
