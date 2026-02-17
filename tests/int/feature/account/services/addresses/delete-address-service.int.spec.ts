import { describe, it, expect, vi, beforeEach } from 'vitest'
import { deleteAddressService } from '@/feature/account/services/addresses/delete-address-service'
import type { ServiceContext } from '@/types/service-context'
import type { Address, Customer } from '@/payload-types'
import type { Payload } from 'payload'

describe('deleteAddressService', () => {
  let mockPayload: Payload
  let mockCustomer: Customer
  let serviceContext: ServiceContext

  beforeEach(() => {
    // Mock customer
    mockCustomer = {
      id: 'customer-123',
      email: 'test@example.com',
      name: 'Test Customer',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Customer

    // Mock payload
    mockPayload = {
      delete: vi.fn(),
    } as unknown as Payload

    // Setup service context
    serviceContext = {
      collection: 'addresses',
      payload: mockPayload,
      user: mockCustomer,
      sessionId: undefined,
    }
  })

  it('should delete address for authenticated user', async () => {
    const addressId = 'address-123'
    const mockDeletedAddress: Address = {
      id: addressId,
      label: 'Home',
      recipientName: 'John Doe',
      phone: '+1234567890',
      addressLine1: '123 Main St',
      city: 'New York',
      province: 'NY',
      postalCode: '10001',
      country: 'USA',
      customer: mockCustomer.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Address

    const mockDeleteResult = {
      docs: [mockDeletedAddress],
      totalDocs: 1,
      limit: 10,
      totalPages: 1,
      page: 1,
      pagingCounter: 1,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: null,
    } as any

    vi.mocked(mockPayload.delete).mockResolvedValue(mockDeleteResult)

    const result = await deleteAddressService({
      id: addressId,
      serviceContext,
    })

    expect(result.error).toBe(false)
    expect(result.data).toEqual(mockDeletedAddress)
    expect(mockPayload.delete).toHaveBeenCalledWith({
      collection: 'addresses',
      where: {
        and: [
          {
            id: {
              equals: addressId,
            },
          },
          {
            customer: {
              equals: mockCustomer.id,
            },
          },
        ],
      },
    })
  })

  it('should delete address for guest user with sessionId', async () => {
    serviceContext.user = undefined
    serviceContext.sessionId = 'session-456'

    const addressId = 'address-456'
    const mockDeletedAddress: Address = {
      id: addressId,
      label: 'Work',
      recipientName: 'Jane Smith',
      phone: '+9876543210',
      addressLine1: '456 Office Blvd',
      city: 'Los Angeles',
      province: 'CA',
      postalCode: '90001',
      country: 'USA',
      sessionId: 'session-456',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Address

    const mockDeleteResult = {
      docs: [mockDeletedAddress],
      totalDocs: 1,
      limit: 10,
      totalPages: 1,
      page: 1,
      pagingCounter: 1,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: null,
    } as any

    vi.mocked(mockPayload.delete).mockResolvedValue(mockDeleteResult)

    const result = await deleteAddressService({
      id: addressId,
      serviceContext,
    })

    expect(result.error).toBe(false)
    expect(result.data).toEqual(mockDeletedAddress)
    expect(mockPayload.delete).toHaveBeenCalledWith({
      collection: 'addresses',
      where: {
        and: [
          {
            id: {
              equals: addressId,
            },
          },
          {
            sessionId: {
              equals: 'session-456',
            },
          },
        ],
      },
    })
  })

  it('should return error when no user or sessionId provided', async () => {
    serviceContext.user = undefined
    serviceContext.sessionId = undefined

    const result = await deleteAddressService({
      id: 'address-123',
      serviceContext,
    })

    expect(result.error).toBe(true)
    expect(result.message).toBe('User not found')
    expect(result.data).toBeUndefined()
    expect(mockPayload.delete).not.toHaveBeenCalled()
  })

  it('should return error when address not found', async () => {
    const mockDeleteResult = {
      docs: [],
      totalDocs: 0,
      limit: 10,
      totalPages: 0,
      page: 1,
      pagingCounter: 1,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: null,
    } as any

    vi.mocked(mockPayload.delete).mockResolvedValue(mockDeleteResult)

    const result = await deleteAddressService({
      id: 'non-existent-address',
      serviceContext,
    })

    expect(result.error).toBe(true)
    expect(result.message).toBe('failed to delete ')
    expect(result.data).toBeUndefined()
  })

  it('should return error when delete returns null', async () => {
    vi.mocked(mockPayload.delete).mockResolvedValue(null as any)

    const result = await deleteAddressService({
      id: 'address-123',
      serviceContext,
    })

    expect(result.error).toBe(true)
    expect(result.message).toBe('failed to delete ')
    expect(result.data).toBeUndefined()
  })

  it('should verify ownership before deleting (authenticated user)', async () => {
    const addressId = 'address-789'
    const differentUserId = 'user-999'

    // Simulating that the address belongs to a different user
    // The where clause should prevent deletion
    const mockDeleteResult = {
      docs: [],
      totalDocs: 0,
      limit: 10,
      totalPages: 0,
      page: 1,
      pagingCounter: 1,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: null,
    } as any

    vi.mocked(mockPayload.delete).mockResolvedValue(mockDeleteResult)

    const result = await deleteAddressService({
      id: addressId,
      serviceContext,
    })

    expect(result.error).toBe(true)
    expect(mockPayload.delete).toHaveBeenCalledWith({
      collection: 'addresses',
      where: {
        and: [
          {
            id: {
              equals: addressId,
            },
          },
          {
            customer: {
              equals: mockCustomer.id,
            },
          },
        ],
      },
    })
  })

  it('should verify ownership before deleting (guest user)', async () => {
    serviceContext.user = undefined
    serviceContext.sessionId = 'session-123'

    const addressId = 'address-999'

    const mockDeleteResult = {
      docs: [],
      totalDocs: 0,
      limit: 10,
      totalPages: 0,
      page: 1,
      pagingCounter: 1,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: null,
    } as any

    vi.mocked(mockPayload.delete).mockResolvedValue(mockDeleteResult)

    const result = await deleteAddressService({
      id: addressId,
      serviceContext,
    })

    expect(result.error).toBe(true)
    expect(mockPayload.delete).toHaveBeenCalledWith({
      collection: 'addresses',
      where: {
        and: [
          {
            id: {
              equals: addressId,
            },
          },
          {
            sessionId: {
              equals: 'session-123',
            },
          },
        ],
      },
    })
  })

  it('should handle payload.delete throwing error', async () => {
    vi.mocked(mockPayload.delete).mockRejectedValue(new Error('Database error'))

    await expect(
      deleteAddressService({
        id: 'address-123',
        serviceContext,
      }),
    ).rejects.toThrow('Database error')
  })

  it('should handle empty string for user id', async () => {
    serviceContext.user = { ...mockCustomer, id: '' }

    const mockDeleteResult = {
      docs: [],
      totalDocs: 0,
      limit: 10,
      totalPages: 0,
      page: 1,
      pagingCounter: 1,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: null,
    } as any

    vi.mocked(mockPayload.delete).mockResolvedValue(mockDeleteResult)

    const result = await deleteAddressService({
      id: 'address-123',
      serviceContext,
    })

    expect(result.error).toBe(true)
    expect(mockPayload.delete).toHaveBeenCalledWith({
      collection: 'addresses',
      where: {
        and: [
          {
            id: {
              equals: 'address-123',
            },
          },
          {
            customer: {
              equals: '',
            },
          },
        ],
      },
    })
  })

  it('should handle empty string for sessionId', async () => {
    serviceContext.user = undefined
    serviceContext.sessionId = ''

    const result = await deleteAddressService({
      id: 'address-123',
      serviceContext,
    })

    expect(result.error).toBe(true)
    expect(result.message).toBe('User not found')
  })
})
