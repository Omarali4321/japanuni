import { motion } from 'framer-motion'

export default function LoadingSpinner({ fullScreen = false }) {
  const spinner = (
    <motion.div
      className="flex flex-col items-center gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="w-12 h-12 rounded-full border-2 border-sakura-500 border-t-transparent"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      <p className="text-sm text-ink-800/60 dark:text-ink-50/60">Loading...</p>
    </motion.div>
  )

  if (fullScreen) {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {spinner}
      </motion.div>
    )
  }
  return <motion.div className="py-20 flex justify-center">{spinner}</motion.div>
}
