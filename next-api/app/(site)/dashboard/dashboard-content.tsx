'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ErrorState, LoadingState } from '@/components/public-states'
import { UniversityCard } from '@/components/university-card'
import { useAuth } from '@/components/auth-provider'
import { getFavorites, removeFavorite, updateProfile, type University } from '@/lib/web-api'

export default function DashboardContent() {
  const router = useRouter()
  const { user, loading, refresh } = useAuth()
  const [favorites, setFavorites] = useState<University[]>([])
  const [form, setForm] = useState({ fullName: '', bio: '', nationality: '', avatarUrl: '' })
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  useEffect(() => { if (!loading && !user) router.replace('/login') }, [loading, user, router])
  useEffect(() => { if (user) { setForm({ fullName: user.fullName || '', bio: user.bio || '', nationality: user.nationality || '', avatarUrl: user.avatarUrl || '' }); getFavorites().then(setFavorites).catch((reason) => setError(reason.message)) } }, [user])
  if (loading || !user) return <section className="mx-auto max-w-7xl px-4 py-16"><LoadingState /></section>
  async function save(event: React.FormEvent) { event.preventDefault(); setPending(true); setError(''); try { await updateProfile({ ...form, avatarUrl: form.avatarUrl || null }); await refresh() } catch (reason) { setError(reason instanceof Error ? reason.message : 'Could not save profile') } finally { setPending(false) } }
  async function remove(id: number) { try { await removeFavorite(id); setFavorites((items) => items.filter((item) => item.id !== id)) } catch (reason) { setError(reason instanceof Error ? reason.message : 'Could not remove favorite') } }
  return <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"><h1 className="section-title">Hello, {user.fullName}</h1><p className="mt-2 text-ink-800/60 dark:text-ink-50/60">Manage your profile and saved universities.</p>{error && <div className="mt-6"><ErrorState message={error} /></div>}<div className="mt-10 grid gap-8 lg:grid-cols-3"><form onSubmit={save} className="glass-card space-y-3"><h2 className="font-display text-xl font-semibold">Profile</h2><input className="input-field" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="Full name" /><input className="input-field" value={form.nationality} onChange={(e) => setForm({ ...form, nationality: e.target.value })} placeholder="Nationality" /><textarea className="input-field" rows={4} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Bio" /><input className="input-field" type="url" value={form.avatarUrl} onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })} placeholder="Avatar URL (optional)" /><button className="btn-primary w-full" disabled={pending}>{pending ? 'Saving...' : 'Save profile'}</button></form><div className="lg:col-span-2"><div className="mb-6 flex items-center justify-between"><h2 className="font-display text-2xl font-semibold">Saved universities ({favorites.length})</h2><Link className="text-sm text-sakura-500" href="/universities">Browse more</Link></div>{favorites.length ? <div className="grid gap-6 sm:grid-cols-2">{favorites.map((item) => <div key={item.id} className="relative"><UniversityCard university={item} /><button className="absolute right-3 top-3 rounded-lg bg-white/80 px-3 py-2 text-xs text-red-500" onClick={() => void remove(item.id)}>Remove</button></div>)}</div> : <div className="glass-card text-ink-800/60 dark:text-ink-50/60">No favorites yet. Explore universities and save your picks.</div>}</div></div></section>
}
