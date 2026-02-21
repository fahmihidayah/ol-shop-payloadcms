import { notFound } from 'next/navigation'
import { getProductBySlug, getRelatedProducts } from '@/feature/products/actions/get-list-products'
import { ProductDetail } from '@/feature/products/components/product-detail'
import { Metadata } from 'next'

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{}>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    return {
      title: 'Product Not Found | Online Store',
      description: 'The requested product could not be found.',
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  // Get product details for metadata
  const category = typeof product.category === 'object' ? product.category.name : 'Products'
  const defaultPrice = product.defaultVariantPrice || 0
  const thumbnail = typeof product.thumbnail === 'object' ? product.thumbnail?.url : undefined

  // Generate rich description
  const defaultDescription = `Shop ${product.name} online. ${category} available with fast delivery. Check out our product details, specifications, and customer reviews. Order now!`

  // Generate keywords
  const defaultKeywords = [
    product.name,
    'buy online',
    'shop now',
    category,
    'quality product',
    'fast delivery',
    'secure checkout',
  ]

  // Handle keywords (may be array of objects or strings)
  const seoKeywords = product.seo?.keywords
    ? Array.isArray(product.seo.keywords)
      ? product.seo.keywords.map((k) => (typeof k === 'string' ? k : k.keyword || '')).filter(Boolean)
      : []
    : defaultKeywords

  return {
    title: product.seo?.metaTitle || `${product.name} | ${category} | Online Store`,
    description: product.seo?.metaDescription || defaultDescription,
    keywords: seoKeywords,
    openGraph: {
      title: product.seo?.ogTitle || product.seo?.metaTitle || `${product.name} | Online Store`,
      description:
        product.seo?.ogDescription || product.seo?.metaDescription || defaultDescription,
      type: 'website',
      url: `/products/${slug}`,
      images: thumbnail
        ? [
            {
              url: thumbnail,
              alt: product.name,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: product.seo?.metaTitle || product.name,
      description: product.seo?.metaDescription || defaultDescription,
      images: thumbnail ? [thumbnail] : undefined,
    },
    alternates: {
      canonical: `/products/${slug}`,
    },
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(product)

  return <ProductDetail product={product} relatedProducts={relatedProducts} />
}
