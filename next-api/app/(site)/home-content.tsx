'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { UniversityCard } from '@/components/university-card'
import { ErrorState } from '@/components/public-states'
import { listUniversities, type University } from '@/lib/web-api'
import { FadeIn, SlideUp, StaggerContainer, StaggerItem, HoverLift } from '@/components/ui/Motion'
import { UniversityCardSkeleton } from '@/components/ui/Skeleton'

const helpDirections = [
  {
    icon: '🎓',
    title: 'University Catalog',
    description: 'Browse 233 Japanese universities with programs, tuition, and admission details.',
    href: '/universities',
    cta: 'Explore universities'
  },
  {
    icon: '🔍',
    title: 'Smart Match',
    description: 'Get personalized university recommendations based on your study interests and budget.',
    href: '/match',
    cta: 'Find my match'
  },
  {
    icon: '💴',
    title: 'Scholarships',
    description: 'Discover MEXT, JASSO, and university-specific scholarships for international students.',
    href: '/scholarships',
    cta: 'View scholarships'
  },
  {
    icon: '🛂',
    title: 'Visa Guide',
    description: 'Step-by-step guide to student visa application, COE, and required documents.',
    href: '/visa',
    cta: 'Read visa guide'
  }
]

const sources = [
  { name: 'MEXT', description: 'Ministry of Education, Culture, Sports, Science and Technology' },
  { name: 'JASSO', description: 'Japan Student Services Organization' },
  { name: 'Study in Japan', description: 'Official Japanese government portal for international students' },
  { name: 'University websites', description: 'Official university admission pages' }
]

export default function HomeContent() {
  const [universities, setUniversities] = useState<University[]>([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    listUniversities(new URLSearchParams({ page: '0', size: '3' }))
      .then((result) => {
        setUniversities(result.data)
        setIsLoading(false)
      })
      .catch((reason) => {
        setError(reason.message)
        setIsLoading(false)
      })
  }, [])

  return (
    <div className="mx-auto max-w-content px-4 py-0 sm:px-6 lg:px-8">
      {/* Hero Section - Full width large photo */}
      <section className="relative h-[600px] md:h-[700px] rounded-3xl overflow-hidden mb-16">
        <div className="absolute inset-0 -z-10">
          <img
            src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1920&q=80"
            alt="Cherry blossoms in Japan with Mount Fuji in background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-warm-bg/95 via-warm-bg/50 to-transparent" />
        </div>
        <div className="relative h-full flex items-end p-8 md:p-12 lg:p-16">
          <FadeIn>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent mb-4">🇯🇵 Study in Japan</p>
          </FadeIn>
          <SlideUp delay={0.1}>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-ink max-w-2xl leading-[1.1]">
              Choose a university in Japan
            </h1>
          </SlideUp>
          <SlideUp delay={0.2}>
            <p className="mt-5 max-w-xl text-lg text-muted leading-relaxed">
              Compare programs, discover scholarships, and plan your student life in Japan.
            </p>
          </SlideUp>
          <SlideUp delay={0.3}>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link className="btn-primary" href="/universities">Explore catalog</Link>
              <Link className="btn-secondary" href="/match">Smart Match</Link>
            </div>
          </SlideUp>
        </div>
      </section>

      {/* 4 Help Directions - 2x2 Grid */}
      <section className="mb-20" aria-labelledby="help-directions-heading">
        <div className="text-center mb-12">
          <FadeIn>
            <h2 id="help-directions-heading" className="section-title">How we can help</h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="mt-3 max-w-2xl mx-auto text-muted">Four tools to guide your journey to studying in Japan</p>
          </FadeIn>
        </div>
        <StaggerContainer staggerDelay={0.1} className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {helpDirections.map((direction, index) => (
            <StaggerItem key={direction.title} customDelay={index * 0.05}>
              <HoverLift>
                <Link href={direction.href} className="block card h-full p-8 md:p-10 transition-all duration-300 hover:shadow-xl group">
                  <div className="text-4xl mb-4">{direction.icon}</div>
                  <h3 className="font-display text-xl font-semibold text-ink mb-3">{direction.title}</h3>
                  <p className="text-muted mb-6 leading-relaxed">{direction.description}</p>
                  <span className="inline-flex items-center gap-2 text-accent font-medium group-hover:underline">
                    {direction.cta}
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </Link>
              </HoverLift>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* Featured Universities */}
      <section className="mb-20" aria-labelledby="featured-heading">
        <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <FadeIn>
              <h2 id="featured-heading" className="section-title">Featured universities</h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="mt-2 text-muted">Explore institutions from the current catalog</p>
            </FadeIn>
          </div>
          <FadeIn delay={0.2}>
            <Link href="/universities" className="btn-secondary self-start">View all</Link>
          </FadeIn>
        </div>
        {error ? (
          <FadeIn>
            <ErrorState message={error} />
          </FadeIn>
        ) : isLoading ? (
          <StaggerContainer staggerDelay={0.1} className="grid gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <StaggerItem key={i}><UniversityCardSkeleton /></StaggerItem>
            ))}
          </StaggerContainer>
        ) : (
          <StaggerContainer staggerDelay={0.1} className="grid gap-6 md:grid-cols-3">
            {universities.map((university, index) => (
              <StaggerItem key={university.id} customDelay={index * 0.05}>
                <HoverLift><UniversityCard university={university} /></HoverLift>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </section>

      {/* Sources Section */}
      <section className="pb-16" aria-labelledby="sources-heading">
        <div className="text-center mb-12">
          <FadeIn>
            <h2 id="sources-heading" className="section-title">Data sources & references</h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="mt-3 max-w-2xl mx-auto text-muted">University data sourced from official Japanese government datasets. Scholarship information from public government and university sources.</p>
          </FadeIn>
        </div>
        <div className="border-t border-border pt-12">
          <FadeIn>
            <h3 className="text-center text-lg font-semibold text-muted mb-8">Official sources & organizations</h3>
          </FadeIn>
          <StaggerContainer staggerDelay={0.05} className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            {sources.map((source, index) => (
              <StaggerItem key={source.name} customDelay={index * 0.05}>
                <motion.div
                  className="flex items-center gap-2 px-4 py-2 card rounded-full transition-colors hover:bg-muted"
                  whileHover={{ scale: 1.02 }}
                >
                  <span className="font-medium text-ink hidden sm:inline">{source.name}</span>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
          <FadeIn delay={0.3} className="mt-8 text-center">
            <p className="text-sm text-muted/70">All information should be verified with the respective university or official source before making decisions.</p>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}
