import type { Address } from '@/payload-types'
import AddressCard from './address-card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { MapPin, Plus } from 'lucide-react'

interface AddressListProps {
  addresses: Address[]
}

export default function AddressList({ addresses }: AddressListProps) {
  if (addresses.length === 0) {
    return (
      <div className="text-center py-16">
        <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground mb-4">You have no saved addresses yet.</p>
        <Button asChild>
          <Link href="/account/addresses/create">
            <Plus className="h-4 w-4 mr-2" />
            Add Address
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">My Addresses</h2>
        <Button asChild size="sm">
          <Link href="/account/addresses/create">
            <Plus className="h-4 w-4 mr-2" />
            Add Address
          </Link>
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {addresses.map((address) => (
          <AddressCard key={address.id} address={address} />
        ))}
      </div>
    </div>
  )
}
