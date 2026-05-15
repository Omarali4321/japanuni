import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import SEO from '../components/SEO'
import LoadingSpinner from '../components/LoadingSpinner'
import ScrollReveal from '../components/ScrollReveal'
import { universityApi } from '../api/services'

export default function Compare() {
  const [searchParams] = useSearchParams()
  const [universities, setUniversities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const idsParam = searchParams.get('ids')
    if (!idsParam) {
      setError('Select at least 2 universities from the universities page')
      setLoading(false)
      return
    }
    const ids = idsParam.split(',').map(Number).filter(Boolean)
    if (ids.length < 2) {
      setError('Select at least 2 universities to compare')
      setLoading(false)
      return
    }
    universityApi.compare(ids)
      .then((res) => setUniversities(res.data))
      .catch(() => setError('Failed to load comparison'))
      .finally(() => setLoading(false))
  }, [searchParams])

  const rows = [
    { label: 'City', key: 'cityName' },
    { label: 'Ranking', key: 'ranking' },
    { label: 'Tuition/year', key: 'tuitionFeeYearly', format: (v) => v ? `¥${Number(v).toLocaleString()}` : '—' },
    { label: 'IELTS', key: 'ieltsRequirement' },
    { label: 'TOEFL', key: 'toeflRequirement' },
    { label: 'JLPT', key: 'jlptRequirement' },
    { label: 'Acceptance %', key: 'acceptanceRate' },
    { label: 'Living cost/mo', key: 'costOfLivingMonthly', format: (v) => v ? `¥${v.toLocaleString()}` : '—' },
  ]

  return (
    <>
      <SEO title="Compare Universities" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ScrollReveal>
          <Link to="/universities" className="text-sm text-sakura-500 hover:underline">← Back to universities</Link>
          <h1 className="section-title mt-4">Compare Universities</h1>
        </ScrollReveal>
        {loading ? <LoadingSpinner /> : error ? (
          <p className="glass-card mt-8 text-center">{error}</p>
        ) : (
          <ScrollReveal className="mt-8 overflow-x-auto">
            <table className="w-full glass rounded-2xl overflow-hidden text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="p-4 text-left font-medium">Criteria</th>
                  {universities.map((u) => (
                    <th key={u.id} className="p-4 text-left font-display font-semibold min-w-[180px]">
                      <Link to={`/universities/${u.id}`} className="hover:text-sakura-500">{u.name}</Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label} className="border-b border-white/5">
                    <td className="p-4 font-medium text-ink-800/60 dark:text-ink-50/60">{row.label}</td>
                    {universities.map((u) => (
                      <td key={u.id} className="p-4">
                        {row.format ? row.format(u[row.key]) : (u[row.key] ?? '—')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollReveal>
        )}
      </div>
    </>
  )
}
