import { getFormatter, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

/** Static legal text page. Messages live in `${namespace}.s{n}.title|body`; body may contain <contact> / <cookies> link tags. */
export async function LegalPage({ namespace, sections }: { namespace: 'Privacy' | 'Terms'; sections: number }) {
  const t = await getTranslations(namespace)
  const format = await getFormatter()
  const updated = format.dateTime(new Date(Date.UTC(2024, 10, 1)), { month: 'long', year: 'numeric', timeZone: 'UTC' })
  const link = (href: '/contact' | '/cookies') => (chunks: React.ReactNode) => (
    <Link href={href} className="text-sakura-600 hover:underline">{chunks}</Link>
  )
  return (
    <main className="min-h-screen bg-sakura-50 dark:bg-ink-950">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-ink-950 dark:text-ink-50 mb-4">{t('title')}</h1>
          <p className="text-lg text-ink-600 dark:text-ink-400">{t('updated', { date: updated })}</p>
        </header>
        <div className="prose prose-ink dark:prose-invert max-w-none space-y-8">
          {Array.from({ length: sections }, (_, i) => i + 1).map((n) => (
            <section key={n}>
              <h2 className="text-2xl font-semibold text-ink-950 dark:text-ink-50">{n}. {t(`s${n}.title`)}</h2>
              <p>{t.rich(`s${n}.body`, { contact: link('/contact'), cookies: link('/cookies') })}</p>
            </section>
          ))}
        </div>
      </div>
    </main>
  )
}
