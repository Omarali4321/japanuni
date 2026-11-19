'use client'

import Link from 'next/link'
import { useCompare } from './compare-context'
import { motion, AnimatePresence } from 'framer-motion'

export function CompareBar() {
  const { selectedIds, selectionCount, canCompare, clearSelection } = useCompare()

  if (selectionCount === 0) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-7xl px-4"
      >
        <div className="glass-card rounded-2xl shadow-2xl border border-white/10 p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="font-semibold text-ink-800 dark:text-ink-50">
                {selectionCount} universit{selectionCount === 1 ? 'y' : 'ies'} selected
              </span>
              {canCompare && (
                <Link
                  href={`/compare?ids=${selectedIds.join(',')}`}
                  className="btn-primary whitespace-nowrap"
                >
                  Compare
                </Link>
              )}
            </div>
            <button
              type="button"
              onClick={clearSelection}
              className="text-sm text-ink-800/60 dark:text-ink-50/60 hover:text-sakura-500 transition-colors self-end md:self-auto"
              aria-label="Clear all selected universities"
            >
              Clear all
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}