'use client'

import Link from 'next/link'
import { useCompare } from './compare-context'
import { motion, AnimatePresence } from 'framer-motion'

export function CompareBar() {
  const { selectedIds, selectionCount, canCompare, clearSelection, error, dismissError } = useCompare()

  if (selectionCount === 0 && !error) return null

  return (
    <>
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-content px-4"
            onClick={dismissError}
          >
            <div className="card border-accent/30 bg-warm-surface shadow-lg">
              <div className="flex items-center gap-4">
                <svg className="w-5 h-5 text-accent flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="font-sans text-sm text-ink">{error}</span>
                <button
                  type="button"
                  onClick={dismissError}
                  className="ml-auto text-accent hover:text-accent/80 font-semibold focus-visible-ring"
                  aria-label="Dismiss error"
                >
                  ×
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {selectionCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-full max-w-content px-4"
          >
            <div className="card shadow-lg">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="font-sans font-semibold text-ink">
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
                  className="btn-ghost self-end md:self-auto"
                  aria-label="Clear all selected universities"
                >
                  Clear all
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}