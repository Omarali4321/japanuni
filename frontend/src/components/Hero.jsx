import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Hero({ title, subtitle, cta, ctaLink = '/universities', badge }) {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-hero-gradient">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sakura-500/20 rounded-full blur-3xl" />
        <motion.div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 8, repeat: Infinity }} />
      </div>
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white py-24">
        {badge && (
          <motion.span
            className="inline-block px-4 py-1.5 rounded-full glass text-sm mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {badge}
          </motion.span>
        )}
        <motion.h1
          className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            className="mt-6 text-lg sm:text-xl text-white/80 max-w-2xl mx-auto"
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
