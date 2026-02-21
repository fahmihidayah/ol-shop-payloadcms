import React from 'react'
import './styles.css'
import { QueryProvider } from '@/providers/QueryProvider'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { Navbar } from '@/components/layouts/navbar'
import { Footer } from '@/components/layouts/footer'
import { Toaster } from 'sonner'
import { getStoreConfig } from '@/feature/store/actions'
import { Metadata } from 'next'
import { Media } from '@/payload-types'

export async function generateMetadata(): Promise<Metadata> {
  const storeConfig = await getStoreConfig()

  // Default fallback values
  const defaultTitle = 'Online Store'
  const defaultDescription = 'A modern e-commerce store built with Payload CMS and Next.js.'

  // Use store config values with fallbacks
  const metaTitle = storeConfig?.metaTitle || defaultTitle
  const metaDescription = storeConfig?.metaDescription || defaultDescription

  // Handle keywords
  const keywords = storeConfig?.keywords
    ? storeConfig.keywords.map((k) => k.keyword).filter(Boolean)
    : undefined

  // Get favicon
  const favicon =
    storeConfig?.favicon && typeof storeConfig.favicon !== 'string'
      ? (storeConfig.favicon as Media).url
      : undefined

  return {
    title: {
      default: metaTitle,
      template: `%s | ${storeConfig?.storeName || 'Online Store'}`,
    },
    description: metaDescription,
    keywords,
    icons: favicon ? { icon: favicon } : undefined,
    robots: {
      index: !storeConfig?.noIndex,
      follow: !storeConfig?.noFollow,
    },
  }
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <QueryProvider>
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <Toaster position="top-left" richColors />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
