import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { ToastProvider } from '@/components/toast-provider'
import { SITE_URL } from '@/lib/site'
import { routing } from '@/i18n/routing'
import { OG_LOCALES } from '@/lib/seo'

const inter = Inter({
  subsets: ['latin', 'latin-ext', 'cyrillic', 'cyrillic-ext'],
  display: 'swap',
  variable: '--font-inter',
})

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params
  const t = await getTranslations({ locale, namespace: 'Meta' })
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: 'JapanUni', template: '%s | JapanUni' },
    description: t('description'),
    openGraph: { siteName: 'JapanUni', locale: OG_LOCALES[locale] ?? 'en_US', type: 'website' },
  }
}

export default function LocaleLayout({ children, params }: Readonly<{ children: React.ReactNode; params: { locale: string } }>) {
  const { locale } = params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)
  return (
    <html lang={locale} className={inter.variable}>
      <body className="font-sans antialiased bg-white text-ink-900 dark:bg-ink-950 dark:text-ink-50 transition-colors duration-300">
        <NextIntlClientProvider>
          <ThemeProvider><ToastProvider />{children}</ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
