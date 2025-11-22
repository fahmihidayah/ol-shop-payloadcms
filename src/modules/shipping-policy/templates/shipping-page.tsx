import { ShippingContent } from '../components/shipping-content'

export function ShippingPolicyPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 sm:mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Shipping Policy</h1>
          <p className="text-muted-foreground text-lg">Fast and reliable delivery to your door</p>
        </header>

        <ShippingContent />
      </div>
    </div>
  )
}
