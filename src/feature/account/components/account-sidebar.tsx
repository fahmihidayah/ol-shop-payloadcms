'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { User, MapPin, Package, Heart, Settings, LogOut, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useState } from 'react'
import { logout } from '@/feature/auth/actions'

interface AccountSidebarProps {
  userName?: string
  userEmail?: string
}

const menuItems = [
  {
    label: 'Account',
    href: '/account',
    icon: User,
  },
  {
    label: 'Addresses',
    href: '/account/addresses',
    icon: MapPin,
  },
  {
    label: 'My Orders',
    href: '/account/orders',
    icon: Package,
  },
  {
    label: 'Wishlist',
    href: '/account/wishlist',
    icon: Heart,
  },
  {
    label: 'Settings',
    href: '/account/settings',
    icon: Settings,
  },
]

function SidebarNav({
  userName,
  userEmail,
  onNavigate,
}: AccountSidebarProps & { onNavigate?: () => void }) {
  const pathname = usePathname()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <>
      {userName && (
        <div className="px-6 pb-4 pt-5">
          <p className="font-medium text-foreground">{userName}</p>
          {userEmail && <p className="text-xs text-muted-foreground">{userEmail}</p>}
        </div>
      )}
      {/* <Separator /> */}
      <nav className="flex flex-col">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 px-6 py-3 text-sm transition-colors hover:bg-muted',
                isActive && 'bg-primary/10 text-primary font-medium border-r-2 border-primary',
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
        <Separator />
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="flex items-center gap-3 justify-start px-6 py-3 text-sm text-destructive hover:text-destructive hover:bg-destructive/10 rounded-none h-auto"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </nav>
    </>
  )
}

export function AccountSidebar({ userName, userEmail }: AccountSidebarProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const activeItem = menuItems.find((item) => item.href === pathname)

  return (
    <>
      {/* Mobile: collapsible sheet */}
      <div className="lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <span className="flex items-center gap-2">
                {activeItem && <activeItem.icon className="h-4 w-4" />}
                {activeItem?.label || 'Menu'}
              </span>
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0 pt-6">
            <SheetHeader className="px-6 pb-2">
              <SheetTitle>My Account</SheetTitle>
            </SheetHeader>
            <SidebarNav
              userName={userName}
              userEmail={userEmail}
              onNavigate={() => setOpen(false)}
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop: static card sidebar */}
      <div className="h-fit sticky top-20 hidden lg:flex lg:flex-col rounded-lg  border-[1px] bg-white shadow-lg overflow-clip">
        {/* <CardHeader>
          <CardTitle className="text-lg">My Account</CardTitle>
          {userName && (
            <>
              <CardDescription className="font-medium text-foreground">{userName}</CardDescription>
              {userEmail && <CardDescription className="text-xs">{userEmail}</CardDescription>}
            </>
          )}
        </CardHeader> */}
        {/* <Separator /> */}
        <SidebarNav userName={userName} userEmail={userEmail} />
      </div>
    </>
  )
}
