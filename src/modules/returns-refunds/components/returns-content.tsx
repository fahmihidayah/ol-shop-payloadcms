import { RotateCcw, CreditCard, Package, CheckCircle } from 'lucide-react'

export function ReturnsContent() {
  return (
    <div className="space-y-8">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="p-6 rounded-lg bg-muted/50 text-center">
          <RotateCcw className="h-8 w-8 mx-auto mb-3 text-primary" />
          <h3 className="font-semibold mb-1">30-Day Returns</h3>
          <p className="text-sm text-muted-foreground">Easy return process</p>
        </div>
        <div className="p-6 rounded-lg bg-muted/50 text-center">
          <CreditCard className="h-8 w-8 mx-auto mb-3 text-primary" />
          <h3 className="font-semibold mb-1">Full Refund</h3>
          <p className="text-sm text-muted-foreground">Money-back guarantee</p>
        </div>
        <div className="p-6 rounded-lg bg-muted/50 text-center">
          <Package className="h-8 w-8 mx-auto mb-3 text-primary" />
          <h3 className="font-semibold mb-1">Free Returns</h3>
          <p className="text-sm text-muted-foreground">On eligible items</p>
        </div>
        <div className="p-6 rounded-lg bg-muted/50 text-center">
          <CheckCircle className="h-8 w-8 mx-auto mb-3 text-primary" />
          <h3 className="font-semibold mb-1">Quality Checked</h3>
          <p className="text-sm text-muted-foreground">Inspected returns</p>
        </div>
      </div>

      <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
        <section className="mb-8">
          <h2>Return Policy</h2>
          <p>
            We want you to be completely satisfied with your purchase. If you're not happy with your
            order, you may return it within 30 days of delivery for a full refund.
          </p>
        </section>

        <section className="mb-8">
          <h2>Eligibility</h2>
          <p>To be eligible for a return, items must:</p>
          <ul>
            <li>Be in their original condition with all tags attached</li>
            <li>Be unworn, unused, and unwashed</li>
            <li>Include all original packaging and accessories</li>
            <li>Have proof of purchase (receipt or order number)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2>Non-Returnable Items</h2>
          <p>The following items cannot be returned:</p>
          <ul>
            <li>Final sale items</li>
            <li>Gift cards</li>
            <li>Personalized or custom-made products</li>
            <li>Intimate apparel and swimwear (for hygiene reasons)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2>How to Return</h2>
          <ol>
            <li>Log in to your account and go to "Order History"</li>
            <li>Select the order containing the item(s) you want to return</li>
            <li>Click "Request Return" and follow the instructions</li>
            <li>Print the prepaid return label</li>
            <li>Pack the item(s) securely in the original packaging</li>
            <li>Attach the label and drop off at any authorized shipping location</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2>Refund Process</h2>
          <p>
            Once we receive your return, we'll inspect the items and process your refund within 5-7
            business days. The refund will be issued to your original payment method.
          </p>
        </section>

        <section className="mb-8">
          <h2>Exchanges</h2>
          <p>
            If you need a different size or color, we recommend returning the original item for a
            refund and placing a new order to ensure availability.
          </p>
        </section>

        <section>
          <h2>Damaged or Defective Items</h2>
          <p>
            If you receive a damaged or defective item, please contact us immediately. We'll arrange
            for a replacement or full refund, including return shipping costs.
          </p>
        </section>
      </div>
    </div>
  )
}
