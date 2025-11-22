import Link from 'next/link'
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react'

export function ContactSection() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">Contact Us</h3>

      {/* Contact Information */}
      <div className="space-y-3">
        <a
          href="mailto:support@example.com"
          className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors group"
        >
          <Mail className="h-4 w-4 flex-shrink-0 group-hover:text-primary" />
          <span>support@example.com</span>
        </a>

        <a
          href="tel:+1234567890"
          className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors group"
        >
          <Phone className="h-4 w-4 flex-shrink-0 group-hover:text-primary" />
          <span>+1 (234) 567-890</span>
        </a>

        <div className="flex items-start gap-3 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span>
            123 Store Street
            <br />
            City, State 12345
          </span>
        </div>
      </div>

      {/* Social Media */}
      <div>
        <p className="text-sm font-medium mb-3">Follow Us</p>
        <div className="flex gap-3">
          <Link
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
            aria-label="Facebook"
          >
            <Facebook className="h-4 w-4" />
          </Link>
          <Link
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
            aria-label="Twitter"
          >
            <Twitter className="h-4 w-4" />
          </Link>
          <Link
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
            aria-label="Instagram"
          >
            <Instagram className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
