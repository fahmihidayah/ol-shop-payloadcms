'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Plus, MapPin } from 'lucide-react'
import type { Address } from '@/payload-types'
import { AddressForm, AddressFormData } from '@/modules/addresses/components'

interface AddressSelectorProps {
  addresses: Address[]
  selectedAddressId?: string
  onSelectAddress: (addressId: string) => void
}

export function AddressSelector({
  addresses,
  selectedAddressId,
  onSelectAddress,
}: AddressSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Shipping Address</h3>
        {addresses.length !== 0 && (
          <Button variant="outline" size="sm" asChild>
            <Link href="/profile/addresses/new">
              <Plus className="mr-2 h-4 w-4" />
              Add New
            </Link>
          </Button>
        )}
      </div>

      {addresses.length === 0 ? (
        <div className="">
          <AddressForm onSubmit={async (address: AddressFormData) => {}}></AddressForm>
        </div>
      ) : (
        <RadioGroup value={selectedAddressId} onValueChange={onSelectAddress}>
          <div className="space-y-3">
            {addresses.map((address) => (
              <div key={address.id} className="relative">
                <div className="flex items-start space-x-3 border rounded-lg p-4 hover:border-primary transition-colors cursor-pointer">
                  <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                  <Label htmlFor={address.id} className="flex-1 cursor-pointer">
                    <div className="font-semibold text-sm mb-1">{address.label}</div>
                    <div className="text-sm space-y-1">
                      <p className="font-medium">{address.recipientName}</p>
                      <p className="text-muted-foreground">{address.addressLine1}</p>
                      {address.addressLine2 && (
                        <p className="text-muted-foreground">{address.addressLine2}</p>
                      )}
                      <p className="text-muted-foreground">
                        {address.city}, {address.province} {address.postalCode}
                      </p>
                      <p className="text-muted-foreground">{address.phone}</p>
                    </div>
                  </Label>
                </div>
              </div>
            ))}
          </div>
        </RadioGroup>
      )}
    </div>
  )
}
