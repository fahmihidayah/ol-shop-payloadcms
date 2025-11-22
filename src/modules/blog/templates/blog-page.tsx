import { BlogContent } from '../components/blog-content'

export function BlogPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 sm:mb-16 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">Blog</h1>
          <p className="text-xl text-muted-foreground">
            Tips, insights, and stories to enhance your shopping experience
          </p>
        </header>

        <BlogContent />
      </div>
    </div>
  )
}
