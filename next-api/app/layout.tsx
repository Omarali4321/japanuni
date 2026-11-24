import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { ToastProvider } from '@/components/toast-provider'
import { SITE_URL } from '@/lib/site'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'JapanUni',
  description: 'Explore Japanese universities, scholarships, and study abroad resources.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-white text-ink-900 dark:bg-ink-950 dark:text-ink-50 transition-colors duration-300">
        <ThemeProvider><ToastProvider />{children}</ThemeProvider>
      </body>
    </html>
  )
}
