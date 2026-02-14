'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, ChevronDown, LogIn, UserPlus, Info, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { NavbarSearch } from './navbar-search'
import { Category } from '@/payload-types'
import { cn } from '@/lib/utils'

interface MobileMenuProps {
  categories: Category[]
}

export function MobileMenu({ categories }: MobileMenuProps) {
  const [open, setOpen] = useState(false)
  const [categoriesOpen, setCategoriesOpen] = useState(false)

  const closeMenu = () => setOpen(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[360px] overflow-y-auto">
        <SheetHeader className="text-left">
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-6 mt-6">
          <NavbarSearch className="w-full" onSearch={closeMenu} />

          <nav className="flex flex-col gap-1">
            {categories.length > 0 && (
              <div>
                <button
                  onClick={() => setCategoriesOpen(!categoriesOpen)}
                  className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-md hover:bg-accent transition-colors"
                >
                  Categories
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 transition-transform',
                      categoriesOpen && 'rotate-180'
                    )}
                  />
                </button>
                {categoriesOpen && (
                  <div className="ml-3 mt-1 flex flex-col gap-0.5 border-l pl-3">
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/categories/${category.slug}`}
                        onClick={closeMenu}
                        className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-accent transition-colors"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            <Link
              href="/about"
              onClick={closeMenu}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-accent transition-colors"
            >
              <Info className="h-4 w-4" />
              About
            </Link>

            <Link
              href="/contact"
              onClick={closeMenu}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-accent transition-colors"
            >
              <Phone className="h-4 w-4" />
              Contact Us
            </Link>
          </nav>

          <div className="border-t pt-4 flex flex-col gap-2">
            <Button variant="outline" asChild className="justify-start gap-2">
              <Link href="/login" onClick={closeMenu}>
                <LogIn className="h-4 w-4" />
                Login
              </Link>
            </Button>
            <Button asChild className="justify-start gap-2">
              <Link href="/register" onClick={closeMenu}>
                <UserPlus className="h-4 w-4" />
                Create Account
              </Link>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
