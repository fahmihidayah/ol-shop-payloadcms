import { notFound } from 'next/navigation'
import { AddressFormPage } from '@/modules/addresses/templates/address-form-page'
import { getAddress, updateAddress } from '@/modules/addresses/actions'

interface EditAddressProps {
  params: Promise<
>
}

export default async function EditAddress({ params }: EditAddressProps) {
  const { address, success } = await getAddress(params.id)

  if (!success || !address) {
    notFound()
  }

  const handleUpdate = async (data: any) => {
    'use server'
    return updateAddress(params.id, data)
  }

  return <AddressFormPage address={address} onSubmit={handleUpdate} mode="edit" />
}
