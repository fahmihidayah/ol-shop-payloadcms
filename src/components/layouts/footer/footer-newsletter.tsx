'use client'

import { useState } from 'react'
import { Mail } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function FooterNewsletter() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setEmail('')
    }
  }

  return (
    <div>
      <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">
        Stay Updated
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        Subscribe for new arrivals and exclusive offers.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-9 h-9"
            required
          />
        </div>
        <Button type="submit" size="sm" className="h-9 shrink-0">
          Subscribe
        </Button>
      </form>
    </div>
  )
}
