import { Card, CardContent } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

export function OrderLoadingState() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-lg text-muted-foreground">Processing your order...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
