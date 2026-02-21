import { ListProduct } from '@/feature/products/components/list-product'

type Props = {
  params: Promise<{}>
  searchParams: Promise<{
    category?: string
  }>
}

export default async function ListProductPage(props: Props) {
  const category = (await props.searchParams).category
  console.log('category : ', category)
  return <ListProduct initialCategory={category} />
}

export const metadata = {
  title: 'Shop All Products | Browse Our Complete Collection | Online Store',
  description:
    'Explore our complete collection of quality products. Filter by category, price range, and more. Find exactly what you need with our advanced search and filtering options. Free shipping available.',
  keywords: [
    'shop products',
    'browse products',
    'product catalog',
    'online shopping',
    'product categories',
    'filter products',
    'search products',
    'buy online',
    'best prices',
    'quality items',
  ],
  openGraph: {
    title: 'Shop All Products | Online Store',
    description:
      'Browse our complete collection with advanced filters and search. Find the perfect product for you.',
    type: 'website',
    url: '/products',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shop All Products | Online Store',
    description: 'Browse our complete collection with advanced filters.',
  },
  alternates: {
    canonical: '/products',
  },
}
