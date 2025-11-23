'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { AddressForm, type AddressFormData } from '../components/address-form'
import { toast } from 'sonner'
import type { Address } from '@/payload-types'

interface AddressFormPageProps {
  address?: Address
  onSubmit: (data: AddressFormData) => Promise<{ success: boolean; message?: string }>
  mode: 'create' | 'edit'
}

export function AddressFormPage({ address, onSubmit, mode }: AddressFormPageProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (data: AddressFormData) => {
    setIsLoading(true)

    try {
      const result = await onSubmit(data)

      if (result.success) {
        toast.success(mode === 'create' ? 'Address created successfully' : 'Address updated successfully')
        router.push('/profile/addresses')
      } else {
        toast.error(result.message || `Failed to ${mode} address`)
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : `Failed to ${mode} address`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/profile/addresses">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Addresses
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">
          {mode === 'create' ? 'Add New Address' : 'Edit Address'}
        </h1>
        <p className="text-muted-foreground mt-2">
          {mode === 'create'
            ? 'Add a new delivery address to your account'
            : 'Update your delivery address information'}
        </p>
      </div>

      {/* Address Form */}
      <div className="bg-card rounded-lg border p-6">
        <AddressForm address={address} onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  )
}
