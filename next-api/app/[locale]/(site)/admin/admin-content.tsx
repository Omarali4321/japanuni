'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { useApiError } from '@/lib/use-api-error'
import { ApiError } from '@/lib/web-api'
import { useAuth } from '@/components/auth-provider'
import { ErrorState, LoadingState } from '@/components/public-states'

type Stats = { users: number; universities: number; scholarships: number; reviews: number; favorites: number }
type AdminUser = { id: number; email: string; fullName: string; role: 'USER' | 'ADMIN'; createdAt: string; reviews: number; favorites: number }
type AdminReview = { id: number; rating: number; comment: string | null; userName: string; userEmail: string; universityId: number; universityName: string; createdAt: string }
type AdminMessage = { id: number; name: string; email: string; subject: string; message: string; createdAt: string }
type Tab = 'overview' | 'users' | 'reviews' | 'messages'

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, { credentials: 'include', cache: 'no-store', ...init })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new ApiError(body.error?.code, body.error?.message ?? 'Request failed')
  return body as T
}

const shell = 'mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8'
const muted = 'text-ink-800/60 dark:text-ink-50/60'

export default function AdminContent() {
  const router = useRouter()
  const t = useTranslations('Admin')
  const apiError = useApiError()
  const { user, loading } = useAuth()
  const [tab, setTab] = useState<Tab>('overview')
  const [stats, setStats] = useState<Stats | null>(null)
  const [users, setUsers] = useState<AdminUser[] | null>(null)
  const [reviews, setReviews] = useState<AdminReview[] | null>(null)
  const [messages, setMessages] = useState<AdminMessage[] | null>(null)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')

  const isAdmin = user?.role === 'ADMIN'
  const fail = useCallback((reason: unknown) => setError(apiError(reason)), [apiError])

  useEffect(() => {
    if (!loading && !user) { router.replace('/login'); return }
    if (!isAdmin) return
    api<Stats>('/api/admin/stats').then(setStats).catch(fail)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user, router])

  useEffect(() => {
    if (!isAdmin) return
    if (tab === 'users' && !users) api<{ data: AdminUser[] }>('/api/admin/users').then((r) => setUsers(r.data)).catch(fail)
    if (tab === 'messages' && !messages) api<{ data: AdminMessage[] }>('/api/admin/messages').then((r) => setMessages(r.data)).catch(fail)
    if (tab === 'reviews' && !reviews) api<{ data: AdminReview[] }>('/api/admin/reviews').then((r) => setReviews(r.data)).catch(fail)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, isAdmin])

  if (loading || !user) return <section className={shell}><LoadingState /></section>
  if (!isAdmin) return <section className={shell}><ErrorState message={t('accessRequired')} /></section>

  const run = async (action: () => Promise<void>) => {
    setError('')
    try { await action() } catch (reason) { fail(reason) }
  }

  const setRole = (target: AdminUser, role: 'USER' | 'ADMIN') => run(async () => {
    await api(`/api/admin/users/${target.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ role }) })
    setUsers((list) => list?.map((u) => (u.id === target.id ? { ...u, role } : u)) ?? null)
  })

  const removeUser = (target: AdminUser) => {
    if (!window.confirm(t('confirmDeleteUser', { email: target.email }))) return
    return run(async () => {
      await api(`/api/admin/users/${target.id}`, { method: 'DELETE' })
      setUsers((list) => list?.filter((u) => u.id !== target.id) ?? null)
      setReviews(null)
      setStats((s) => (s ? { ...s, users: s.users - 1, reviews: s.reviews - target.reviews, favorites: s.favorites - target.favorites } : s))
    })
  }

  const removeReview = (target: AdminReview) => {
    if (!window.confirm(t('confirmDeleteReview'))) return
    return run(async () => {
      await api(`/api/admin/reviews/${target.id}`, { method: 'DELETE' })
      setReviews((list) => list?.filter((r) => r.id !== target.id) ?? null)
      setStats((s) => (s ? { ...s, reviews: s.reviews - 1 } : s))
    })
  }

  const removeMessage = (target: AdminMessage) => {
    if (!window.confirm(t('confirmDeleteMessage'))) return
    return run(async () => {
      await api(`/api/admin/messages/${target.id}`, { method: 'DELETE' })
      setMessages((list) => list?.filter((m) => m.id !== target.id) ?? null)
    })
  }

  const q = query.trim().toLowerCase()
  const shownUsers = users?.filter((u) => !q || u.email.toLowerCase().includes(q) || u.fullName.toLowerCase().includes(q))
  const shownReviews = reviews?.filter((r) => !q || r.universityName.toLowerCase().includes(q) || r.userEmail.toLowerCase().includes(q) || (r.comment ?? '').toLowerCase().includes(q))
  const shownMessages = messages?.filter((m) => !q || m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.message.toLowerCase().includes(q))
  const date = (iso: string) => new Date(iso).toLocaleDateString()

  const cards: [string, number | undefined][] = [
    [t('users'), stats?.users], [t('universities'), stats?.universities], [t('scholarships'), stats?.scholarships],
    [t('reviews'), stats?.reviews], [t('favorites'), stats?.favorites],
  ]
  const tabs: Tab[] = ['overview', 'users', 'reviews', 'messages']
  const btn = 'rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-soft-surface disabled:opacity-40'

  return (
    <section className={shell}>
      <h1 className="section-title">{t('title')}</h1>
      <p className={`mt-2 ${muted}`}>{t('intro')}</p>

      <div className="mt-8 flex flex-wrap items-center gap-2 border-b border-border pb-3">
        {tabs.map((id) => (
          <button
            key={id}
            onClick={() => { setTab(id); setQuery(''); setError('') }}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${tab === id ? 'bg-sakura-500 text-white' : `${muted} hover:bg-soft-surface`}`}
          >
            {t(`tab_${id}`)}
          </button>
        ))}
        {tab !== 'overview' && (
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('search')}
            className="ml-auto w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm sm:w-64"
          />
        )}
      </div>

      {error && <div className="mt-6"><ErrorState message={error} /></div>}

      {tab === 'overview' && (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {cards.map(([label, value]) => (
            <div className="glass-card text-center" key={label}>
              <p className="font-display text-4xl font-bold text-sakura-500">{value ?? '…'}</p>
              <p className={`mt-2 text-sm ${muted}`}>{label}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 'users' && (shownUsers ? (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className={`text-xs uppercase ${muted}`}>
              <tr>
                <th className="py-2 pr-4">{t('name')}</th><th className="pr-4">Email</th><th className="pr-4">{t('role')}</th>
                <th className="pr-4">{t('reviews')}</th><th className="pr-4">{t('favorites')}</th><th className="pr-4">{t('joined')}</th><th />
              </tr>
            </thead>
            <tbody>
              {shownUsers.map((u) => {
                const self = u.id === Number(user.id)
                return (
                  <tr key={u.id} className="border-t border-border">
                    <td className="py-3 pr-4 font-medium">{u.fullName}</td>
                    <td className="pr-4">{u.email}</td>
                    <td className="pr-4">{u.role}</td>
                    <td className="pr-4">{u.reviews}</td>
                    <td className="pr-4">{u.favorites}</td>
                    <td className="pr-4">{date(u.createdAt)}</td>
                    <td className="space-x-2 whitespace-nowrap text-right">
                      <button className={btn} disabled={self} onClick={() => setRole(u, u.role === 'ADMIN' ? 'USER' : 'ADMIN')}>
                        {u.role === 'ADMIN' ? t('makeUser') : t('makeAdmin')}
                      </button>
                      <button className={`${btn} text-accent`} disabled={self} onClick={() => removeUser(u)}>{t('delete')}</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {shownUsers.length === 0 && <p className={`py-6 text-center ${muted}`}>{t('empty')}</p>}
        </div>
      ) : !error && <div className="mt-6"><LoadingState /></div>)}

      {tab === 'reviews' && (shownReviews ? (
        <div className="mt-6 space-y-3">
          {shownReviews.map((r) => (
            <div key={r.id} className="glass-card flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="font-medium">{r.universityName} <span className="text-sakura-500">{'★'.repeat(r.rating)}</span></p>
                <p className={`mt-1 text-xs ${muted}`}>{r.userName} · {r.userEmail} · {date(r.createdAt)}</p>
                {r.comment && <p className="mt-2 whitespace-pre-wrap break-words text-sm">{r.comment}</p>}
              </div>
              <button className={`${btn} shrink-0 text-accent`} onClick={() => removeReview(r)}>{t('delete')}</button>
            </div>
          ))}
          {shownReviews.length === 0 && <p className={`py-6 text-center ${muted}`}>{t('empty')}</p>}
        </div>
      ) : !error && <div className="mt-6"><LoadingState /></div>)}

      {tab === 'messages' && (shownMessages ? (
        <div className="mt-6 space-y-3">
          {shownMessages.map((m) => (
            <div key={m.id} className="glass-card flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="font-medium">{m.name} · <a className="text-sakura-500 hover:underline" href={`mailto:${m.email}`}>{m.email}</a></p>
                <p className={`mt-1 text-xs ${muted}`}>{t(`topic_${m.subject}`)} · {date(m.createdAt)}</p>
                <p className="mt-2 whitespace-pre-wrap break-words text-sm">{m.message}</p>
              </div>
              <button className={`${btn} shrink-0 text-accent`} onClick={() => removeMessage(m)}>{t('delete')}</button>
            </div>
          ))}
          {shownMessages.length === 0 && <p className={`py-6 text-center ${muted}`}>{t('empty')}</p>}
        </div>
      ) : !error && <div className="mt-6"><LoadingState /></div>)}
    </section>
  )
}
