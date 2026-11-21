'use client'

import { Toaster } from 'sonner'

export function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast: 'card border-border shadow-lg',
          description: 'text-muted',
          actionButton: 'btn-primary',
          cancelButton: 'btn-secondary',
          closeButton: 'text-muted hover:text-ink',
        },
      }}
    />
  )
}