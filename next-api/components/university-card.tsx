'use client'

import Link from 'next/link'
import { useCompare } from '@/components/compare-context'
import type { University } from '@/lib/web-api'

function getLanguageBadge(mediumOfInstruction: string | null) {
  if (!mediumOfInstruction) return null
  const lower = mediumOfInstruction.toLowerCase()
  if (lower.includes('japanese (100%)') && lower.includes('english (100%)')) {
    return { text: 'JP/EN', className: 'badge-language-both' }
  }
  if (lower.includes('japanese (100%)')) {
    return { text: 'Japanese', className: 'badge-language-jp' }
  }
  if (lower.includes('english (100%)')) {
    return { text: 'English', className: 'badge-language-en' }
  }
  return { text: 'Multiple', className: 'badge-language-both' }
}

function getIntakeBadge(intake: string | null) {
  if (!intake) return null
  const lower = intake.toLowerCase()
  if (lower.includes('april') && !lower.includes('october') && !lower.includes('september')) {
    return { text: 'Apr', className: 'badge-intake-apr' }
  }
  if (lower.includes('october') && !lower.includes('april') && !lower.includes('september')) {
    return { text: 'Oct', className: 'badge-intake-oct' }
  }
  if (lower.includes('september') && !lower.includes('april') && !lower.includes('october')) {
    return { text: 'Sep', className: 'badge-intake-sep' }
  }
  return { text: 'Multi', className: 'badge-intake-apr' }
}

function getTypeBadge(type: string | null) {
  if (!type) return null
  const lower = type.toLowerCase()
  if (lower === 'national') return { text: 'National', className: 'badge-type-national' }
  if (lower === 'public') return { text: 'Public', className: 'badge-type-public' }
  return { text: 'Private', className: 'badge-type-private' }
}

export function UniversityCard({ university, showCompare = true }: { university: University; showCompare?: boolean }) {
  const { selectedIds, toggleSelection, isSelected } = useCompare()
  const selected = isSelected(university.id)

  const languageBadge = getLanguageBadge(university.mediumOfInstruction)
  const intakeBadge = getIntakeBadge(university.intake)
  const typeBadge = getTypeBadge(university.institutionType)

  return (
    <article className="university-card">
      <div className="university-card-image relative">
        {university.images?.[0] ? (
          <img src={university.images[0]} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-soft-surface flex items-center justify-center">
            <span className="text-4xl">🏛️</span>
          </div>
        )}
        <div className="absolute top-3 left-3 right-3 flex justify-between">
          {university.ranking && (
            <span className="badge bg-accent text-on-accent">#{university.ranking}</span>
          )}
          {showCompare && (
            <button
              type="button"
              className={`compare-checkbox ${selected ? 'compare-checkbox-selected' : 'compare-checkbox-unselected'}`}
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
        <div className="university-card-content">
          <div className="university-card-badges">
            {typeBadge && <span className={`badge ${typeBadge.className}`}>{typeBadge.text}</span>}
            {languageBadge && <span className={`badge ${languageBadge.className}`}>{languageBadge.text}</span>}
            {intakeBadge && <span className={`badge ${intakeBadge.className}`}>{intakeBadge.text}</span>}
            {university.programCount && <span className="badge badge-count">{university.programCount} programs</span>}
          </div>
          <h2 className="university-card-title">{university.name}</h2>
          <p className="university-card-location">{university.cityName || 'Japan'}</p>
          <p className="university-card-description">{university.faculty || university.majorSpeciality || 'Explore programs and admissions information.'}</p>
          {university.tuitionFeeYearly && (
            <p className="university-card-tuition">¥{university.tuitionFeeYearly.toLocaleString()}/year</p>
          )}
        </div>
      </Link>
    </article>
  )
}
