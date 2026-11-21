'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useAuth } from './auth-provider'

export function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const router = useRouter()
  const { refresh } = useAuth()
  const [form, setForm] = useState({ email: '', password: '', fullName: '' })
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  async function submit(event: React.FormEvent) {
    event.preventDefault(); setPending(true); setError('')
    try {
      const response = await fetch(`/api/auth/${mode}`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const body = await response.json()
      if (!response.ok) throw new Error(body.error?.message || 'Authentication failed')
      await refresh(); router.push('/dashboard'); router.refresh()
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Authentication failed') } finally { setPending(false) }
  }
  return (
    <section className="mx-auto flex min-h-[calc(100vh-12rem)] max-w-md items-center px-4 py-12">
      <form onSubmit={submit} className="card w-full space-y-4">
        <h1 className="font-display text-3xl font-bold text-ink">{mode === 'login' ? 'Welcome back' : 'Create account'}</h1>
        <p className="text-sm text-muted">
          {mode === 'login'
            ? 'Sign in to save favorites and review universities.'
            : 'Start planning your study journey in Japan.'}
        </p>
        {error && <p className="rounded-lg bg-accent/10 p-3 text-sm text-accent">{error}</p>}
        {mode === 'register' && (
          <input
            className="input-field"
            required
            minLength={2}
            maxLength={100}
            placeholder="Full name"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          />
        )}
        <input
          className="input-field"
          required
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="input-field"
          required
          minLength={6}
          maxLength={100}
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="btn-primary w-full" disabled={pending}>
          {pending ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
        </button>
        <p className="text-center text-sm text-muted">
          {mode === 'login' ? (
            <>No account? <Link className="text-accent hover:underline" href="/register">Register</Link></>
          ) : (
            <>Already registered? <Link className="text-accent hover:underline" href="/login">Login</Link></>
          )}
        </p>
      </form>
    </section>
  )
}
