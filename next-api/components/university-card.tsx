'use client'

import Link from 'next/link'
import { useCompare } from '@/components/compare-context'
import type { University } from '@/lib/web-api'

function getLanguageBadge(mediumOfInstruction: string | null) {
  if (!mediumOfInstruction) return null
  const lower = mediumOfInstruction.toLowerCase()
  if (lower.includes('japanese (100%)') && lower.includes('english (100%)')) {
    return { text: 'JP/EN', className: 'bg-emerald-500/10 text-emerald-600' }
  }
  if (lower.includes('japanese (100%)')) {
    return { text: 'Japanese', className: 'bg-blue-500/10 text-blue-600' }
  }
  if (lower.includes('english (100%)')) {
    return { text: 'English', className: 'bg-amber-500/10 text-amber-600' }
  }
  return { text: 'Multiple', className: 'bg-violet-500/10 text-violet-600' }
}

function getIntakeBadge(intake: string | null) {
  if (!intake) return null
  const lower = intake.toLowerCase()
  if (lower.includes('april') && !lower.includes('october') && !lower.includes('september')) {
    return { text: 'Apr', className: 'bg-accent/10 text-accent' }
  }
  if (lower.includes('october') && !lower.includes('april') && !lower.includes('september')) {
    return { text: 'Oct', className: 'bg-indigo-500/10 text-indigo-600' }
  }
  if (lower.includes('september') && !lower.includes('april') && !lower.includes('october')) {
    return { text: 'Sep', className: 'bg-orange-500/10 text-orange-600' }
  }
  return { text: 'Multi', className: 'bg-muted/20 text-muted' }
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function UniversityCard({ university, showCompare = true }: { university: University; showCompare?: boolean }) {
  const { selectedIds, toggleSelection, isSelected } = useCompare()
  const selected = isSelected(university.id)

  const languageBadge = getLanguageBadge(university.mediumOfInstruction)
  const intakeBadge = getIntakeBadge(university.intake)
  const typeColor = university.institutionType === 'National' ? 'bg-red-500/10 text-red-600' :
                    university.institutionType === 'Public' ? 'bg-blue-500/10 text-blue-600' :
                    'bg-purple-500/10 text-purple-600'

  const hasImage = university.images?.[0]
  const initials = getInitials(university.name)

  return (
    <Link href={`/universities/${university.id}`} className="block">
      <article className="card overflow-hidden p-0 flex flex-col border-border transition-shadow hover:shadow-lg">
        <div className="relative h-48 bg-muted/30">
          {hasImage ? (
            <img
              src={university.images[0]}
              alt={`${university.name} campus`}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <div className="flex items-center justify-center h-full w-full bg-muted/30">
              <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center">
                <span className="text-2xl font-display font-medium text-accent">{initials}</span>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
          <div className="absolute left-3 top-3 right-3 flex justify-between">
            {university.ranking && (
              <span className="rounded-lg bg-accent/90 px-2 py-1 text-xs font-medium text-white">#{university.ranking}</span>
            )}
            {showCompare && (
              <button
                type="button"
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  selected
                    ? 'bg-accent text-white ring-2 ring-accent/50'
                    : 'bg-white/90 text-ink hover:bg-accent/10'
                }`}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleSelection(university.id) }}
                aria-label={selected ? `Remove ${university.name} from comparison` : `Add ${university.name} to comparison`}
                aria-pressed={selected}
              >
                {selected ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                )}
              </button>
            )}
          </div>
        </div>
        <div className="p-4 flex-1">
          <div className="flex flex-wrap gap-1.5 mb-2">
            {university.institutionType && <span className={`text-xs px-2 py-0.5 rounded-full ${typeColor}`}>{university.institutionType}</span>}
            {languageBadge && <span className={`text-xs px-2 py-0.5 rounded-full ${languageBadge.className}`}>{languageBadge.text}</span>}
            {intakeBadge && <span className={`text-xs px-2 py-0.5 rounded-full ${intakeBadge.className}`}>{intakeBadge.text}</span>}
            {university.programCount && <span className="text-xs px-2 py-0.5 rounded-full bg-muted/50 text-muted">{university.programCount} programs</span>}
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
              {university.programCount && university.programCount > 0 ? 'Program-level data' : 'University-level data'}
            </span>
          </div>
          <h2 className="font-display text-lg font-medium hover:text-accent transition-colors">{university.name}</h2>
          <p className="mt-1 text-sm text-muted">{university.cityName || 'Japan'}</p>
          <p className="mt-2 line-clamp-2 text-sm text-ink/70">{university.faculty || university.majorSpeciality || 'Explore programs and admissions information.'}</p>
          {university.tuitionFeeYearly && (
            <p className="mt-3 text-sm font-medium text-accent">¥{university.tuitionFeeYearly.toLocaleString()}/year</p>
          )}
        </div>
      </article>
    </Link>
  )
}
