import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-white/10 glass">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="font-display text-xl font-bold text-sakura-500">JapanUni</Link>
            <p className="mt-3 max-w-md text-sm text-ink-800/60 dark:text-ink-50/60">Your gateway to studying in Japan. Explore universities, scholarships, visa guides, and student life.</p>
          </div>
          <div><h4 className="mb-3 font-semibold">Explore</h4><div className="space-y-2 text-sm text-ink-800/60 dark:text-ink-50/60"><Link className="block hover:text-sakura-500" href="/universities">Universities</Link><Link className="block hover:text-sakura-500" href="/match">Smart Match</Link><Link className="block hover:text-sakura-500" href="/scholarships">Scholarships</Link></div></div>
          <div><h4 className="mb-3 font-semibold">Resources</h4><div className="space-y-2 text-sm text-ink-800/60 dark:text-ink-50/60"><Link className="block hover:text-sakura-500" href="/admission">Admission Guide</Link><Link className="block hover:text-sakura-500" href="/visa">Visa Guide</Link><Link className="block hover:text-sakura-500" href="/student-life">Student Life</Link></div></div>
        </div>
        <p className="mt-10 text-center text-xs text-ink-800/40 dark:text-ink-50/40">© {new Date().getFullYear()} JapanUni. Built for students dreaming of Japan.</p>
      </div>
    </footer>
  )
}
