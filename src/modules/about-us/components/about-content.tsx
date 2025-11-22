import { Heart, Users, Award, Zap } from 'lucide-react'

export function AboutContent() {
  return (
    <div className="space-y-12">
      {/* Hero Text */}
      <section className="text-center max-w-3xl mx-auto">
        <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
          We're passionate about providing high-quality products and exceptional customer service.
          Our mission is to make shopping easy, enjoyable, and accessible for everyone.
        </p>
      </section>

      {/* Values Grid */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Heart className="h-8 w-8 text-primary" />
          </div>
          <h3 className="font-bold mb-2">Customer First</h3>
          <p className="text-sm text-muted-foreground">
            Your satisfaction is our top priority
          </p>
        </div>

        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Award className="h-8 w-8 text-primary" />
          </div>
          <h3 className="font-bold mb-2">Quality Products</h3>
          <p className="text-sm text-muted-foreground">Carefully curated selections</p>
        </div>

        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Zap className="h-8 w-8 text-primary" />
          </div>
          <h3 className="font-bold mb-2">Fast Delivery</h3>
          <p className="text-sm text-muted-foreground">Quick and reliable shipping</p>
        </div>

        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <h3 className="font-bold mb-2">Community</h3>
          <p className="text-sm text-muted-foreground">Building lasting relationships</p>
        </div>
      </section>

      {/* Our Story */}
      <section className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
        <h2>Our Story</h2>
        <p>
          Founded in 2020, we started with a simple idea: make online shopping better. What began as
          a small operation has grown into a trusted destination for thousands of customers.
        </p>
        <p>
          We believe that shopping should be more than just a transaction. It's about finding
          products you love, delivered with care, and backed by a team that genuinely cares about
          your experience.
        </p>
      </section>

      {/* What We Offer */}
      <section className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
        <h2>What We Offer</h2>
        <ul>
          <li>Carefully curated product selection</li>
          <li>Competitive pricing and regular promotions</li>
          <li>Fast and reliable shipping</li>
          <li>Easy returns and exchanges</li>
          <li>Dedicated customer support team</li>
          <li>Secure and convenient checkout</li>
        </ul>
      </section>

      {/* Our Commitment */}
      <section className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
        <h2>Our Commitment</h2>
        <p>
          We're committed to sustainability, ethical sourcing, and giving back to our community. We
          partner with suppliers who share our values and work to minimize our environmental impact.
        </p>
      </section>

      {/* Contact CTA */}
      <section className="bg-muted/50 rounded-lg p-8 sm:p-12 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">Get in Touch</h2>
        <p className="text-muted-foreground mb-6">
          Have questions? We'd love to hear from you.
        </p>
        <a
          href="mailto:hello@example.com"
          className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Contact Us
        </a>
      </section>
    </div>
  )
}
