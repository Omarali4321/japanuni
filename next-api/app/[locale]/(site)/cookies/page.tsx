import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { seoAlternates } from '@/lib/seo'

type Props = { params: { locale: string } }

export async function generateMetadata({ params: { locale } }: Props) {
  const t = await getTranslations({ locale, namespace: 'Cookies' })
  return { title: t('title'), description: t('metaDescription'), alternates: seoAlternates(locale, '/cookies') }
}

const BROWSERS = [
  ['Chrome', 'https://support.google.com/chrome/answer/95647'],
  ['Firefox', 'https://support.mozilla.org/en-US/kb/cookies'],
  ['Safari', 'https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac'],
  ['Edge', 'https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09'],
] as const

export default async function CookiesPage({ params: { locale } }: Props) {
  setRequestLocale(locale)
  const t = await getTranslations('Cookies')
  const format = await getFormatter()
  const updated = format.dateTime(new Date(Date.UTC(2024, 10, 1)), { month: 'long', year: 'numeric', timeZone: 'UTC' })
  const h2 = 'text-2xl font-semibold text-ink-950 dark:text-ink-50'
  const h3 = 'text-xl font-medium text-ink-950 dark:text-ink-50 mt-4 mb-2'
  const rows = [
    ['next-auth.callback-url', 'pCallback', 'dSession'],
    ['next-auth.csrf-token', 'pCsrf', 'dSession'],
    ['theme', 'pTheme', 'dYear'],
    ['NEXT_LOCALE', 'pLocale', 'dYear'],
  ] as const
  return (
    <main className="min-h-screen bg-sakura-50 dark:bg-ink-950">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-ink-950 dark:text-ink-50 mb-4">{t('title')}</h1>
          <p className="text-lg text-ink-600 dark:text-ink-400">{t('updated', { date: updated })}</p>
        </header>

        <div className="prose prose-ink dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className={h2}>1. {t('s1')}</h2>
            <p>{t('s1b')}</p>
          </section>

          <section>
            <h2 className={h2}>2. {t('s2')}</h2>
            <h3 className={h3}>{t('essential')}</h3>
            <p>{t('essentialText')}</p>
            <h3 className={h3}>{t('analytics')}</h3>
            <p>{t('analyticsText')}</p>
            <h3 className={h3}>{t('preference')}</h3>
            <p>{t('preferenceText')}</p>
          </section>

          <section>
            <h2 className={h2}>3. {t('s3')}</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-ink-200 dark:border-ink-700">
                    <th className="text-left p-3 font-semibold">{t('thName')}</th>
                    <th className="text-left p-3 font-semibold">{t('thPurpose')}</th>
                    <th className="text-left p-3 font-semibold">{t('thDuration')}</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(([name, purpose, duration]) => (
                    <tr key={name} className="border-b border-ink-100 dark:border-ink-800">
                      <td className="p-3 font-mono text-sm">{name}</td>
                      <td className="p-3">{t(purpose)}</td>
                      <td className="p-3">{t(duration)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className={h2}>4. {t('s4')}</h2>
            <p>{t('s4b')}</p>
          </section>

          <section>
            <h2 className={h2}>5. {t('s5')}</h2>
            <p>{t('s5b')}</p>
            <ul>
              {BROWSERS.map(([name, href]) => (
                <li key={name}><a href={href} target="_blank" rel="noopener noreferrer" className="text-sakura-600 hover:underline">{name}</a></li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className={h2}>6. {t('s6')}</h2>
            <p>{t('s6b')}</p>
          </section>

          <section>
            <h2 className={h2}>7. {t('s7')}</h2>
            <p>{t('s7b')}</p>
          </section>

          <section>
            <h2 className={h2}>8. {t('s8')}</h2>
            <p>{t.rich('s8b', { contact: (chunks) => <Link href="/contact" className="text-sakura-600 hover:underline">{chunks}</Link> })}</p>
          </section>
        </div>
      </div>
    </main>
  )
}
