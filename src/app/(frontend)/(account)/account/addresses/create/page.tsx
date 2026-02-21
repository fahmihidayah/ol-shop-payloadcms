import AddressForm from '@/feature/account/components/address/address-form'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { getMeUser } from '@/lib/customer-utils'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Add New Address | My Addresses | Online Store',
  description:
    'Add a new shipping or billing address to your account. Save time on future orders by storing your delivery addresses securely.',
  keywords: [
    'add address',
    'new shipping address',
    'new billing address',
    'save address',
    'delivery location',
  ],
  openGraph: {
    title: 'Add New Address | Online Store',
    description: 'Quickly add a new delivery address to your account for faster checkout.',
    type: 'website',
  },
  robots: {
    index: false,
    follow: true,
  },
}

export default async function CreateAddressPage() {
  const user = await getMeUser()
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/account/addresses">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Add New Address</h1>
      </div>
      <AddressForm
        initial={{
          email: user.user?.email ?? '',
          recipientName: user.user?.name ?? '',
          phone: user.user?.phone ?? '',
        }}
      />
    </div>
  )
}
