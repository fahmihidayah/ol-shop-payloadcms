import { AddressesListPage } from '@/modules/addresses/templates/addresses-list-page'
import { getAddresses, deleteAddress } from '@/modules/addresses/actions'

export default async function Addresses() {
  const { addresses } = await getAddresses()

  return <AddressesListPage addresses={addresses} onDelete={deleteAddress} />
}
