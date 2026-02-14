import Link from 'next/link'
import { Store } from 'lucide-react'

export function StoreBrand() {
  return (
    <Link href="/" className="flex items-center gap-2 shrink-0">
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground">
        <Store className="h-4 w-4" />
      </div>
      <span className="font-bold text-lg hidden sm:inline">Fahmi</span>
    </Link>
  )
}
