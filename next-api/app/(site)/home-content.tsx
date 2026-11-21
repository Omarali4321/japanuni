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
    number: '01',
    title: 'Universities',
    description: 'Find your academic path',
    href: '/universities',
  },
  {
    number: '02',
    title: 'Scholarships',
    description: 'Explore study funding',
    href: '/scholarships',
  },
  {
    number: '03',
    title: 'Admission',
    description: 'Prepare your application',
    href: '/admission',
  },
  {
    number: '04',
    title: 'Visa help',
    description: 'Plan the move to Japan',
    href: '/visa',
  },
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
    <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8 relative">
      {/* Hero Section - Campus photo on left, content on right */}
      <section className="relative mb-24" aria-labelledby="hero-heading">
        <div className="relative grid gap-8 lg:grid-cols-[664px_1fr] items-start">
          {/* Campus Image - Left side */}
          <div className="relative aspect-[664/650] lg:aspect-auto lg:h-[650px]">
            <div className="absolute inset-0 rounded-bl-xl rounded-br-[180px] rounded-tl-xl rounded-tr-xl overflow-hidden bg-cover bg-center" style={{ backgroundImage: 'url(/images/hero-campus.jpg)' }} />
            <div className="absolute bottom-4 left-6 text-xs text-muted/70">Illustrative campus imagery</div>
          </div>

          {/* Hero Content - Right side */}
          <div className="flex flex-col justify-center pt-12 lg:pt-0">
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-soft-surface text-xs font-medium text-ink mb-4 w-fit">
                <span className="text-accent font-semibold">STUDY IN JAPAN</span>
              </div>
            </FadeIn>
            <SlideUp delay={0.1}>
              <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-3">YOUR NEXT CHAPTER, IN JAPAN</p>
            </SlideUp>
            <SlideUp delay={0.2}>
              <h1 id="hero-heading" className="font-display text-[62px] leading-[1.1] text-ink max-w-[622px]">
                <span className="block">Your journey to</span>
                <span className="block">Japanese universities</span>
                <span className="block">starts here.</span>
              </h1>
            </SlideUp>
            <SlideUp delay={0.3}>
              <p className="mt-8 text-base leading-relaxed text-muted max-w-[600px]">
                Compare programs, discover scholarships,<br />
                and plan your student life in Japan.
              </p>
            </SlideUp>
            <SlideUp delay={0.4}>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link className="btn-primary h-[56px] px-8 text-base" href="/universities">
                  Explore Universities ↗
                </Link>
                <Link className="text-base font-medium text-ink hover:text-accent transition-colors" href="/compare">
                  Compare choices ↗
                </Link>
              </div>
            </SlideUp>
            <SlideUp delay={0.5}>
              <div className="mt-16 flex flex-col items-start gap-2 border-t border-border pt-10 w-full max-w-[600px]">
                <span className="font-display text-[46px] font-normal text-ink">233</span>
                <span className="text-base text-muted">Universities in the current catalog</span>
                <span className="text-sm text-muted">One place for research, comparison, and planning.</span>
              </div>
            </SlideUp>
          </div>
        </div>
      </section>

      {/* Journey Guide - 4 Direction Cards */}
      <section className="mb-24" aria-labelledby="journey-guide-heading">
        <div className="mb-10">
          <FadeIn>
            <p className="text-sm font-medium uppercase tracking-wider text-accent mb-2">JapanUni guide</p>
          </FadeIn>
          <SlideUp delay={0.1}>
            <h2 id="journey-guide-heading" className="font-display text-[36px] font-normal text-ink max-w-[1150px]">
              One place for your next step.
            </h2>
          </SlideUp>
        </div>
        <StaggerContainer staggerDelay={0.1} className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {helpDirections.map((direction, index) => (
            <StaggerItem key={direction.title} customDelay={index * 0.05}>
              <Link href={direction.href} className="card h-[104px] p-6 relative flex flex-col justify-between transition-all hover:shadow-lg hover:-translate-y-1 border-border">
                <div className="flex items-start gap-3">
                  <span className="text-xs font-semibold text-accent shrink-0 pt-1">{direction.number}</span>
                  <h3 className="text-xl font-medium text-ink group-hover:text-accent transition-colors">
                    {direction.title}&nbsp;↗
                  </h3>
                </div>
                <p className="text-sm text-muted mt-auto">{direction.description}</p>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* Featured Universities - 3 Cards */}
      <section className="mb-24" aria-labelledby="featured-heading">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <FadeIn>
              <h2 id="featured-heading" className="font-display text-[36px] font-normal text-ink">
                Featured universities
              </h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="mt-2 text-base text-muted">Explore institutions from the current catalog.</p>
            </FadeIn>
          </div>
          <FadeIn delay={0.2}>
            <Link href="/universities" className="text-sm font-medium text-accent hover:underline self-end">
              View all universities&nbsp;↗
            </Link>
          </FadeIn>
        </div>
        {error ? (
          <FadeIn>
            <ErrorState message={error} />
          </FadeIn>
        ) : isLoading ? (
          <StaggerContainer staggerDelay={0.1} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <StaggerItem key={i}><UniversityCardSkeleton /></StaggerItem>
            ))}
          </StaggerContainer>
        ) : (
          <StaggerContainer staggerDelay={0.1} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {universities.map((university, index) => (
              <StaggerItem key={university.id} customDelay={index * 0.05}>
                <HoverLift><UniversityCard university={university} /></HoverLift>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </section>

      {/* Official Sources Panel */}
      <section className="mb-16" aria-labelledby="sources-heading">
        <div className="rounded-2xl bg-soft-surface p-6 md:p-10">
          <FadeIn>
            <h2 id="sources-heading" className="font-display text-[27px] font-normal text-ink mb-4">
              Data sources & references
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="text-sm text-muted leading-relaxed mb-6 max-w-[1220px]">
              <p>University data sourced from official Japanese government datasets.</p>
              <p>Scholarship information from public government and university sources.</p>
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-sm font-medium text-ink mb-2">
              MEXT&nbsp;&nbsp;&nbsp;JASSO&nbsp;&nbsp;&nbsp;University of Tokyo&nbsp;&nbsp;&nbsp;Kyoto University
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <p className="text-sm text-muted">
              Waseda University&nbsp;&nbsp;&nbsp;Osaka University&nbsp;&nbsp;&nbsp;Tokyo Tech&nbsp;&nbsp;&nbsp;Tohoku University
            </p>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}