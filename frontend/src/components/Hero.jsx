import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Hero({ title, subtitle, cta, ctaLink = '/universities', badge }) {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,13,26,0.02),rgba(10,13,26,0.16)_44%,rgba(10,13,26,0.46)_100%)]" />
      <motion.div
        className="absolute inset-0 bg-[linear-gradient(120deg,rgba(224,75,111,0.10),transparent_48%,rgba(67,90,180,0.12))]"
        animate={{ opacity: [0.35, 0.62, 0.35] }}
        transition={{ duration: 9, repeat: Infinity }}
      />
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center text-white py-20 md:py-24">
        {badge && (
          <motion.span
            className="inline-block px-4 py-1.5 rounded-full bg-white/12 border border-white/20 backdrop-blur-xl text-sm font-medium mb-6 shadow-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {badge}
          </motion.span>
        )}
        <motion.h1
          className="font-display text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight drop-shadow-[0_4px_28px_rgba(0,0,0,0.52)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            className="mt-6 text-lg sm:text-xl md:text-2xl text-white/92 max-w-2xl mx-auto leading-relaxed font-medium drop-shadow-[0_3px_18px_rgba(0,0,0,0.48)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {subtitle}
          </motion.p>
        )}
        {cta && (
          <motion.div
            className="mt-10 flex flex-wrap gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link to={ctaLink} className="btn-primary">{cta}</Link>
            <Link to="/scholarships" className="btn-secondary text-white border-white/20">Scholarships</Link>
          </motion.div>
        )}
      </div>
    </section>
  )
}
