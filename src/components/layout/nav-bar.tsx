'use client'

import Link from 'next/link'
import { Store } from 'lucide-react'
import { UserDropdown } from './navbar/user-dropdown'
import { CartPreview } from './navbar/cart-preview'
import { ThemeToggle } from './navbar/theme-toggle'

export function NavBar() {
  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-semibold text-xl hover:opacity-80 transition-opacity">
            <Store className="h-6 w-6" />
            <span className="hidden sm:inline">Store</span>
          </Link>

          {/* Right Side Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <CartPreview />
            <UserDropdown />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  )
}
