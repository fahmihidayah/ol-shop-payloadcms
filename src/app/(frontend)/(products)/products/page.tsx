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
  title: 'Products | Online Store',
  description: 'Browse our collection of amazing products with filters and search',
}
