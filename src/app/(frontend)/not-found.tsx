import './styles.css'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Home, ArrowLeft, Search } from 'lucide-react'

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground">
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <Card className="text-center shadow-lg">
              <CardHeader className="space-y-4">
                <div className="mx-auto w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <CardTitle className="text-6xl font-bold text-primary mb-2">404</CardTitle>
                  <CardDescription className="text-xl font-medium">Page Not Found</CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <p className="text-muted-foreground">
                  Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved,
                  deleted, or you entered the wrong URL.
                </p>

                <Separator />

                <div className="space-y-3">
                  <Button asChild className="w-full" size="lg">
                    <Link href="/">
                      <Home className="w-4 h-4 mr-2" />
                      Go to Homepage
                    </Link>
                  </Button>

                  <Button asChild variant="outline" className="w-full" size="lg">
                    <Link href="javascript:history.back()">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Go Back
                    </Link>
                  </Button>
                </div>

                <div className="pt-4">
                  <p className="text-sm text-muted-foreground">
                    Return to{' '}
                    <Link href="/" className="text-primary hover:underline font-medium">
                      Payload Starter
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </body>
    </html>
  )
}
