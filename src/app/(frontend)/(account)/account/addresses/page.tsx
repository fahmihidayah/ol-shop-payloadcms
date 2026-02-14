import { getListAddresses } from '@/feature/account/actions/address'
import AddressList from '@/feature/account/components/address/address-list'

export default async function AddressesPage() {
  const addresses = await getListAddresses()

  return <AddressList addresses={addresses} />
}
