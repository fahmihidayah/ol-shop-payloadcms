'use client'

import { useState } from 'react'
import { useCartStore, useCartItems, useCartTotalItems, useCartTotalPrice } from '@/store'
import { CartItem } from '../components/cart-item'
import { CartSummary } from '../components/cart-summary'
import { CartEmpty } from '../components/cart-empty'
import { DeleteConfirmationModal } from '../components/delete-confirmation-modal'
import { toast } from 'sonner'
import { ShoppingCart } from 'lucide-react'

export function CartPage() {
  const items = useCartItems()
  const totalItems = useCartTotalItems()
  const totalPrice = useCartTotalPrice()
  const isLoading = useCartStore((state) => state.isLoading)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const removeItem = useCartStore((state) => state.removeItem)

  // Delete confirmation modal state
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean
    itemId: string | null
    itemTitle: string | null
  }>({
    isOpen: false,
    itemId: null,
    itemTitle: null,
  })

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    try {
      updateQuantity(itemId, quantity)
      toast.success('Quantity updated')
    } catch (error) {
      toast.error('Failed to update quantity')
    }
  }

  const handleRemoveClick = (itemId: string, itemTitle: string) => {
    setDeleteModal({
      isOpen: true,
      itemId,
      itemTitle,
    })
  }

  const handleConfirmDelete = async () => {
    if (!deleteModal.itemId) return

    try {
      await removeItem(deleteModal.itemId)
      toast.success('Item removed from cart')
      setDeleteModal({ isOpen: false, itemId: null, itemTitle: null })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to remove item')
    }
  }

  const handleCancelDelete = () => {
    setDeleteModal({ isOpen: false, itemId: null, itemTitle: null })
  }

  // Show empty state if no items
  if (items.length === 0 && !isLoading) {
    return <CartEmpty />
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8 sm:py-12">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <ShoppingCart className="h-8 w-8 text-primary" />
            <h1 className="text-3xl sm:text-4xl font-bold">Shopping Cart</h1>
          </div>
          <p className="text-muted-foreground">
            {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg border">
              {/* Desktop Table Headers */}
              <div className="hidden sm:grid grid-cols-[1fr_120px_120px_48px] gap-4 px-6 py-4 border-b bg-muted/30 font-semibold text-sm">
                <div>Product</div>
                <div className="text-right">Price</div>
                <div className="text-right">Subtotal</div>
                <div></div>
              </div>

              {/* Cart Items */}
              <div className="divide-y px-4 sm:px-6">
                {isLoading && items.length === 0 ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                  </div>
                ) : (
                  items.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onUpdateQuantity={handleUpdateQuantity}
                      onRemove={handleRemoveClick}
                      isLoading={isLoading}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Additional Info for Mobile */}
            <div className="mt-6 p-4 bg-muted/30 rounded-lg border lg:hidden">
              <h3 className="font-semibold mb-3">Order Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Items ({totalItems})</span>
                  <span className="font-medium">
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0,
                    }).format(totalPrice)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Cart Summary - Sidebar */}
          <div className="lg:col-span-1">
            <CartSummary totalItems={totalItems} totalPrice={totalPrice} isLoading={isLoading} />
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        itemTitle={deleteModal.itemTitle || undefined}
        isLoading={isLoading}
      />
    </>
  )
}
