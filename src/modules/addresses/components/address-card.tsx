'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { MapPin, Phone, Edit, Trash2 } from 'lucide-react'
import type { Address } from '@/payload-types'

interface AddressCardProps {
  address: Address
  onDelete: (id: string, label: string) => void
}

export function AddressCard({ address, onDelete }: AddressCardProps) {
  return (
    <div className="bg-card rounded-lg border p-4 hover:border-primary/50 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">{address.label}</h3>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/profile/addresses/${address.id}/edit`}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(address.id, address.label)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Address Details */}
      <div className="space-y-2 text-sm">
        <p className="font-medium">{address.recipientName}</p>
        <p className="text-muted-foreground">{address.addressLine1}</p>
        {address.addressLine2 && (
          <p className="text-muted-foreground">{address.addressLine2}</p>
        )}
        <p className="text-muted-foreground">
          {address.city}, {address.province} {address.postalCode}
        </p>
        {address.country && <p className="text-muted-foreground">{address.country}</p>}
        <div className="flex items-center gap-2 pt-2 text-muted-foreground">
          <Phone className="h-3 w-3" />
          <span>{address.phone}</span>
        </div>
      </div>
    </div>
  )
}
