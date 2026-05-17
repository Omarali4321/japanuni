import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import SEO from '../components/SEO'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard'

  if (user) {
    navigate(from, { replace: true })
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SEO title="Login" />
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
        <motion.form
          onSubmit={handleSubmit}
          className="glass w-full max-w-md p-8 rounded-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-2xl font-bold text-white">Welcome back</h1>
          <p className="text-white/70 text-sm mt-2">Sign in to save favorites and compare universities</p>
          {error && <p className="mt-4 text-sm text-red-300">{error}</p>}
          <div className="mt-6 space-y-4">
            <input type="email" required placeholder="Email" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" required placeholder="Password" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full mt-6">
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
          <p className="mt-6 text-center text-sm text-white/70">
            No account? <Link to="/register" className="text-sakura-300 hover:underline">Register</Link>
          </p>
          <p className="mt-4 text-xs text-white/50 text-center">Demo: student@japanuni.com / student123</p>
        </motion.form>
      </div>
    </>
  )
}
