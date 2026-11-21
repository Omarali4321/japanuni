export function RoutePlaceholder({ title }: { title: string }) {
  return (
    <section className="mx-auto max-w-content px-4 py-16 sm:px-6 lg:px-8">
      <div className="card">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">JapanUni</p>
        <h1 className="section-title mt-3">{title}</h1>
        <p className="mt-3 text-muted">This page is being migrated to the Next.js same-origin UI. The API foundation is ready.</p>
      </div>
    </section>
  )
}
