import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { ToastProvider } from '@/components/toast-provider'

export const metadata: Metadata = {
  title: 'JapanUni',
  description: 'Explore Japanese universities, scholarships, and study abroad resources.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><ThemeProvider><ToastProvider />{children}</ThemeProvider></body></html>
}
