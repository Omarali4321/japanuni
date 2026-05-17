import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import SEO from '../components/SEO'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register, user } = useAuth()
  const navigate = useNavigate()

  if (user) {
    navigate('/dashboard', { replace: true })
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) {
      setError('Passwords do not match')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setError('')
    setLoading(true)
    try {
      await register(form.email, form.password, form.fullName)
      navigate('/dashboard')
    } catch (err) {
      const errors = err.response?.data?.errors
      setError(errors ? Object.values(errors).join(', ') : err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SEO title="Register" />
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
        <motion.form
          onSubmit={handleSubmit}
          className="glass w-full max-w-md p-8 rounded-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-2xl font-bold text-white">Create account</h1>
          <p className="text-white/70 text-sm mt-2">Start planning your study journey in Japan</p>
          {error && <p className="mt-4 text-sm text-red-300">{error}</p>}
          <div className="mt-6 space-y-4">
            <input required placeholder="Full name" className="input-field" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
            <input type="email" required placeholder="Email" className="input-field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input type="password" required placeholder="Password (min 6)" className="input-field" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <input type="password" required placeholder="Confirm password" className="input-field" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full mt-6">
            {loading ? 'Creating...' : 'Create account'}
          </button>
          <p className="mt-6 text-center text-sm text-white/70">
            Already have an account? <Link to="/login" className="text-sakura-300 hover:underline">Login</Link>
          </p>
        </motion.form>
      </div>
    </>
  )
}
