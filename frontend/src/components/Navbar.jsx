import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

const links = [
  { to: '/universities', label: 'Universities' },
  { to: '/scholarships', label: 'Scholarships' },
  { to: '/admission', label: 'Admission' },
  { to: '/visa', label: 'Visa' },
  { to: '/student-life', label: 'Student Life' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { user, logout, isAdmin } = useAuth()
  const { dark, toggle } = useTheme()
  const navigate = useNavigate()

  const navClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${isActive ? 'text-sakura-500' : 'text-ink-800/70 dark:text-ink-50/70 hover:text-sakura-500'}`

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10"
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="font-display text-xl font-bold bg-gradient-to-r from-sakura-500 to-sakura-600 bg-clip-text text-transparent">
          JapanUni
        </Link>

        <motion.div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={navClass}>{l.label}</NavLink>
          ))}
        </motion.div>

        <motion.div className="hidden md:flex items-center gap-3">
          <button type="button" onClick={toggle} className="p-2 rounded-lg glass hover:bg-white/80 dark:hover:bg-ink-800/80" aria-label="Toggle theme">
            {dark ? '☀️' : '🌙'}
          </button>
          {user ? (
            <>
              <Link to="/dashboard" className="btn-secondary text-sm py-2 px-4">Dashboard</Link>
              {isAdmin && <Link to="/admin" className="text-sm text-sakura-500 font-medium">Admin</Link>}
              <button type="button" onClick={() => { logout(); navigate('/') }} className="text-sm text-ink-800/60 dark:text-ink-50/60 hover:text-sakura-500">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium hover:text-sakura-500">Login</Link>
              <Link to="/register" className="btn-primary text-sm py-2 px-4">Sign up</Link>
            </>
          )}
        </motion.div>

        <button type="button" className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
          <span className="text-2xl">{open ? '✕' : '☰'}</span>
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            className="md:hidden glass border-t border-white/10 px-4 py-4 flex flex-col gap-3"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} className={navClass} onClick={() => setOpen(false)}>{l.label}</NavLink>
            ))}
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setOpen(false)}>Dashboard</Link>
                {isAdmin && <Link to="/admin" onClick={() => setOpen(false)}>Admin</Link>}
                <button type="button" onClick={() => { logout(); setOpen(false); navigate('/') }}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)}>Login</Link>
                <Link to="/register" className="btn-primary text-center" onClick={() => setOpen(false)}>Sign up</Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
