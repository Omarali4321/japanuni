'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { UniversityCard } from '@/components/university-card'
import { ErrorState } from '@/components/public-states'
import { listUniversities, type University } from '@/lib/web-api'
import { FadeIn, SlideUp, StaggerContainer, StaggerItem, HoverLift } from '@/components/ui/Motion'
import { UniversityCardSkeleton } from '@/components/ui/Skeleton'

function HeroParticles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 5,
  }))

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-sakura-500/20"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.5, 0],
            scale: [0, 1, 0],
            y: [0, -100],
            x: [0, (Math.random() - 0.5) * 100],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  )
}

function HeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-sakura-500/10 blur-[150px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-sakura-600/10 blur-[150px] animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 w-[200px] h-[200px] rounded-full bg-sakura-400/10 blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
      <HeroParticles />
    </div>
  )
}

const testimonials = [
  {
    quote: "JapanUni helped me find the perfect university in Tokyo. The comparison tool saved me weeks of research!",
    author: "Sarah Chen",
    role: "International Student, Waseda University",
    avatar: "SC",
  },
  {
    quote: "The scholarship database is incredible. I found 3 scholarships I qualified for and got one!",
    author: "Kenji Tanaka",
    role: "Graduate Student, University of Tokyo",
    avatar: "KT",
  },
  {
    quote: "Visa guide was a lifesaver. Step-by-step instructions made the COE application stress-free.",
    author: "Maria Santos",
    role: "Undergraduate, Kyoto University",
    avatar: "MS",
  },
]

const partners = [
  { name: "MEXT", logo: "🇯🇵" },
  { name: "JASSO", logo: "🎓" },
  { name: "University of Tokyo", logo: "🏛️" },
  { name: "Kyoto University", logo: "🏛️" },
  { name: "Waseda University", logo: "🏛️" },
  { name: "Osaka University", logo: "🏛️" },
  { name: "Tokyo Tech", logo: "🏛️" },
  { name: "Tohoku University", logo: "🏛️" },
]

function SocialProof() {
  return (
    <section className="mt-24" aria-labelledby="social-proof-heading">
      <div className="text-center mb-12">
        <FadeIn>
          <h2 id="social-proof-heading" className="section-title">Trusted by students worldwide</h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="mt-3 max-w-2xl mx-auto text-ink-800/60 dark:text-ink-50/60">Join thousands of students who found their path to Japan through JapanUni.</p>
        </FadeIn>
      </div>

      <div className="mb-16">
        <StaggerContainer staggerDelay={0.15} className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <StaggerItem key={index}>
              <HoverLift className="glass-card p-6 h-full">
                <div className="flex items-center gap-2 mb-4 text-sakura-500">
                  ★★★★★
                </div>
                <p className="text-ink-800/80 dark:text-ink-50/80 italic mb-6">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sakura-500 to-sakura-600 flex items-center justify-center text-white font-medium text-sm">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-ink-800 dark:text-ink-50">{testimonial.author}</p>
                    <p className="text-sm text-ink-800/60 dark:text-ink-50/60">{testimonial.role}</p>
                  </div>
                </div>
              </HoverLift>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>

      <div className="border-t border-white/10 pt-12">
        <FadeIn>
          <h3 className="text-center text-lg font-semibold text-ink-800/60 dark:text-ink-50/60 mb-8">Partner institutions & organizations</h3>
        </FadeIn>
        <StaggerContainer staggerDelay={0.05} className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
          {partners.map((partner, index) => (
            <StaggerItem key={index} customDelay={index * 0.05}>
              <motion.div
                className="flex items-center gap-2 px-4 py-2 glass rounded-full transition-colors hover:bg-sakura-500/10"
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-2xl">{partner.logo}</span>
                <span className="font-medium text-ink-800 dark:text-ink-50 hidden sm:inline">{partner.name}</span>
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
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 relative">
      <HeroBackground />
      <section className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <FadeIn>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sakura-500">🇯🇵 Study in Japan</p>
          </FadeIn>
          <SlideUp delay={0.1}>
            <h1 className="mt-4 font-display text-4xl font-bold md:text-6xl">Your journey to Japanese universities starts here</h1>
          </SlideUp>
          <SlideUp delay={0.2}>
            <p className="mt-5 max-w-2xl text-lg text-ink-800/70 dark:text-ink-50/70">Compare programs, discover scholarships, and plan your student life in Japan.</p>
          </SlideUp>
          <SlideUp delay={0.3}>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link className="btn-primary" href="/universities">Explore Universities</Link>
              <Link className="btn-secondary" href="/compare">Compare choices</Link>
            </div>
          </SlideUp>
        </div>
        <HoverLift className="glass-card relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-sakura-500/10 to-transparent" />
          <FadeIn delay={0.1}>
            <p className="text-sm font-semibold text-sakura-500 relative z-10">JapanUni guide</p>
          </FadeIn>
          <SlideUp delay={0.2}>
            <h2 className="mt-3 font-display text-2xl font-semibold relative z-10">One place for research, comparison, and planning.</h2>
          </SlideUp>
          <StaggerContainer staggerDelay={0.1} delayChildren={0.3} className="mt-6 grid grid-cols-2 gap-3 text-sm relative z-10">
            <StaggerItem><div className="rounded-xl bg-sakura-500/10 p-4">🎓 Universities</div></StaggerItem>
            <StaggerItem><div className="rounded-xl bg-sakura-500/10 p-4">💴 Scholarships</div></StaggerItem>
            <StaggerItem><div className="rounded-xl bg-sakura-500/10 p-4">📋 Admission</div></StaggerItem>
            <StaggerItem><div className="rounded-xl bg-sakura-500/10 p-4">🛂 Visa help</div></StaggerItem>
          </StaggerContainer>
        </HoverLift>
      </section>
      <section className="mt-20">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <FadeIn>
              <h2 className="section-title">Featured universities</h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="mt-2 text-ink-800/60 dark:text-ink-50/60">Explore institutions from the current catalog.</p>
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
      <SocialProof />
    </div>
  )
}
