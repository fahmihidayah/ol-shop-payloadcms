import Link from 'next/link'
import { AboutSection } from './about-section'
import { ContactSection } from './contact-section'
import { NewsletterSection } from './newsletter-section'
import { Separator } from '@/components/ui/separator'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-muted/50 border-t mt-auto">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* About Section */}
          <div className="lg:col-span-1">
            <AboutSection />
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link
                href="/products"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Shop All Products
              </Link>
              <Link
                href="/orders"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Track Order
              </Link>
              <Link
                href="/wishlist"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                My Wishlist
              </Link>
              <Link
                href="/faq"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                FAQ
              </Link>
            </nav>
          </div>

          {/* Contact Section */}
          <div className="lg:col-span-1">
            <ContactSection />
          </div>

          {/* Newsletter Section */}
          <div className="lg:col-span-1">
            <NewsletterSection />
          </div>
        </div>
      </div>

      <Separator />

      {/* Footer Bottom */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            © {currentYear} Your Store. All rights reserved.
          </p>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/shipping"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Shipping Policy
            </Link>
            <Link
              href="/returns"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Returns & Refunds
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
