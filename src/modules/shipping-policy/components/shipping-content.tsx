import { Truck, Package, Clock, MapPin } from 'lucide-react'

export function ShippingContent() {
  return (
    <div className="space-y-8">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="p-6 rounded-lg bg-muted/50 text-center">
          <Truck className="h-8 w-8 mx-auto mb-3 text-primary" />
          <h3 className="font-semibold mb-1">Free Shipping</h3>
          <p className="text-sm text-muted-foreground">On orders over $50</p>
        </div>
        <div className="p-6 rounded-lg bg-muted/50 text-center">
          <Package className="h-8 w-8 mx-auto mb-3 text-primary" />
          <h3 className="font-semibold mb-1">Secure Packaging</h3>
          <p className="text-sm text-muted-foreground">Safe delivery guaranteed</p>
        </div>
        <div className="p-6 rounded-lg bg-muted/50 text-center">
          <Clock className="h-8 w-8 mx-auto mb-3 text-primary" />
          <h3 className="font-semibold mb-1">Fast Processing</h3>
          <p className="text-sm text-muted-foreground">Ships within 24-48 hours</p>
        </div>
        <div className="p-6 rounded-lg bg-muted/50 text-center">
          <MapPin className="h-8 w-8 mx-auto mb-3 text-primary" />
          <h3 className="font-semibold mb-1">Track Your Order</h3>
          <p className="text-sm text-muted-foreground">Real-time tracking</p>
        </div>
      </div>

      <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
        <section className="mb-8">
          <h2>Shipping Methods</h2>
          <p>We offer several shipping options to meet your needs:</p>
          <ul>
            <li>
              <strong>Standard Shipping (5-7 business days)</strong> - Free on orders over $50,
              otherwise $5.99
            </li>
            <li>
              <strong>Express Shipping (2-3 business days)</strong> - $12.99
            </li>
            <li>
              <strong>Overnight Shipping (1 business day)</strong> - $24.99
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2>Processing Time</h2>
          <p>
            Orders are processed within 24-48 hours during business days (Monday - Friday). Orders
            placed on weekends or holidays will be processed the next business day.
          </p>
        </section>

        <section className="mb-8">
          <h2>Shipping Locations</h2>
          <p>We currently ship to all 50 US states. International shipping is not available at this time.</p>
        </section>

        <section className="mb-8">
          <h2>Order Tracking</h2>
          <p>
            Once your order ships, you'll receive a confirmation email with a tracking number. You
            can track your package using this number on our website or the carrier's website.
          </p>
        </section>

        <section className="mb-8">
          <h2>Shipping Restrictions</h2>
          <p>We cannot ship to P.O. boxes or APO/FPO addresses. All orders must be shipped to a physical street address.</p>
        </section>

        <section>
          <h2>Delays and Issues</h2>
          <p>
            While we strive to deliver on time, delays may occur due to weather, carrier issues, or
            other unforeseen circumstances. If your order is delayed, please contact our customer
            service team.
          </p>
        </section>
      </div>
    </div>
  )
}
