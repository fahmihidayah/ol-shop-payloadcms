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
      title: 'Product Not Found',
    }
  }

  return {
    title: product.seo?.metaTitle || `${product.name} | Online Store`,
    description: product.seo?.metaDescription || product.name,
    openGraph: {
      title: product.seo?.ogTitle || product.seo?.metaTitle || product.name,
      description: product.seo?.ogDescription || product.seo?.metaDescription || product.name,
      type: 'website',
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
