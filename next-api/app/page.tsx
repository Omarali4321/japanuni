import Link from 'next/link'

export default function Page() {
  return <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
    <div className="glass-card mx-auto max-w-4xl text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sakura-500">Study in Japan</p>
      <h1 className="mt-4 font-display text-4xl font-bold md:text-6xl">Your journey to Japanese universities starts here</h1>
      <p className="mx-auto mt-5 max-w-2xl text-ink-800/70 dark:text-ink-50/70">Explore universities, compare programs, find scholarships, and plan your student life in Japan.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-4"><Link className="btn-primary" href="/universities">Explore Universities</Link><Link className="btn-secondary" href="/match">Find my match</Link></div>
    </div>
  </section>
}
