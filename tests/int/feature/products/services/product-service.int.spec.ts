import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { getPayload, Payload } from 'payload'
import config from '@payload-config'
import { ProductService } from '@/feature/products/services/product-service'
import { CartItem, OrderItem, Product } from '@/payload-types'

describe('ProductService - decreaseProductStock', () => {
  let payload: Payload
  let testProduct: Product
  let testVariantId: string

  beforeAll(
    async () => {
      payload = await getPayload({ config })

      // Create a test product with variants
      testProduct = await payload.create({
        collection: 'products',
        data: {
          name: 'Test Product for Stock Decrement',
          slug: 'test-stock-decrement-product',
          description: 'Test product',
          isActive: true,
          'product-variant': [
            {
              sku: 'TEST-VAR-001',
              name: 'Variant 1',
              price: 100000,
              stockQuantity: 50,
              isActive: true,
            },
            {
              sku: 'TEST-VAR-002',
              name: 'Variant 2',
              price: 150000,
              stockQuantity: 30,
              isActive: true,
            },
          ],
        },
      })

      // Get the first variant ID
      testVariantId = testProduct['product-variant']![0].id!
    },
    30000, // 30 second timeout for beforeAll
  )

  afterAll(async () => {
    // Cleanup: Delete test product
    if (testProduct?.id) {
      await payload.delete({
        collection: 'products',
        id: testProduct.id,
      })
    }
  })

  it('should decrease stock for the correct variant', async () => {
    // Arrange
    const initialStock = testProduct['product-variant']![0].stockQuantity
    const quantityToDecrease = 5

    const mockCartItem: CartItem = {
      id: 'cart-item-1',
      product: testProduct,
      variant: testVariantId,
      quantity: quantityToDecrease,
      price: 100000,
      subtotal: 500000,
    } as CartItem

    // Act
    await ProductService.decreaseProductStock({
      context: { payload },
      cartItem: mockCartItem,
    })

    // Assert
    const updatedProduct = await payload.findByID({
      collection: 'products',
      id: testProduct.id,
    })

    const updatedVariant = updatedProduct['product-variant']?.find((v) => v.id === testVariantId)
    expect(updatedVariant?.stockQuantity).toBe(initialStock - quantityToDecrease)
  })

  it('should not affect stock of other variants', async () => {
    // Arrange
    const secondVariantId = testProduct['product-variant']![1].id!
    const secondVariantInitialStock = testProduct['product-variant']![1].stockQuantity

    const mockCartItem: CartItem = {
      id: 'cart-item-2',
      product: testProduct,
      variant: testVariantId, // First variant
      quantity: 3,
      price: 100000,
      subtotal: 300000,
    } as CartItem

    // Act
    await ProductService.decreaseProductStock({
      context: { payload },
      cartItem: mockCartItem,
    })

    // Assert
    const updatedProduct = await payload.findByID({
      collection: 'products',
      id: testProduct.id,
    })

    const secondVariant = updatedProduct['product-variant']?.find((v) => v.id === secondVariantId)
    expect(secondVariant?.stockQuantity).toBe(secondVariantInitialStock)
  })

  it('should handle multiple decrements correctly', async () => {
    // Arrange
    const mockCartItem1: CartItem = {
      id: 'cart-item-3',
      product: testProduct,
      variant: testVariantId,
      quantity: 2,
      price: 100000,
      subtotal: 200000,
    } as CartItem

    const mockCartItem2: CartItem = {
      id: 'cart-item-4',
      product: testProduct,
      variant: testVariantId,
      quantity: 3,
      price: 100000,
      subtotal: 300000,
    } as CartItem

    // Get current stock before decrements
    const productBefore = await payload.findByID({
      collection: 'products',
      id: testProduct.id,
    })
    const stockBefore = productBefore['product-variant']?.find((v) => v.id === testVariantId)
      ?.stockQuantity!

    // Act
    await ProductService.decreaseProductStock({
      context: { payload },
      cartItem: mockCartItem1,
    })

    await ProductService.({
      context: { payload },
      cartItem: mockCartItem2,
    })

    // Assert
    const updatedProduct = await payload.findByID({
      collection: 'products',
      id: testProduct.id,
    })

    const updatedVariant = updatedProduct['product-variant']?.find((v) => v.id === testVariantId)
    expect(updatedVariant?.stockQuantity).toBe(stockBefore - 2 - 3)
  })

  it('should allow stock to go to zero', async () => {
    // Arrange: Get current stock
    const productBefore = await payload.findByID({
      collection: 'products',
      id: testProduct.id,
    })
    const currentStock = productBefore['product-variant']?.find((v) => v.id === testVariantId)
      ?.stockQuantity!

    const mockCartItem: OrderItem = {
      id: 'cart-item-5',
      product: testProduct,
      variant: testVariantId,
      quantity: currentStock, // Buy all remaining stock
      price: 100000,
      subtotal: currentStock * 100000,
    } as OrderItem

    // Act
    await ProductService.decreaseProductStock({
      context: { payload },
      orderItem: mockCartItem,
    })

    // Assert
    const updatedProduct = await payload.findByID({
      collection: 'products',
      id: testProduct.id,
    })

    const updatedVariant = updatedProduct['product-variant']?.find((v) => v.id === testVariantId)
    expect(updatedVariant?.stockQuantity).toBe(0)
  })

  it('should handle product with no variants gracefully', async () => {
    // Arrange: Create product with no variants
    const productWithoutVariants = await payload.create({
      collection: 'products',
      data: {
        name: 'Product Without Variants',
        slug: 'no-variants-product-test',
        description: 'Test',
        isActive: true,
      },
    })

    const mockCartItem: CartItem = {
      id: 'cart-item-6',
      product: productWithoutVariants,
      variant: 'non-existent-variant',
      quantity: 5,
      price: 100000,
      subtotal: 500000,
    } as CartItem

    // Act & Assert: Should not throw error
    await expect(
      ProductService.decreaseProductStock({
        context: { payload },
        cartItem: mockCartItem,
      }),
    ).resolves.not.toThrow()

    // Cleanup
    await payload.delete({
      collection: 'products',
      id: productWithoutVariants.id,
    })
  })
})
