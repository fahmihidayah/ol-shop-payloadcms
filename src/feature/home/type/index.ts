import { Category, Media, Product } from '@/payload-types'

export type Hero = {
  enabled?: boolean | null
  title: string
  subtitle?: string | null
  image?: (number | null) | Media
  primaryCTA?: {
    label?: string | null
    href?: string | null
  }
}

export type Promotion = {
  icon?: (number | null) | Media
  title: string
  description?: string | null
  link?: string | null
  id?: string | null
}

export type FeaturedProduct = {
  enabled?: boolean | null
  title?: string | null
  selectionMode?: ('auto' | 'manual') | null
  products?: (string | Product)[] | null
  limit?: number | null
}

export type NewArrival = {
  enabled?: boolean | null
  title?: string | null
  limit?: number | null
}

export type CategoryShowCase = {
  enabled?: boolean | null
  title?: string | null
  categories?: (string | Category)[] | null
}

export type HomeSEO = {
  metaTitle?: string | null
  metaDescription?: string | null
  ogImage?: (number | null) | Media
}
