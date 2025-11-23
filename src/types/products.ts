import { Media } from '@/payload-types'

export type ProductVariantType = {
  variant?: string | null
  /**
   * Stock Keeping Unit - unique identifier
   */
  sku: string
  /**
   * Current selling price
   */
  price: number
  /**
   * Show as strikethrough if different from current price
   */
  oldPrice?: number | null
  /**
   * Your cost for this variant (internal use)
   */
  cost?: number | null
  stockQuantity: number
  /**
   * Get notified when stock falls below this number
   */
  lowStockThreshold?: number | null
  /**
   * Product weight for shipping calculations
   */
  weight?: number | null
  dimensions?: {
    length?: number | null
    width?: number | null
    height?: number | null
  }
  /**
   * Specific image for this variant
   */
  image?: (string | null) | Media
  /**
   * Make this variant available for purchase
   */
  isActive?: boolean | null
  id?: string | null
}
