import { SiteFooter } from './site-footer'
import { SiteNavbar } from './site-navbar'
import { AuthProvider } from './auth-provider'
import { CompareProvider } from './compare-context'
import { PageTransition } from '@/components/ui/Motion'
import { CompareBar } from './compare-bar'

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CompareProvider>
        <div className="relative isolate flex min-h-screen flex-col">
          <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(232,93,138,0.2),transparent_35%),linear-gradient(135deg,#080a0f_0%,#10182b_48%,#23152e_100%)]" />
          <SiteNavbar />
          <main className="relative z-0 flex-1 pt-16">
            <PageTransition>{children}</PageTransition>
          </main>
          <CompareBar />
          <SiteFooter />
        </div>
      </CompareProvider>
    </AuthProvider>
  )
}
