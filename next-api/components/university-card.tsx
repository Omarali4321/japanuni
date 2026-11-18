import Link from 'next/link'
import type { University } from '@/lib/web-api'

export function UniversityCard({ university }: { university: University }) {
  return <article className="glass-card overflow-hidden p-0">
    <Link href={`/universities/${university.id}`} className="block">
      <div className="relative h-44 bg-ink-800/30">
        {university.images[0] && <img src={university.images[0]} alt="" className="h-full w-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 to-transparent" />
        {university.ranking && <span className="absolute left-3 top-3 rounded-lg bg-sakura-500/90 px-2 py-1 text-xs font-medium text-white">#{university.ranking}</span>}
      </div>
      <div className="p-5">
        <h2 className="font-display text-lg font-semibold hover:text-sakura-500">{university.name}</h2>
        <p className="mt-1 text-sm text-ink-800/60 dark:text-ink-50/60">{university.cityName || university.institutionType || 'Japan'}</p>
        <p className="mt-3 line-clamp-2 text-sm text-ink-800/70 dark:text-ink-50/70">{university.programs || university.majorSpeciality || 'Explore programs and admissions information.'}</p>
      </div>
    </Link>
  </article>
}
