'use client'

import { QueryProvider } from '@/providers/QueryProvider'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { NavBar } from '@/components/layout/nav-bar'
import { Footer } from '@/components/layout/footer'
import { Toaster } from '@/components/ui/sonner'

export function BaseLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <div className="flex flex-col min-h-screen bg-background">
          <NavBar />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster />
        </div>
      </QueryProvider>
    </ThemeProvider>
  )
}
