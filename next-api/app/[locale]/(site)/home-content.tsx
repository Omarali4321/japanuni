'use client'

import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { useApiError } from '@/lib/use-api-error'
import { useEffect, useState } from 'react'
import { UniversityCard } from '@/components/university-card'
import { ErrorState } from '@/components/public-states'
import { listUniversities, type University } from '@/lib/web-api'
import { FadeIn, SlideUp, StaggerContainer, StaggerItem, HoverLift } from '@/components/ui/Motion'
import { UniversityCardSkeleton } from '@/components/ui/Skeleton'

const helpDirections = [
  {
    number: '01',
    key: 'dir1',
    href: '/universities',
  },
  {
    number: '02',
    key: 'dir2',
    href: '/scholarships',
  },
  {
    number: '03',
    key: 'dir3',
    href: '/admission',
  },
  {
    number: '04',
    key: 'dir4',
    href: '/visa',
  },
]

export default function HomeContent() {
  const t = useTranslations('Home')
  const apiError = useApiError()
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
        setError(apiError(reason))
        setIsLoading(false)
      })
  }, [])

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-10 2xl:px-16 relative">
      {/* Hero Section - Campus photo on left, content on right */}
      <section className="relative mb-24" aria-labelledby="hero-heading">
        <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] items-start">
          {/* Campus Image - Left side */}
          <div className="relative">
            <div
              className="aspect-[1/1] lg:aspect-[1/1] 2xl:aspect-[1.04/1] rounded-bl-xl rounded-br-[180px] rounded-tl-xl rounded-tr-xl overflow-hidden bg-cover"
              role="img"
              aria-label={t('heroAlt')}
              style={{ backgroundImage: 'url(/images/hero-fuji.jpg)', backgroundPosition: '50% center' }}
            />
          </div>
          {/* Hero Content - Right side */}
          <div className="flex flex-col justify-center pt-12 lg:pt-0">
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-soft-surface text-xs font-medium text-ink mb-4 w-fit">
                <span className="text-accent font-semibold">{t('badge')}</span>
              </div>
            </FadeIn>
            <SlideUp delay={0.1}>
              <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-3">{t('kicker')}</p>
            </SlideUp>
            <SlideUp delay={0.2}>
              <h1 id="hero-heading" className="font-display text-[40px] sm:text-[52px] lg:text-[62px] leading-[1.1] text-ink max-w-[622px]">
                <span className="block">{t('h1a')}</span>
                <span className="block">{t('h1b')}</span>
                <span className="block">{t('h1c')}</span>
              </h1>
            </SlideUp>
            <SlideUp delay={0.3}>
              <p className="mt-8 text-base leading-relaxed text-muted max-w-[600px]">
                {t('heroText1')}<br />
                {t('heroText2')}
              </p>
            </SlideUp>
            <SlideUp delay={0.4}>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link className="btn-primary h-[56px] px-8 text-base" href="/universities">
                  {t('ctaExplore')}
                </Link>
                <Link className="text-base font-medium text-ink hover:text-accent transition-colors" href="/compare">
                  {t('ctaCompare')}
                </Link>
              </div>
            </SlideUp>
            <SlideUp delay={0.5}>
              <div className="mt-16 flex flex-col items-start gap-2 border-t border-border pt-10 w-full max-w-[600px]">
                <span className="font-display text-[46px] font-normal text-ink">233</span>
                <span className="text-base text-muted">{t('statLabel')}</span>
                <span className="text-sm text-muted">{t('statNote')}</span>
              </div>
            </SlideUp>
          </div>
        </div>
      </section>

      {/* Journey Guide - 4 Direction Cards */}
      <section className="mb-24" aria-labelledby="journey-guide-heading">
        <div className="mb-10">
          <FadeIn>
            <p className="text-sm font-medium uppercase tracking-wider text-accent mb-2">{t('guideKicker')}</p>
          </FadeIn>
          <SlideUp delay={0.1}>
            <h2 id="journey-guide-heading" className="font-display text-[36px] font-normal text-ink max-w-[1150px]">
              {t('guideTitle')}
            </h2>
          </SlideUp>
        </div>
        <StaggerContainer staggerDelay={0.1} className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {helpDirections.map((direction, index) => (
            <StaggerItem key={direction.key} customDelay={index * 0.05}>
              <Link href={direction.href} className="card h-[104px] p-6 relative flex flex-col justify-between transition-all hover:shadow-lg hover:-translate-y-1 border-border">
                <div className="flex items-start gap-3">
                  <span className="text-xs font-semibold text-accent shrink-0 pt-1">{direction.number}</span>
                  <h3 className="text-xl font-medium text-ink group-hover:text-accent transition-colors">
                    {t(`${direction.key}Title`)}&nbsp;↗
                  </h3>
                </div>
                <p className="text-sm text-muted mt-auto">{t(`${direction.key}Desc`)}</p>
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
                {t('featuredTitle')}
              </h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="mt-2 text-base text-muted">{t('featuredText')}</p>
            </FadeIn>
          </div>
          <FadeIn delay={0.2}>
            <Link href="/universities" className="text-sm font-medium text-accent hover:underline self-end">
              {t('viewAll')}&nbsp;↗
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
              {t('sourcesTitle')}
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="text-sm text-muted leading-relaxed mb-6 max-w-[1220px]">
              <p>{t('sources1')}</p>
              <p>{t('sources2')}</p>
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
