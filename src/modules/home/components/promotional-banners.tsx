import Link from 'next/link'
import { ImageMedia } from '@/modules/media/image-media'
import { Media } from '@/payload-types'

type TBanner = {
  icon?: (string | null) | Media
  title: string
  description?: string | null
  link?: string | null
  id?: string | null
}

type PromotionalBannersProps = {
  banners?: TBanner[] | null
}

export function PromotionalItem({ banner, index }: { banner: TBanner; index: number }) {
  {
    const content = (
      <div className="w-60 flex items-start gap-4 p-6 rounded-lg bg-background border border-border hover:shadow-md transition-shadow overflow-auto">
        {banner.icon && (
          <ImageMedia
            media={banner.icon as Media}
            className="w-12 h-12 rounded-lg"
            width={64}
            height={64}
          />
        )}
        <div className="flex flex-col">
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
  }
}

export function PromotionalBanners({ banners }: PromotionalBannersProps) {
  if (!banners || banners.length === 0) return null

  return (
    <section className="bg-muted/50 py-8 sm:py-12">
      <div className="container flex flex-row gap-3 overflow-scroll px-10">
        {banners?.map((e, index) => {
          return <PromotionalItem key={index} banner={e} index={index} />
        })}
      </div>
    </section>
  )
}
