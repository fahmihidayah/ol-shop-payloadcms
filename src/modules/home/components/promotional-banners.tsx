import Link from 'next/link'
import { ImageMedia } from '@/modules/media/image-media'
import { Media } from '@/payload-types'

type PromotionalBanner = {
  icon?: Media | string
  title: string
  description?: string
  link?: string
  id?: string
}

type PromotionalBannersProps = {
  banners?: PromotionalBanner[]
}

export function PromotionalBanners({ banners }: PromotionalBannersProps) {
  if (!banners || banners.length === 0) return null

  return (
    <section className="bg-muted/50 py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {banners.map((banner, index) => {
            const content = (
              <div className="flex items-start gap-4 p-6 rounded-lg bg-background border border-border hover:shadow-md transition-shadow">
                {banner.icon && (
                  <div className="flex-shrink-0">
                    <ImageMedia
                      media={banner.icon as Media}
                      className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                      width={64}
                      height={64}
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-base sm:text-lg mb-1">{banner.title}</h3>
                  {banner.description && (
                    <p className="text-sm text-muted-foreground">{banner.description}</p>
                  )}
                </div>
              </div>
            )

            if (banner.link) {
              return (
                <Link key={banner.id || index} href={banner.link} className="block">
                  {content}
                </Link>
              )
            }

            return (
              <div key={banner.id || index} className="block">
                {content}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
