'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, MapPin } from 'lucide-react'
import { AddressCard } from '../components/address-card'
import { DeleteAddressDialog } from '../components/delete-address-dialog'
import { toast } from 'sonner'
import type { Address } from '@/payload-types'

interface AddressesListPageProps {
  addresses: Address[]
  onDelete: (id: string) => Promise<{ success: boolean; message?: string }>
}

export function AddressesListPage({ addresses, onDelete }: AddressesListPageProps) {
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean
    id: string | null
    label: string | null
  }>({
    isOpen: false,
    id: null,
    label: null,
  })
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteClick = (id: string, label: string) => {
    setDeleteDialog({ isOpen: true, id, label })
  }

  const handleConfirmDelete = async () => {
    if (!deleteDialog.id) return

    setIsDeleting(true)
    try {
      const result = await onDelete(deleteDialog.id)

      if (result.success) {
        toast.success('Address deleted successfully')
        setDeleteDialog({ isOpen: false, id: null, label: null })
        // Refresh the page to show updated list
        window.location.reload()
      } else {
        toast.error(result.message || 'Failed to delete address')
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete address')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCancelDelete = () => {
    setDeleteDialog({ isOpen: false, id: null, label: null })
  }

  return (
    <>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Addresses</h1>
            <p className="text-muted-foreground mt-2">Manage your delivery addresses</p>
          </div>
          <Button asChild>
            <Link href="/profile/addresses/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Address
            </Link>
          </Button>
        </div>

        {/* Addresses List */}
        {addresses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 bg-muted/30 rounded-lg border">
            <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No addresses yet</h3>
            <p className="text-muted-foreground text-center mb-6">
              Add your first delivery address to make checkout faster
            </p>
            <Button asChild>
              <Link href="/profile/addresses/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Address
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {addresses.map((address) => (
              <AddressCard key={address.id} address={address} onDelete={handleDeleteClick} />
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteAddressDialog
        isOpen={deleteDialog.isOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        addressLabel={deleteDialog.label || ''}
        isLoading={isDeleting}
      />
    </>
  )
}
