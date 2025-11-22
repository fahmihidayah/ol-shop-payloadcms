import { PrivacyContent } from '../components/privacy-content'

export function PrivacyPolicyPage() {
  const lastUpdated = 'January 1, 2025'

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 sm:mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground">Last Updated: {lastUpdated}</p>
        </header>

        <PrivacyContent />
      </div>
    </div>
  )
}
