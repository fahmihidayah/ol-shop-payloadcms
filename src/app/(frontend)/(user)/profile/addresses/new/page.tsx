import { AddressFormPage } from '@/modules/addresses/templates/address-form-page'
import { createAddress } from '@/modules/addresses/actions'

export default function NewAddress() {
  return <AddressFormPage onSubmit={createAddress} mode="create" />
}
