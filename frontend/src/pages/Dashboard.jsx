import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import LoadingSpinner from '../components/LoadingSpinner'
import ScrollReveal from '../components/ScrollReveal'
import UniversityCard from '../components/UniversityCard'
import { favoriteApi, userApi } from '../api/services'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user, setUser } = useAuth()
  const [favorites, setFavorites] = useState([])
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [edit, setEdit] = useState(false)
  const [form, setForm] = useState({ fullName: '', bio: '', nationality: '' })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    Promise.all([favoriteApi.list(), userApi.getProfile()])
      .then(([favRes, profRes]) => {
        setFavorites(favRes.data)
        setProfile(profRes.data)
        setForm({
          fullName: profRes.data.fullName || '',
          bio: profRes.data.bio || '',
          nationality: profRes.data.nationality || '',
        })
      })
      .finally(() => setLoading(false))
  }, [])

  const saveProfile = async (e) => {
    e.preventDefault()
    const { data } = await userApi.updateProfile(form)
    setProfile(data)
    setUser({ ...user, fullName: data.fullName })
    localStorage.setItem('user', JSON.stringify({ ...user, fullName: data.fullName }))
    setEdit(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const removeFavorite = async (id) => {
    await favoriteApi.remove(id)
    setFavorites((list) => list.filter((u) => u.id !== id))
  }

  if (loading) return <LoadingSpinner fullScreen />

  return (
    <>
      <SEO title="Dashboard" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ScrollReveal>
          <h1 className="section-title">Hello, {profile?.fullName || user?.fullName}</h1>
          <p className="text-ink-800/60 dark:text-ink-50/60 mt-2">Manage your profile and saved universities</p>
        </ScrollReveal>

        <div className="grid lg:grid-cols-3 gap-8 mt-10">
          <ScrollReveal className="lg:col-span-1">
            <div className="glass-card">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-display font-semibold">Profile</h2>
                <button type="button" onClick={() => setEdit(!edit)} className="text-sm text-sakura-500">
                  {edit ? 'Cancel' : 'Edit'}
                </button>
              </div>
              {edit ? (
                <form onSubmit={saveProfile} className="space-y-3">
                  <input className="input-field" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
                  <input className="input-field" placeholder="Nationality" value={form.nationality} onChange={(e) => setForm({ ...form, nationality: e.target.value })} />
                  <textarea className="input-field" rows={3} placeholder="Bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
                  <button type="submit" className="btn-primary w-full">Save</button>
                </form>
              ) : (
                <dl className="text-sm space-y-2">
                  <div><dt className="text-ink-800/50">Email</dt><dd>{profile?.email}</dd></div>
                  <div><dt className="text-ink-800/50">Nationality</dt><dd>{profile?.nationality || '—'}</dd></div>
                  <div><dt className="text-ink-800/50">Bio</dt><dd>{profile?.bio || '—'}</dd></div>
                </dl>
              )}
              {saved && <p className="text-sm text-green-500 mt-2">Profile saved!</p>}
            </div>
          </ScrollReveal>

          <ScrollReveal className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display font-semibold text-xl">Saved universities ({favorites.length})</h2>
              <Link to="/universities" className="text-sm text-sakura-500">Browse more</Link>
            </div>
            {favorites.length === 0 ? (
              <p className="glass-card text-ink-800/60 dark:text-ink-50/60">No favorites yet. Explore universities and save your picks.</p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {favorites.map((u, i) => (
                  <div key={u.id} className="relative">
                    <UniversityCard university={{ ...u, favorited: true }} index={i} />
                    <button type="button" onClick={() => removeFavorite(u.id)} className="absolute top-2 right-2 text-xs glass px-2 py-1 rounded-lg hover:text-red-400">
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </ScrollReveal>
        </div>
      </div>
    </>
  )
}
