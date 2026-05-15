import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getUniversityImage, getUniversityImageFallback } from '../utils/universityImages'

export default function UniversityCard({ university, index = 0, onFavorite, showFavorite = false }) {
  const [imgSrc, setImgSrc] = useState(() => getUniversityImage(university))

  useEffect(() => {
    setImgSrc(getUniversityImage(university))
  }, [university])

  const handleImageError = () => {
    const fallback = getUniversityImageFallback(university.name)
    if (imgSrc !== fallback) setImgSrc(fallback)
  }

  return (
    <motion.article
      className="glass-card group overflow-hidden p-0 relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4 }}
    >
      <Link to={`/universities/${university.id}`} className="block">
        <motion.div className="relative h-44 overflow-hidden rounded-t-2xl bg-ink-800/20 dark:bg-ink-900/40">
          <img
            src={imgSrc}
            alt={university.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={handleImageError}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 to-transparent" />
          {university.ranking && (
            <span className="absolute top-3 left-3 px-2 py-1 text-xs font-medium rounded-lg bg-sakura-500/90 text-white">
              #{university.ranking}
            </span>
          )}
        </motion.div>
        <div className="p-5">
          <h3 className="font-display font-semibold text-lg group-hover:text-sakura-500 transition-colors">{university.name}</h3>
          <p className="text-sm text-ink-800/60 dark:text-ink-50/60 mt-1">{university.cityName}</p>
          <div className="flex flex-wrap gap-2 mt-3 text-xs">
            {university.ieltsRequirement && <span className="px-2 py-1 rounded-md glass">IELTS {university.ieltsRequirement}</span>}
            {university.jlptRequirement && <span className="px-2 py-1 rounded-md glass">JLPT {university.jlptRequirement}</span>}
          </div>
          {university.tuitionFeeYearly && (
            <p className="mt-3 text-sm font-medium">¥{Number(university.tuitionFeeYearly).toLocaleString()}/year</p>
          )}
        </div>
      </Link>
      {showFavorite && onFavorite && (
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); onFavorite(university) }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full glass flex items-center justify-center text-lg hover:scale-110 transition-transform z-10"
          aria-label="Toggle favorite"
        >
          {university.favorited ? '❤️' : '🤍'}
        </button>
      )}
    </motion.article>
  )
}
