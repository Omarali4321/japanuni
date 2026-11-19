'use client'

import Link from 'next/link'
import { useCompare } from '@/components/compare-context'
import type { University } from '@/lib/web-api'

function getLanguageBadge(mediumOfInstruction: string | null) {
  if (!mediumOfInstruction) return null
  const lower = mediumOfInstruction.toLowerCase()
  if (lower.includes('japanese (100%)') && lower.includes('english (100%)')) {
    return { text: 'JP/EN', className: 'bg-emerald-500/20 text-emerald-500 dark:text-emerald-400' }
  }
  if (lower.includes('japanese (100%)')) {
    return { text: 'Japanese', className: 'bg-blue-500/20 text-blue-500 dark:text-blue-400' }
  }
  if (lower.includes('english (100%)')) {
    return { text: 'English', className: 'bg-amber-500/20 text-amber-500 dark:text-amber-400' }
  }
  return { text: 'Multiple', className: 'bg-violet-500/20 text-violet-500 dark:text-violet-400' }
}

function getIntakeBadge(intake: string | null) {
  if (!intake) return null
  const lower = intake.toLowerCase()
  if (lower.includes('april') && !lower.includes('october') && !lower.includes('september')) {
    return { text: 'Apr', className: 'bg-sakura-500/20 text-sakura-500 dark:text-sakura-400' }
  }
  if (lower.includes('october') && !lower.includes('april') && !lower.includes('september')) {
    return { text: 'Oct', className: 'bg-indigo-500/20 text-indigo-500 dark:text-indigo-400' }
  }
  if (lower.includes('september') && !lower.includes('april') && !lower.includes('october')) {
    return { text: 'Sep', className: 'bg-orange-500/20 text-orange-500 dark:text-orange-400' }
  }
  return { text: 'Multi', className: 'bg-gray-500/20 text-gray-500 dark:text-gray-400' }
}

export function UniversityCard({ university, showCompare = true }: { university: University; showCompare?: boolean }) {
  const { selectedIds, toggleSelection, isSelected } = useCompare()
  const selected = isSelected(university.id)

  const languageBadge = getLanguageBadge(university.mediumOfInstruction)
  const intakeBadge = getIntakeBadge(university.intake)
  const typeColor = university.institutionType === 'National' ? 'bg-red-500/20 text-red-500 dark:text-red-400' :
                    university.institutionType === 'Public' ? 'bg-blue-500/20 text-blue-500 dark:text-blue-400' :
                    'bg-purple-500/20 text-purple-500 dark:text-purple-400'

  return <article className="glass-card overflow-hidden p-0 flex flex-col">
    <div className="relative h-44 bg-ink-800/30">
      {university.images?.[0] && <img src={university.images[0]} alt="" className="h-full w-full object-cover" />}
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 to-transparent" />
      <div className="absolute left-3 top-3 right-3 flex justify-between">
        {university.ranking && <span className="rounded-lg bg-sakura-500/90 px-2 py-1 text-xs font-medium text-white">#{university.ranking}</span>}
        {showCompare && (
          <button
            type="button"
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              selected
                ? 'bg-sakura-500 text-white ring-2 ring-sakura-500/50'
                : 'bg-white/90 dark:bg-ink-950/90 text-ink-800 dark:text-ink-50 hover:bg-sakura-50/50'
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
    <Link href={`/universities/${university.id}`} className="block flex-1">
      <div className="p-4">
        <div className="flex flex-wrap gap-1.5 mb-2">
          {university.institutionType && <span className={`text-xs px-2 py-0.5 rounded-full ${typeColor}`}>{university.institutionType}</span>}
          {languageBadge && <span className={`text-xs px-2 py-0.5 rounded-full ${languageBadge.className}`}>{languageBadge.text}</span>}
          {intakeBadge && <span className={`text-xs px-2 py-0.5 rounded-full ${intakeBadge.className}`}>{intakeBadge.text}</span>}
          {university.programCount && <span className="text-xs px-2 py-0.5 rounded-full bg-ink-800/10 dark:bg-ink-50/10 text-ink-800/70 dark:text-ink-50/70">{university.programCount} programs</span>}
        </div>
        <h2 className="font-display text-lg font-semibold hover:text-sakura-500">{university.name}</h2>
        <p className="mt-1 text-sm text-ink-800/60 dark:text-ink-50/60">{university.cityName || 'Japan'}</p>
        <p className="mt-2 line-clamp-2 text-sm text-ink-800/70 dark:text-ink-50/70">{university.faculty || university.majorSpeciality || 'Explore programs and admissions information.'}</p>
        {university.tuitionFeeYearly && (
          <p className="mt-3 text-sm font-medium text-sakura-500">¥{university.tuitionFeeYearly.toLocaleString()}/year</p>
        )}
      </div>
    </Link>
  </article>
}
