import Link from 'next/link'
import { Store } from 'lucide-react'

export function AboutSection() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Store className="h-6 w-6" />
        <h3 className="text-lg font-bold">Our Store</h3>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">
        Your trusted destination for quality products. We're committed to providing exceptional
        service and curated selections for all your needs.
      </p>
      <div className="flex gap-4 pt-2">
        <Link
          href="/about"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          About Us
        </Link>
        <Link
          href="/careers"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Careers
        </Link>
        <Link
          href="/blog"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Blog
        </Link>
      </div>
    </div>
  )
}
