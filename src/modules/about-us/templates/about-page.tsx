import { AboutContent } from '../components/about-content'

export function AboutUsPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 sm:mb-16 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">About Us</h1>
          <p className="text-xl text-muted-foreground">
            Delivering quality products with exceptional service
          </p>
        </header>

        <AboutContent />
      </div>
    </div>
  )
}
