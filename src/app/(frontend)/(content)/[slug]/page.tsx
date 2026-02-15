import { Metadata } from 'next'
import { getPageBySlug } from '@/feature/pages/actions'
import { PageContent, PageError } from '@/feature/pages/components'
import { Media } from '@/payload-types'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const page = await getPageBySlug(slug)

  if (!page) {
    return {
      title: 'Page Not Found',
    }
  }

  const seoTitle = page.seo?.title || page.title
  const seoDescription = page.seo?.description || undefined
  const seoKeywords = page.seo?.keywords || undefined

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: seoKeywords,
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      images: page.seo?.ogImage
        ? [
            {
              url:
                typeof page.seo.ogImage === 'string'
                  ? page.seo.ogImage
                  : (page.seo.ogImage as Media).url || '',
            },
          ]
        : undefined,
    },
    robots: {
      index: !page.seo?.noIndex,
      follow: !page.seo?.noIndex,
    },
  }
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params
  const page = await getPageBySlug(slug)

  if (!page) {
    return <PageError />
  }

  return <PageContent page={page} />
}
