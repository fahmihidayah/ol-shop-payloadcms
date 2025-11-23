'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User, MapPin, Heart, ShoppingBag, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const menuItems = [
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/profile/addresses', label: 'Addresses', icon: MapPin },
  { href: '/profile/wishlist', label: 'Wishlist', icon: Heart },
  { href: '/profile/orders', label: 'Order History', icon: ShoppingBag },
  { href: '/profile/settings', label: 'Settings', icon: Settings },
]

export function UserSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-full lg:w-64 flex-shrink-0">
      {/* Desktop Navigation */}
      <nav className="hidden lg:block space-y-1 sticky top-4">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground font-medium'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Mobile Navigation - Horizontal Scroll */}
      <nav className="lg:hidden flex gap-2 overflow-x-auto pb-2 border-b mb-6">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap',
                isActive
                  ? 'bg-primary text-primary-foreground font-medium'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="text-sm">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
