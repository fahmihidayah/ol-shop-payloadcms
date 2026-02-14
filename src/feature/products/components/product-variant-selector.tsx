'use client'

import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Product } from '@/payload-types'

interface ProductVariantSelectorProps {
  product: Product
  selectedVariantId: string
  onVariantChange: (variantId: string) => void
}

export function ProductVariantSelector({
  product,
  selectedVariantId,
  onVariantChange,
}: ProductVariantSelectorProps) {
  const variants = product['product-variant']?.filter((v) => v.isActive) || []

  // If no variants, return null
  if (variants.length === 0) {
    return null
  }

  // If only one variant, show as text
  if (variants.length === 1) {
    return (
      <div className="space-y-2">
        <Label>Variant</Label>
        <p className="text-sm text-muted-foreground">{variants[0].variant}</p>
      </div>
    )
  }

  // If multiple variants, show dropdown selector
  return (
    <div className="space-y-2">
      <Label htmlFor="variant-select">Select Variant</Label>
      <Select value={selectedVariantId} onValueChange={onVariantChange}>
        <SelectTrigger id="variant-select">
          <SelectValue placeholder="Choose a variant" />
        </SelectTrigger>
        <SelectContent>
          {variants.map((variant) => (
            <SelectItem key={variant.id} value={variant.id!}>
              {variant.variant}
              {variant.stockQuantity !== undefined && (
                <span className="ml-2 text-xs text-muted-foreground">
                  ({variant.stockQuantity} in stock)
                </span>
              )}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
