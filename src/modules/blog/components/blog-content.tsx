import { Calendar, User, Tag, ArrowRight } from 'lucide-react'

export function BlogContent() {
  // Placeholder blog posts - in production, this would fetch from PayloadCMS
  const featuredPost = {
    title: 'The Future of E-Commerce: Trends to Watch in 2024',
    excerpt:
      'Discover the latest trends shaping the online shopping experience and how they impact your business.',
    image: '/api/placeholder/800/400',
    category: 'Industry Insights',
    author: 'John Doe',
    date: '2024-01-15',
    slug: 'future-of-ecommerce-2024',
  }

  const recentPosts = [
    {
      title: 'How to Choose the Perfect Product for Your Needs',
      excerpt: 'A comprehensive guide to making informed purchasing decisions.',
      image: '/api/placeholder/400/250',
      category: 'Shopping Tips',
      author: 'Jane Smith',
      date: '2024-01-10',
      slug: 'choose-perfect-product',
    },
    {
      title: '5 Ways to Save Money While Shopping Online',
      excerpt: 'Expert tips to get the best deals and maximize your savings.',
      image: '/api/placeholder/400/250',
      category: 'Savings',
      author: 'Mike Johnson',
      date: '2024-01-08',
      slug: 'save-money-shopping',
    },
    {
      title: 'Sustainable Shopping: Making Eco-Friendly Choices',
      excerpt: 'Learn how to shop responsibly and reduce your environmental impact.',
      image: '/api/placeholder/400/250',
      category: 'Sustainability',
      author: 'Sarah Williams',
      date: '2024-01-05',
      slug: 'sustainable-shopping',
    },
    {
      title: 'The Ultimate Gift Guide for Every Occasion',
      excerpt: 'Find the perfect gift for your loved ones with our curated selection.',
      image: '/api/placeholder/400/250',
      category: 'Gift Ideas',
      author: 'Emily Brown',
      date: '2024-01-03',
      slug: 'ultimate-gift-guide',
    },
    {
      title: 'Behind the Scenes: How We Source Our Products',
      excerpt: 'Take a look at our sourcing process and commitment to quality.',
      image: '/api/placeholder/400/250',
      category: 'Company News',
      author: 'David Lee',
      date: '2024-01-01',
      slug: 'behind-the-scenes',
    },
    {
      title: 'Customer Stories: Your Favorite Products',
      excerpt: 'Hear from our customers about the products they love most.',
      image: '/api/placeholder/400/250',
      category: 'Customer Stories',
      author: 'Lisa Chen',
      date: '2023-12-28',
      slug: 'customer-stories',
    },
  ]

  const categories = [
    'All Posts',
    'Industry Insights',
    'Shopping Tips',
    'Savings',
    'Sustainability',
    'Gift Ideas',
    'Company News',
    'Customer Stories',
  ]

  return (
    <div className="space-y-12">
      {/* Featured Post */}
      <section className="bg-muted/50 rounded-lg overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0">
          <div className="relative h-64 md:h-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5" />
          </div>
          <div className="p-8 lg:p-12 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 text-sm text-primary font-semibold mb-4">
              <Tag className="h-4 w-4" />
              {featuredPost.category}
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">{featuredPost.title}</h2>
            <p className="text-muted-foreground mb-6">{featuredPost.excerpt}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {featuredPost.author}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {new Date(featuredPost.date).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </div>
            </div>
            <a
              href={`/blog/${featuredPost.slug}`}
              className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
            >
              Read More
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                category === 'All Posts'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Recent Posts Grid */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Recent Posts</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {recentPosts.map((post) => (
            <article key={post.slug} className="group">
              <a href={`/blog/${post.slug}`} className="block">
                <div className="relative h-48 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg mb-4 overflow-hidden">
                  <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/20 transition-colors" />
                </div>
                <div className="inline-flex items-center gap-2 text-xs text-primary font-semibold mb-2">
                  <Tag className="h-3 w-3" />
                  {post.category}
                </div>
                <h3 className="font-bold mb-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {post.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(post.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                </div>
              </a>
            </article>
          ))}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="bg-primary text-primary-foreground rounded-lg p-8 lg:p-12 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">Stay Updated</h2>
        <p className="text-primary-foreground/90 mb-6 max-w-2xl mx-auto">
          Subscribe to our newsletter to receive the latest blog posts, exclusive deals, and
          shopping tips directly in your inbox.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-2 rounded-md bg-primary-foreground text-foreground"
          />
          <button className="px-6 py-2 bg-primary-foreground text-primary font-medium rounded-md hover:bg-primary-foreground/90 transition-colors">
            Subscribe
          </button>
        </div>
      </section>
    </div>
  )
}
