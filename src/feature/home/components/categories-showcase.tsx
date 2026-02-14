import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CategoryShowCase } from '../type'
import { getMedia } from '@/lib/type-utils'
import { Category } from '@/payload-types'


interface CategoriesShowcaseProps {
  categoriesShowcase?: CategoryShowCase
}

export function CategoriesShowcase({ categoriesShowcase }: CategoriesShowcaseProps) {
  if (!categoriesShowcase?.enabled || !categoriesShowcase?.categories || categoriesShowcase.categories.length === 0) {
    return null
  }

  return (
    <section className="py-16 px-6 bg-muted/50">
      <div className="mx-auto max-w-7xl">
        {categoriesShowcase.title && (
          <h2 className="text-3xl font-bold text-center mb-12">
            {categoriesShowcase.title}
          </h2>
        )}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categoriesShowcase.categories.map((c) => {
            const category = c as Category
            const image = getMedia(category.image)
            const imageUrl = image?.url
            const imageAlt = image?.alt || category.name

            return (
              <Link key={category.id} href={`/categories/${category.slug}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full pt-0 gap-0">
                  <CardHeader className="p-0">
                    {imageUrl ? (
                      <div className="relative aspect-square w-full">
                        <Image
                          src={imageUrl}
                          alt={imageAlt}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="aspect-square w-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        <span className="text-2xl font-bold text-primary/40">
                          {category.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="pt-4">
                    <CardTitle className="text-base text-center">{category.name}</CardTitle>
                    {category.description && (
                      <p className="text-xs text-muted-foreground text-center mt-1 line-clamp-2">
                        {category.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
