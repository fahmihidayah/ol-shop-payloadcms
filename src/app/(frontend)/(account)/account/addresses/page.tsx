import { getListAddresses } from '@/feature/account/actions/addresses/get-list-address'
import AddressList from '@/feature/account/components/address/address-list'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Addresses | Account | Online Store',
  description:
    'Manage your saved shipping and billing addresses. Add new addresses, edit existing ones, or set your default delivery location for faster checkout.',
  keywords: [
    'shipping addresses',
    'billing addresses',
    'manage addresses',
    'delivery addresses',
    'saved addresses',
    'address book',
  ],
  openGraph: {
    title: 'Manage Your Addresses | Online Store',
    description: 'View and manage all your saved shipping and billing addresses.',
    type: 'website',
  },
  robots: {
    index: false,
    follow: true,
  },
}

export default async function AddressesPage() {
  const addresses = await getListAddresses()

  return <AddressList addresses={addresses} />
}
