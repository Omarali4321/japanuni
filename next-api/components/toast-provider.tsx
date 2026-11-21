'use client'

import { Toaster } from 'sonner'

export function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast: 'glass border border-white/10',
          description: 'text-ink-800/70 dark:text-ink-50/70',
          actionButton: 'bg-sakura-500 hover:bg-sakura-600',
          cancelButton: 'glass border border-white/10 hover:bg-white/10',
          closeButton: 'text-ink-800/50 dark:text-ink-50/50',
        },
      }}
    />
  )
}