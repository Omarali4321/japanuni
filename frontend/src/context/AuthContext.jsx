import { createContext, useContext, useEffect, useState } from 'react'
import { authApi, userApi } from '../api/services'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const apiMode = import.meta.env.VITE_API_MODE || 'next'
    const token = localStorage.getItem('token')
    if (apiMode === 'spring' && !token) {
      setLoading(false)
      return
    }
    userApi.getProfile()
      .then((res) => {
        setUser(res.data)
        localStorage.setItem('user', JSON.stringify(res.data))
      })
      .catch(() => {
        if (apiMode === 'spring') localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const login = async (email, password) => {
    const { data } = await authApi.login({ email, password })
    const apiMode = import.meta.env.VITE_API_MODE || 'next'
    if (apiMode === 'spring' && data.token) localStorage.setItem('token', data.token)
    const profile = { id: data.id, email: data.email, fullName: data.fullName, role: data.role }
    localStorage.setItem('user', JSON.stringify(profile))
    setUser(profile)
    return data
  }

  const register = async (email, password, fullName) => {
    const { data } = await authApi.register({ email, password, fullName })
    const apiMode = import.meta.env.VITE_API_MODE || 'next'
    if (apiMode === 'spring' && data.token) localStorage.setItem('token', data.token)
    const profile = { id: data.id, email: data.email, fullName: data.fullName, role: data.role }
    localStorage.setItem('user', JSON.stringify(profile))
    setUser(profile)
    return data
  }

  const logout = async () => {
    const apiMode = import.meta.env.VITE_API_MODE || 'next'
    if (apiMode === 'next') await authApi.logout()
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  const isAdmin = user?.role === 'ADMIN'

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
