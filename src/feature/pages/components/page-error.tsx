import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface PageErrorProps {
  title?: string
  message?: string
  showBackButton?: boolean
}

export function PageError({
  title = 'Page Not Found',
  message = 'The page you are looking for does not exist or has been removed.',
  showBackButton = true,
}: PageErrorProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-4 text-4xl font-bold">{title}</h1>
      <p className="mb-8 max-w-md text-muted-foreground">{message}</p>
      {showBackButton && (
        <Button asChild>
          <Link href="/">Return to Home</Link>
        </Button>
      )}
    </div>
  )
}
