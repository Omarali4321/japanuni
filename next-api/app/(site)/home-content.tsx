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
    title: 'Explore Universities',
    description: 'Browse 230+ Japanese universities with detailed program info, faculties, and admission requirements.',
    icon: '🏛️',
    href: '/universities',
  },
  {
    title: 'Compare Programs',
    description: 'Side-by-side comparison of up to 4 universities. Filter by tuition, language, intake, and more.',
    icon: '⚖️',
    href: '/compare',
  },
  {
    title: 'Find Scholarships',
    description: 'Discover MEXT, JASSO, and university-specific scholarships. Filter by degree level and coverage.',
    icon: '💴',
    href: '/scholarships',
  },
  {
    title: 'Plan Admission & Visa',
    description: 'Step-by-step guides for admission requirements, document preparation, and visa application.',
    icon: '📋',
    href: '/admission',
  },
]

const partners = [
  { name: 'MEXT', logo: '🇯🇵' },
  { name: 'JASSO', logo: '🎓' },
  { name: 'University of Tokyo', logo: '🏛️' },
  { name: 'Kyoto University', logo: '🏛️' },
  { name: 'Waseda University', logo: '🏛️' },
  { name: 'Osaka University', logo: '🏛️' },
  { name: 'Tokyo Tech', logo: '🏛️' },
  { name: 'Tohoku University', logo: '🏛️' },
]

function SocialProof() {
  return (
    <section className="mt-24" aria-labelledby="social-proof-heading">
      <div className="text-center mb-12">
        <FadeIn>
          <h2 id="social-proof-heading" className="section-title">Data sources & references</h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="mt-3 max-w-2xl mx-auto text-muted">
            University data sourced from official Japanese government datasets. Scholarship information from public government and university sources.
          </p>
        </FadeIn>
      </div>

      <div className="border-t border-border pt-12">
        <FadeIn>
          <h3 className="text-center text-lg font-semibold text-muted mb-8">Official sources & organizations</h3>
        </FadeIn>
        <StaggerContainer staggerDelay={0.05} className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
          {partners.map((partner, index) => (
            <StaggerItem key={index} customDelay={index * 0.05}>
              <motion.div
                className="flex items-center gap-2 px-4 py-2 rounded-full card transition-colors hover:bg-accent/10"
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-2xl">{partner.logo}</span>
                <span className="font-medium text-ink hidden sm:inline">{partner.name}</span>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}

export default function HomeContent() {
  const [universities, setUniversities] = useState<University[]>([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    listUniversities(new URLSearchParams({ page: '0', size: '4' }))
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
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 relative">
      {/* Hero Section with large photo */}
      <section className="relative mb-24" aria-labelledby="hero-heading">
        <div className="relative aspect-[664/374] rounded-2xl overflow-hidden bg-background">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1328&h=748&fit=crop)' }} />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
              <FadeIn>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Study in Japan</p>
              </FadeIn>
              <SlideUp delay={0.1}>
                <h1 id="hero-heading" className="mt-4 font-display text-4xl font-bold md:text-5xl lg:text-6xl text-ink max-w-2xl">
                  Your gateway to Japanese higher education
                </h1>
              </SlideUp>
              <SlideUp delay={0.2}>
                <p className="mt-5 max-w-xl text-lg text-muted">
                  Compare programs, discover scholarships, and plan your student life in Japan — all in one place.
                </p>
              </SlideUp>
              <SlideUp delay={0.3}>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link className="btn-primary" href="/universities">Explore Universities</Link>
                  <Link className="btn-secondary" href="/compare">Compare Programs</Link>
                </div>
              </SlideUp>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Help Directions - 2x2 Grid */}
      <section className="mb-24" aria-labelledby="help-directions-heading">
        <div className="text-center mb-12">
          <FadeIn>
            <h2 id="help-directions-heading" className="section-title">How can we help you?</h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="mt-3 max-w-2xl mx-auto text-muted">
              Choose a path to start your journey. Each section is designed to guide you through a specific part of the process.
            </p>
          </FadeIn>
        </div>
        <StaggerContainer staggerDelay={0.1} className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {helpDirections.map((direction, index) => (
            <StaggerItem key={direction.title} customDelay={index * 0.05}>
              <Link href={direction.href} className="card group p-6 h-full transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="text-4xl mb-4">{direction.icon}</div>
                <h3 className="text-xl font-semibold text-ink group-hover:text-accent transition-colors">{direction.title}</h3>
                <p className="mt-3 text-muted text-sm">{direction.description}</p>
                <div className="mt-4 text-sm font-medium text-accent group-hover:underline">Learn more →</div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* Featured Universities */}
      <section className="mb-24" aria-labelledby="featured-heading">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <FadeIn>
              <h2 id="featured-heading" className="section-title">Featured universities</h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="mt-2 text-muted">Explore institutions from the current catalog.</p>
            </FadeIn>
          </div>
          <FadeIn delay={0.2}>
            <Link href="/universities" className="btn-secondary">View all</Link>
          </FadeIn>
        </div>
        {error ? (
          <FadeIn>
            <ErrorState message={error} />
          </FadeIn>
        ) : isLoading ? (
          <StaggerContainer staggerDelay={0.1} className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <StaggerItem key={i}><UniversityCardSkeleton /></StaggerItem>
            ))}
          </StaggerContainer>
        ) : (
          <StaggerContainer staggerDelay={0.1} className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {universities.map((university, index) => (
              <StaggerItem key={university.id} customDelay={index * 0.05}>
                <HoverLift><UniversityCard university={university} /></HoverLift>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </section>

      {/* Sources / Social Proof */}
      <SocialProof />
    </div>
  )
}