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
      title: 'Page Not Found | Online Store',
      description: 'The requested page could not be found.',
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const seoTitle = page.seo?.title || `${page.title} | Online Store`
  const seoDescription = page.seo?.description || `${page.title} - Learn more about our services and offerings.`

  // Handle keywords (may be array of objects or strings)
  const seoKeywords = page.seo?.keywords
    ? Array.isArray(page.seo.keywords)
      ? page.seo.keywords.map((k) => (typeof k === 'string' ? k : k.keyword || '')).filter(Boolean)
      : []
    : [page.title, 'online store', 'information']

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: seoKeywords,
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      type: 'website',
      url: `/${slug}`,
      images: page.seo?.ogImage
        ? [
            {
              url:
                typeof page.seo.ogImage === 'string'
                  ? page.seo.ogImage
                  : (page.seo.ogImage as Media).url || '',
              alt: page.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription,
      images:
        page.seo?.ogImage && typeof page.seo.ogImage !== 'string'
          ? [(page.seo.ogImage as Media).url || '']
          : undefined,
    },
    robots: {
      index: !page.seo?.noIndex,
      follow: !page.seo?.noIndex,
    },
    alternates: {
      canonical: `/${slug}`,
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
