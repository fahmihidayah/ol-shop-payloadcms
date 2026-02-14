'use client'

import Link from 'next/link'
import { Category, Customer } from '@/payload-types'
import { ModeToggle } from '@/components/mode-toggle'
import { StoreBrand } from './store-brand'
import { NavbarSearch } from './navbar-search'
import { NavbarCategories } from './navbar-categories'
import { NavbarUserMenu } from './navbar-user-menu'
import { MobileMenu } from './mobile-menu'
import { Button } from '@/components/ui/button'
import { NavbarCart } from './navbar-cart'
import { CartWithItems } from '@/feature/cart/actions'

interface NavbarClientProps {
  categories: Category[]
  customer?: Customer | null
  cart: CartWithItems | null
}

export function NavbarClient({ categories, customer, cart }: NavbarClientProps) {
  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl flex h-14 items-center gap-4 px-4 md:px-6 lg:px-8">
        <StoreBrand />

        {/* Desktop search */}
        <NavbarSearch className="hidden md:block flex-1 max-w-md" />

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1">
          <NavbarCategories categories={categories} />
          <Button variant="ghost" size="sm" asChild>
            <Link href="/about">About</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>

        <div className="ml-auto flex items-center gap-1">
          <ModeToggle />
          {/* Desktop user menu */}
          <div className="hidden md:block">
            <NavbarUserMenu customer={customer} />
          </div>
          <NavbarCart cart={cart} />
          {/* Mobile menu */}
          <div className="md:hidden">
            <MobileMenu categories={categories} />
          </div>
        </div>
      </div>
    </nav>
  )
}
