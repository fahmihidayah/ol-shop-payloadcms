import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getListAddressService } from '@/feature/account/services/addresses/get-list-address-service'
import type { ServiceContext } from '@/types/service-context'
import type { Address, Customer } from '@/payload-types'
import type { Payload, PaginatedDocs } from 'payload'

describe('getListAddressService', () => {
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
      find: vi.fn(),
    } as unknown as Payload

    // Setup service context
    serviceContext = {
      collection: 'addresses',
      payload: mockPayload,
      user: mockCustomer,
      sessionId: undefined,
    }
  })

  it('should return addresses for authenticated user', async () => {
    const mockAddresses: Address[] = [
      {
        id: 'address-1',
        label: 'Home',
        recipientName: 'John Doe',
        phone: '+1234567890',
        addressLine1: '123 Main St',
        city: 'New York',
        province: 'NY',
        postalCode: '10001',
        country: 'USA',
        customer: mockCustomer.id,
        isDefault: true,
        createdAt: new Date('2024-01-01').toISOString(),
        updatedAt: new Date('2024-01-01').toISOString(),
      } as Address,
      {
        id: 'address-2',
        label: 'Work',
        recipientName: 'John Doe',
        phone: '+1234567890',
        addressLine1: '456 Office Blvd',
        city: 'New York',
        province: 'NY',
        postalCode: '10002',
        country: 'USA',
        customer: mockCustomer.id,
        isDefault: false,
        createdAt: new Date('2024-01-02').toISOString(),
        updatedAt: new Date('2024-01-02').toISOString(),
      } as Address,
    ]

    const mockResult: PaginatedDocs<Address> = {
      docs: mockAddresses,
      totalDocs: 2,
      limit: 10,
      totalPages: 1,
      page: 1,
      pagingCounter: 1,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: null,
    }

    vi.mocked(mockPayload.find).mockResolvedValue(mockResult)

    const result = await getListAddressService({
      serviceContext,
    })

    expect(result.error).toBe(false)
    expect(result.data).toEqual(mockResult)
    expect(result.data?.docs).toHaveLength(2)
    expect(mockPayload.find).toHaveBeenCalledWith({
      collection: 'addresses',
      where: {
        customer: { equals: mockCustomer.id },
      },
      sort: '-createdAt',
    })
  })

  it('should return addresses for guest user with sessionId', async () => {
    serviceContext.user = undefined
    serviceContext.sessionId = 'session-456'

    const mockAddresses: Address[] = [
      {
        id: 'address-3',
        label: 'Shipping',
        recipientName: 'Jane Smith',
        phone: '+9876543210',
        addressLine1: '789 Guest Ave',
        city: 'Los Angeles',
        province: 'CA',
        postalCode: '90001',
        country: 'USA',
        sessionId: 'session-456',
        createdAt: new Date('2024-01-03').toISOString(),
        updatedAt: new Date('2024-01-03').toISOString(),
      } as Address,
    ]

    const mockResult: PaginatedDocs<Address> = {
      docs: mockAddresses,
      totalDocs: 1,
      limit: 10,
      totalPages: 1,
      page: 1,
      pagingCounter: 1,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: null,
    }

    vi.mocked(mockPayload.find).mockResolvedValue(mockResult)

    const result = await getListAddressService({
      serviceContext,
    })

    expect(result.error).toBe(false)
    expect(result.data).toEqual(mockResult)
    expect(result.data?.docs).toHaveLength(1)
    expect(mockPayload.find).toHaveBeenCalledWith({
      collection: 'addresses',
      where: {
        sessionId: { equals: 'session-456' },
      },
      sort: '-createdAt',
    })
  })

  it('should return error when no user or sessionId', async () => {
    serviceContext.user = undefined
    serviceContext.sessionId = undefined

    const result = await getListAddressService({
      serviceContext,
    })

    expect(result.error).toBe(true)
    expect(result.message).toBe('Address Not found')
    expect(result.data).toBeUndefined()
    expect(mockPayload.find).not.toHaveBeenCalled()
  })

  it('should return empty array when user has no addresses', async () => {
    const mockResult: PaginatedDocs<Address> = {
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
    }

    vi.mocked(mockPayload.find).mockResolvedValue(mockResult)

    const result = await getListAddressService({
      serviceContext,
    })

    expect(result.error).toBe(false)
    expect(result.data?.docs).toHaveLength(0)
    expect(result.data?.totalDocs).toBe(0)
  })

  it('should sort addresses by createdAt in descending order', async () => {
    const mockAddresses: Address[] = [
      {
        id: 'address-newest',
        label: 'Latest',
        recipientName: 'John Doe',
        phone: '+1234567890',
        addressLine1: '999 New St',
        city: 'New York',
        province: 'NY',
        postalCode: '10003',
        country: 'USA',
        customer: mockCustomer.id,
        createdAt: new Date('2024-03-01').toISOString(),
        updatedAt: new Date('2024-03-01').toISOString(),
      } as Address,
      {
        id: 'address-older',
        label: 'Older',
        recipientName: 'John Doe',
        phone: '+1234567890',
        addressLine1: '111 Old St',
        city: 'New York',
        province: 'NY',
        postalCode: '10004',
        country: 'USA',
        customer: mockCustomer.id,
        createdAt: new Date('2024-01-01').toISOString(),
        updatedAt: new Date('2024-01-01').toISOString(),
      } as Address,
    ]

    const mockResult: PaginatedDocs<Address> = {
      docs: mockAddresses,
      totalDocs: 2,
      limit: 10,
      totalPages: 1,
      page: 1,
      pagingCounter: 1,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: null,
    }

    vi.mocked(mockPayload.find).mockResolvedValue(mockResult)

    const result = await getListAddressService({
      serviceContext,
    })

    expect(result.error).toBe(false)
    expect(mockPayload.find).toHaveBeenCalledWith({
      collection: 'addresses',
      where: {
        customer: { equals: mockCustomer.id },
      },
      sort: '-createdAt',
    })
  })

  it('should handle payload.find throwing error', async () => {
    vi.mocked(mockPayload.find).mockRejectedValue(new Error('Database error'))

    await expect(
      getListAddressService({
        serviceContext,
      }),
    ).rejects.toThrow('Database error')
  })

  it('should return addresses only for the specific user', async () => {
    const differentUserId = 'user-999'
    const mockAddresses: Address[] = [
      {
        id: 'address-1',
        label: 'Home',
        recipientName: 'John Doe',
        phone: '+1234567890',
        addressLine1: '123 Main St',
        city: 'New York',
        province: 'NY',
        postalCode: '10001',
        country: 'USA',
        customer: mockCustomer.id, // Correct user
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Address,
    ]

    const mockResult: PaginatedDocs<Address> = {
      docs: mockAddresses,
      totalDocs: 1,
      limit: 10,
      totalPages: 1,
      page: 1,
      pagingCounter: 1,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: null,
    }

    vi.mocked(mockPayload.find).mockResolvedValue(mockResult)

    const result = await getListAddressService({
      serviceContext,
    })

    expect(result.error).toBe(false)
    expect(result.data?.docs.every((addr) => addr.customer === mockCustomer.id)).toBe(true)
    expect(mockPayload.find).toHaveBeenCalledWith({
      collection: 'addresses',
      where: {
        customer: { equals: mockCustomer.id },
      },
      sort: '-createdAt',
    })
  })

  it('should return addresses only for the specific sessionId', async () => {
    serviceContext.user = undefined
    serviceContext.sessionId = 'session-abc'

    const mockAddresses: Address[] = [
      {
        id: 'address-1',
        label: 'Guest Address',
        recipientName: 'Guest User',
        phone: '+1234567890',
        addressLine1: '123 Guest St',
        city: 'New York',
        province: 'NY',
        postalCode: '10001',
        country: 'USA',
        sessionId: 'session-abc', // Correct session
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Address,
    ]

    const mockResult: PaginatedDocs<Address> = {
      docs: mockAddresses,
      totalDocs: 1,
      limit: 10,
      totalPages: 1,
      page: 1,
      pagingCounter: 1,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: null,
    }

    vi.mocked(mockPayload.find).mockResolvedValue(mockResult)

    const result = await getListAddressService({
      serviceContext,
    })

    expect(result.error).toBe(false)
    expect(result.data?.docs.every((addr) => addr.sessionId === 'session-abc')).toBe(true)
    expect(mockPayload.find).toHaveBeenCalledWith({
      collection: 'addresses',
      where: {
        sessionId: { equals: 'session-abc' },
      },
      sort: '-createdAt',
    })
  })

  it('should prioritize user over sessionId when both exist', async () => {
    serviceContext.sessionId = 'session-456'

    const mockResult: PaginatedDocs<Address> = {
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
    }

    vi.mocked(mockPayload.find).mockResolvedValue(mockResult)

    await getListAddressService({
      serviceContext,
    })

    // Should query by user, not sessionId
    expect(mockPayload.find).toHaveBeenCalledWith({
      collection: 'addresses',
      where: {
        customer: { equals: mockCustomer.id },
      },
      sort: '-createdAt',
    })
  })
})
