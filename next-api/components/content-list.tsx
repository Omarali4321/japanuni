'use client'

import { useEffect, useState } from 'react'
import { ErrorState, LoadingState } from './public-states'
import { listContent } from '@/lib/web-api'

export function ContentList({ path, title, description, kind }: { path: string; title: string; description: string; kind: 'admission' | 'visa' | 'student' }) {
  const [items, setItems] = useState<Array<Record<string, unknown>> | null>(null)
  const [error, setError] = useState('')
  useEffect(() => { listContent(path).then(setItems).catch((reason) => setError(reason.message)) }, [path])
  return <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"><h1 className="section-title">{title}</h1><p className="mt-2 text-ink-800/60 dark:text-ink-50/60">{description}</p>{error ? <div className="mt-8"><ErrorState message={error} /></div> : !items ? <div className="mt-8"><LoadingState /></div> : items.length === 0 ? <div className="glass-card mt-8 text-center text-ink-800/60 dark:text-ink-50/60">No content has been published yet.</div> : <div className="mt-8 grid gap-6 md:grid-cols-3">{items.map((item) => <article className="glass-card" key={String(item.id)}>{kind === 'student' && typeof item.imageUrl === 'string' && item.imageUrl ? <img src={item.imageUrl} alt="" className="mb-5 h-40 w-full rounded-xl object-cover" /> : null}<p className="text-xs font-semibold uppercase tracking-wider text-sakura-500">{String(item.category || item.visaType || '')}</p><h2 className="mt-2 font-display text-xl font-semibold">{String(item.title)}</h2><p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink-800/75 dark:text-ink-50/75">{String(item.content)}</p></article>)}</div>}</section>
}
