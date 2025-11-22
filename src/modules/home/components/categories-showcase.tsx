import Link from 'next/link'
import { ImageMedia } from '@/modules/media/image-media'
import { Category, Media } from '@/payload-types'

type CategoriesShowcaseProps = {
  config?: {
    enabled?: boolean
    title?: string
    categories?: (Category | string)[]
  }
  categories: Category[]
}

export function CategoriesShowcase({ config, categories }: CategoriesShowcaseProps) {
  if (!config?.enabled || categories.length === 0) return null

  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-2">
            {config.title || 'Shop by Category'}
          </h2>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 sm:gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="group"
            >
              <div className="relative aspect-square rounded-lg overflow-hidden bg-muted mb-3">
                {category.image && (
                  <ImageMedia
                    media={category.image as Media}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    width={300}
                    height={300}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="text-center font-medium text-sm sm:text-base group-hover:text-primary transition-colors">
                {category.title}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
