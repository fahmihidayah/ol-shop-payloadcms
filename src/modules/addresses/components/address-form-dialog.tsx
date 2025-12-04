'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { AddressForm, AddressFormData } from './address-form'
import type { Address } from '@/payload-types'

interface AddressFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  address?: Address
  onSubmit: (data: AddressFormData) => Promise<void>
}

export function AddressFormDialog({
  open,
  onOpenChange,
  address,
  onSubmit,
}: AddressFormDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (data: AddressFormData) => {
    setIsLoading(true)
    try {
      await onSubmit(data)
      onOpenChange(false)
    } catch (error) {
      console.error('Error submitting address:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{address ? 'Edit Address' : 'Add New Address'}</DialogTitle>
          <DialogDescription>
            {address
              ? 'Update your shipping address information'
              : 'Add a new shipping address for checkout'}
          </DialogDescription>
        </DialogHeader>
        <AddressForm address={address} onSubmit={handleSubmit} isLoading={isLoading} />
      </DialogContent>
    </Dialog>
  )
}
