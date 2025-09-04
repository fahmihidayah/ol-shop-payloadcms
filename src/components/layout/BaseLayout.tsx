'use client'

import { QueryProvider } from '@/providers/QueryProvider'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { NavBar } from '@/components/layout/nav-bar'

export function BaseLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <div className="min-h-screen bg-background">
          <NavBar />
          <main>{children}</main>
        </div>
      </QueryProvider>
    </ThemeProvider>
  )
}