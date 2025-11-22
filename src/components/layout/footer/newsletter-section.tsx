'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, Loader2, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

export function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast.error('Please enter your email address')
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address')
      return
    }

    setIsLoading(true)

    try {
      // TODO: Implement newsletter subscription API
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setIsSubscribed(true)
      toast.success('Successfully subscribed!', {
        description: 'Thank you for subscribing to our newsletter.',
      })
      setEmail('')
    } catch (error) {
      toast.error('Subscription failed', {
        description: 'Please try again later.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">Newsletter</h3>
      <p className="text-sm text-muted-foreground">
        Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
      </p>

      <form onSubmit={handleSubscribe} className="space-y-3">
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading || isSubscribed}
            className="pl-9"
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading || isSubscribed}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Subscribing...
            </>
          ) : isSubscribed ? (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Subscribed
            </>
          ) : (
            'Subscribe'
          )}
        </Button>
      </form>

      <p className="text-xs text-muted-foreground">
        By subscribing, you agree to our{' '}
        <a href="/privacy" className="underline hover:text-foreground">
          Privacy Policy
        </a>
      </p>
    </div>
  )
}
