import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide opacity-60">404</p>
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="opacity-70">The page you are looking for does not exist or was moved.</p>
      <Link href="/" className="btn-primary">Back to home</Link>
    </main>
  )
}
