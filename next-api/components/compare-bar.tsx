'use client'

import { Link } from '@/i18n/navigation'
import { useCompare } from './compare-context'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'

export function CompareBar() {
  const t = useTranslations('CompareBar')
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
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-7xl px-4"
            onClick={dismissError}
          >
            <div className="glass-card rounded-2xl shadow-2xl border border-sakura-500/30 p-4 md:p-6 bg-sakura-50/80 dark:bg-sakura-900/20">
              <div className="flex items-center gap-4">
                <svg className="w-5 h-5 text-sakura-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-ink-800 dark:text-ink-50 text-sm">{error}</span>
                <button
                  type="button"
                  onClick={dismissError}
                  className="ml-auto text-sakura-500 hover:text-sakura-600 font-semibold"
                  aria-label={t('dismissError')}
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
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-full max-w-7xl px-4"
          >
            <div className="glass-card rounded-2xl shadow-2xl border border-white/10 p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="font-semibold text-ink-800 dark:text-ink-50">
                    {t('selected', { count: selectionCount })}
                  </span>
                  {canCompare && (
                    <Link
                      href={`/compare?ids=${selectedIds.join(',')}`}
                      className="btn-primary whitespace-nowrap"
                    >
                      {t('compare')}
                    </Link>
                  )}
                </div>
                <button
                  type="button"
                  onClick={clearSelection}
                  className="text-sm text-ink-800/60 dark:text-ink-50/60 hover:text-sakura-500 transition-colors self-end md:self-auto"
                  aria-label={t('clearAllLabel')}
                >
                  {t('clearAll')}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}