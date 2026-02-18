import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getListAddresses } from '@/feature/account/actions/addresses/get-list-address'
import * as customerUtils from '@/lib/customer-utils'
// import * as getListAddressServiceModule from '@/feature/account/services/addresses/get-list-address-service'
import type { Address, Customer } from '@/payload-types'
import type { PaginatedDocs } from 'payload'
import { cookies } from 'next/headers'
import { AddressService } from '@/feature/account/services/address-service'

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}))

vi.mock('@/lib/customer-utils')
vi.mock('@/feature/account/services/addresses/get-list-address-service')
vi.mock('payload', async (importOriginal) => {
  const actual = await importOriginal<typeof import('payload')>()
  return {
    ...actual,
    getPayload: vi.fn(),
  }
})

vi.mock('@/feature/account/services/address-service', () => ({
  AddressService: {
    create: vi.fn(),
    delete: vi.fn(),
    findAll: vi.fn(),
  },
}))

describe('getListAddresses action', () => {
  let mockCustomer: Customer
  let mockCookieStore: any

  beforeEach(() => {
    mockCustomer = {
      id: 'customer-123',
      email: 'test@example.com',
      name: 'Test Customer',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Customer

    mockCookieStore = {
      get: vi.fn(),
    }

    vi.mocked(cookies).mockResolvedValue(mockCookieStore as any)
  })

  afterEach(() => {
    vi.clearAllMocks()
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
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

    vi.mocked(customerUtils.getMeUser).mockResolvedValue({
      token: 'test-token',
      user: mockCustomer,
    })
    mockCookieStore.get.mockReturnValue({ value: 'session-123' })
    vi.mocked(AddressService.findAll).mockResolvedValue({
      data: mockResult,
      error: false,
    })

    const result = await getListAddresses()

    expect(result).toHaveLength(2)
    expect(result).toEqual(mockAddresses)
    expect(AddressService.findAll).toHaveBeenCalledWith({
      serviceContext: expect.objectContaining({
        collection: 'addresses',
        user: mockCustomer,
        sessionId: 'session-123',
      }),
    })
  })

  it('should return addresses for guest user with sessionId', async () => {
    const mockAddresses: Address[] = [
      {
        id: 'address-3',
        label: 'Shipping',
        recipientName: 'Guest User',
        phone: '+9876543210',
        addressLine1: '789 Guest Ave',
        city: 'Los Angeles',
        province: 'CA',
        postalCode: '90001',
        country: 'USA',
        sessionId: 'session-456',
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

    vi.mocked(customerUtils.getMeUser).mockResolvedValue({ token: '', user: undefined })
    mockCookieStore.get.mockReturnValue({ value: 'session-456' })
    vi.mocked(AddressService.findAll).mockResolvedValue({
      data: mockResult,
      error: false,
    })

    const result = await getListAddresses()

    expect(result).toHaveLength(1)
    expect(result).toEqual(mockAddresses)
  })

  it('should return empty array when service returns error', async () => {
    vi.mocked(customerUtils.getMeUser).mockResolvedValue({
      token: 'test-token',
      user: mockCustomer,
    })
    mockCookieStore.get.mockReturnValue({ value: 'session-123' })
    vi.mocked(AddressService.findAll).mockResolvedValue({
      data: undefined,
      error: true,
      message: 'Address Not found',
    })

    const result = await getListAddresses()

    expect(result).toEqual([])
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

    vi.mocked(customerUtils.getMeUser).mockResolvedValue({
      token: 'test-token',
      user: mockCustomer,
    })
    mockCookieStore.get.mockReturnValue({ value: 'session-123' })
    vi.mocked(AddressService.findAll).mockResolvedValue({
      data: mockResult,
      error: false,
    })

    const result = await getListAddresses()

    expect(result).toEqual([])
  })

  it('should handle service throwing error', async () => {
    vi.mocked(customerUtils.getMeUser).mockResolvedValue({
      token: 'test-token',
      user: mockCustomer,
    })
    mockCookieStore.get.mockReturnValue({ value: 'session-123' })
    vi.mocked(AddressService.findAll).mockRejectedValue(new Error('Database error'))

    const result = await getListAddresses()

    expect(result).toEqual([])
  })

  it('should handle missing sessionId cookie', async () => {
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

    vi.mocked(customerUtils.getMeUser).mockResolvedValue({
      token: 'test-token',
      user: mockCustomer,
    })
    mockCookieStore.get.mockReturnValue(undefined)
    vi.mocked(AddressService.findAll).mockResolvedValue({
      data: mockResult,
      error: false,
    })

    const result = await getListAddresses()

    expect(result).toEqual(mockAddresses)
    expect(AddressService.findAll).toHaveBeenCalledWith({
      serviceContext: expect.objectContaining({
        user: mockCustomer,
        sessionId: undefined,
      }),
    })
  })

  it('should return empty array when data is undefined', async () => {
    vi.mocked(customerUtils.getMeUser).mockResolvedValue({
      token: 'test-token',
      user: mockCustomer,
    })
    mockCookieStore.get.mockReturnValue({ value: 'session-123' })
    vi.mocked(AddressService.findAll).mockResolvedValue({
      data: undefined,
      error: false,
    })

    const result = await getListAddresses()

    expect(result).toEqual([])
  })

  it('should return empty array when docs is undefined', async () => {
    const mockResult = {
      totalDocs: 0,
      limit: 10,
      totalPages: 0,
      page: 1,
      pagingCounter: 1,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: null,
    } as PaginatedDocs<Address>

    vi.mocked(customerUtils.getMeUser).mockResolvedValue({
      token: 'test-token',
      user: mockCustomer,
    })
    mockCookieStore.get.mockReturnValue({ value: 'session-123' })
    vi.mocked(AddressService.findAll).mockResolvedValue({
      data: mockResult,
      error: false,
    })

    const result = await getListAddresses()

    expect(result).toEqual([])
  })

  it('should handle null user and sessionId', async () => {
    vi.mocked(customerUtils.getMeUser).mockResolvedValue({ token: '', user: undefined })
    mockCookieStore.get.mockReturnValue(undefined)
    vi.mocked(AddressService.findAll).mockResolvedValue({
      data: undefined,
      error: true,
      message: 'Address Not found',
    })

    const result = await getListAddresses()

    expect(result).toEqual([])
  })

  it('should return addresses sorted by creation date', async () => {
    const mockAddresses: Address[] = [
      {
        id: 'address-new',
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
        id: 'address-old',
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

    vi.mocked(customerUtils.getMeUser).mockResolvedValue({
      token: 'test-token',
      user: mockCustomer,
    })
    mockCookieStore.get.mockReturnValue({ value: 'session-123' })
    vi.mocked(AddressService.findAll).mockResolvedValue({
      data: mockResult,
      error: false,
    })

    const result = await getListAddresses()

    expect(result).toEqual(mockAddresses)
    expect(result[0].id).toBe('address-new')
    expect(result[1].id).toBe('address-old')
  })

  it('should handle non-Error exceptions', async () => {
    vi.mocked(customerUtils.getMeUser).mockResolvedValue({
      token: 'test-token',
      user: mockCustomer,
    })
    mockCookieStore.get.mockReturnValue({ value: 'session-123' })
    vi.mocked(AddressService.findAll).mockRejectedValue('String error')

    const result = await getListAddresses()

    expect(result).toEqual([])
  })
})
