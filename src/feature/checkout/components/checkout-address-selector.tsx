'use client'

import { useState } from 'react'
import type { Address } from '@/payload-types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { MapPin, Phone, Plus, User } from 'lucide-react'
import AddressForm from '@/feature/account/components/address/address-form'
import { useRouter } from 'next/navigation'

interface CheckoutAddressSelectorProps {
  addresses: Address[]
  selectedAddressId: string
  onSelect: (addressId: string) => void
}

export function CheckoutAddressSelector({
  addresses,
  selectedAddressId,
  onSelect,
}: CheckoutAddressSelectorProps) {
  const [showForm, setShowForm] = useState(false)
  const router = useRouter()

  const handleAddressCreated = () => {
    setShowForm(false)
    router.refresh()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Shipping Address
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {addresses.length > 0 && (
          <RadioGroup value={selectedAddressId} onValueChange={onSelect}>
            <div className="space-y-3">
              {addresses.map((address) => (
                <Label
                  key={address.id}
                  htmlFor={`address-${address.id}`}
                  className="flex items-start gap-3 rounded-lg border p-4 cursor-pointer transition-colors hover:bg-muted/50 has-[data-state=checked]:border-primary has-[data-state=checked]:bg-primary/5"
                >
                  <RadioGroupItem value={address.id} id={`address-${address.id}`} className="mt-1" />
                  <div className="flex-1 space-y-1 text-sm font-normal">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{address.label}</span>
                      {address.isDefault && (
                        <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <User className="h-3.5 w-3.5 shrink-0" />
                      {address.recipientName}
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Phone className="h-3.5 w-3.5 shrink-0" />
                      {address.phone}
                    </div>
                    <div className="flex items-start gap-1.5 text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                      <span>
                        {address.addressLine1}
                        {address.addressLine2 && `, ${address.addressLine2}`},{' '}
                        {address.city}, {address.province} {address.postalCode}
                      </span>
                    </div>
                  </div>
                </Label>
              ))}
            </div>
          </RadioGroup>
        )}

        {addresses.length === 0 && !showForm && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No saved addresses. Add one to continue.
          </p>
        )}

        {showForm ? (
          <div className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-sm">Add New Address</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
            <AddressForm onSuccess={handleAddressCreated} />
          </div>
        ) : (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowForm(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Address
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
