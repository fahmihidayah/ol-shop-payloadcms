import { FooterAbout } from './footer-about'
import { FooterLinks } from './footer-links'
import { FooterNewsletter } from './footer-newsletter'
import { FooterBottom } from './footer-bottom'

const shopLinks = [
  { label: 'New Arrivals', href: '/new-arrivals' },
  { label: 'Featured', href: '/featured' },
  { label: 'Categories', href: '/categories' },
  { label: 'Sale', href: '/sale' },
]

const companyLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
]

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <FooterAbout />
          <FooterLinks title="Shop" links={shopLinks} />
          <FooterLinks title="Company" links={companyLinks} />
          <FooterNewsletter />
        </div>
        <div className="mt-10">
          <FooterBottom />
        </div>
      </div>
    </footer>
  )
}
