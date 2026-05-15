import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import SEO from '../components/SEO'
import Hero from '../components/Hero'
import UniversityCard from '../components/UniversityCard'
import LoadingSpinner from '../components/LoadingSpinner'
import ScrollReveal from '../components/ScrollReveal'
import { universityApi, cityApi } from '../api/services'
import { useAuth } from '../context/AuthContext'
import { favoriteApi } from '../api/services'

export default function Universities() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { user } = useAuth()
  const [universities, setUniversities] = useState([])
  const [cities, setCities] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(0)
  const [compareIds, setCompareIds] = useState([])
  const [loadError, setLoadError] = useState('')

  const search = searchParams.get('search') || ''
  const cityId = searchParams.get('cityId') || ''
  const page = parseInt(searchParams.get('page') || '0', 10)

  useEffect(() => {
    cityApi.list().then((r) => setCities(r.data)).catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    setLoadError('')
    const params = { page, size: 12 }
    if (search) params.search = search
    if (cityId) params.cityId = cityId
    universityApi.search(params)
      .then((res) => {
        setUniversities(res.data.content)
        setTotalPages(res.data.totalPages)
      })
      .catch(() => {
        setUniversities([])
        setLoadError('Could not load universities. Make sure the backend is running (docker compose up -d).')
      })
      .finally(() => setLoading(false))
  }, [search, cityId, page])

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    next.set('page', '0')
    setSearchParams(next)
  }

  const toggleCompare = (id) => {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 4 ? [...prev, id] : prev
    )
  }

  const handleFavorite = async (uni) => {
    if (!user) return
    try {
      if (uni.favorited) await favoriteApi.remove(uni.id)
      else await favoriteApi.add(uni.id)
      setUniversities((list) =>
        list.map((u) => (u.id === uni.id ? { ...u, favorited: !u.favorited } : u))
      )
    } catch { /* ignore */ }
  }

  return (
    <>
      <SEO title="Universities" description="Browse Japanese universities with rankings, fees, and language requirements." />
      <Hero title="Japanese Universities" subtitle="Search and filter by city, tuition, and ranking." badge="6+ institutions" cta={null} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ScrollReveal>
          <div className="glass-card flex flex-col md:flex-row gap-4 mb-8">
            <input
              type="search"
              placeholder="Search universities..."
              className="input-field flex-1"
              defaultValue={search}
              onKeyDown={(e) => e.key === 'Enter' && updateParam('search', e.target.value)}
            />
            <select
              className="input-field md:w-48"
              value={cityId}
              onChange={(e) => updateParam('cityId', e.target.value)}
            >
              <option value="">All cities</option>
              {cities.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {compareIds.length >= 2 && (
              <a href={`/compare?ids=${compareIds.join(',')}`} className="btn-primary whitespace-nowrap">
                Compare ({compareIds.length})
              </a>
            )}
          </div>
        </ScrollReveal>

        {loadError && (
          <p className="glass-card text-center text-red-500 dark:text-red-400 mb-6">{loadError}</p>
        )}

        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {universities.map((u, i) => (
                <div key={u.id} className="relative">
                  <UniversityCard university={u} index={i} showFavorite={!!user} onFavorite={handleFavorite} />
                  <label className="absolute bottom-4 right-4 flex items-center gap-2 text-xs glass px-2 py-1 rounded-lg cursor-pointer">
                    <input type="checkbox" checked={compareIds.includes(u.id)} onChange={() => toggleCompare(u.id)} />
                    Compare
                  </label>
                </div>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                <button type="button" disabled={page === 0} className="btn-secondary" onClick={() => updateParam('page', String(page - 1))}>Prev</button>
                <span className="px-4 py-2 glass rounded-xl">Page {page + 1} / {totalPages}</span>
                <button type="button" disabled={page >= totalPages - 1} className="btn-secondary" onClick={() => updateParam('page', String(page + 1))}>Next</button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}
