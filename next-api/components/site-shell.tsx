'use client'

import { SiteFooter } from './site-footer'
import { SiteNavbar } from './site-navbar'
import { AuthProvider } from './auth-provider'
import { CompareProvider } from './compare-context'
import { PageTransition } from '@/components/ui/Motion'
import { CompareBar } from './compare-bar'
import { ReactNode } from 'react'

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CompareProvider>
        <div className="relative flex min-h-screen flex-col bg-background">
          <SiteNavbar />
          <main className="relative z-0 flex-1 pt-nav">
            <PageTransition>{children}</PageTransition>
          </main>
          <CompareBar />
          <SiteFooter />
        </div>
      </CompareProvider>
    </AuthProvider>
  )
}
