import { Store } from 'lucide-react'
import Link from 'next/link'

export function FooterAbout() {
  return (
    <div className="space-y-4">
      <Link href="/" className="flex items-center gap-2">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground">
          <Store className="h-4 w-4" />
        </div>
        <span className="font-bold text-lg">Store</span>
      </Link>
      <p className="text-sm text-muted-foreground leading-relaxed">
        Discover curated collections of premium products crafted for modern living.
        We believe in quality, simplicity, and exceptional customer experience.
      </p>
    </div>
  )
}
