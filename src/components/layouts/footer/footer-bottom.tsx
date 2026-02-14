import { Separator } from '@/components/ui/separator'

export function FooterBottom() {
  const year = new Date().getFullYear()

  return (
    <div>
      <Separator className="mb-6" />
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>&copy; {year} Store. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <span>Visa</span>
          <span>Mastercard</span>
          <span>PayPal</span>
        </div>
      </div>
    </div>
  )
}
