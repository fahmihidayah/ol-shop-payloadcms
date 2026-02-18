import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  getListAddressEndpoint,
  getListAddressHandler,
} from '@/feature/account/api/addresses/get-list-address'
// import * as getListAddressServiceModule from '@/feature/account/services/addresses/get-list-address-service'
import * as serviceContextModule from '@/types/service-context'
import type { EnhancedRequest } from '@/feature/api/types/request'
import type { Address, Customer } from '@/payload-types'
import type { Payload, PaginatedDocs } from 'payload'
import { AddressService } from '@/feature/account/services/address-service'

// vi.mock('@/feature/account/services/addresses/get-list-address-service')
vi.mock('@/types/service-context')
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

describe('getListAddressEndpoint', () => {
  let mockPayload: Payload
  let mockCustomer: Customer
  let mockReq: EnhancedRequest

  beforeEach(() => {
    mockPayload = {
      find: vi.fn(),
    } as unknown as Payload

    mockCustomer = {
      id: 'customer-123',
      email: 'test@example.com',
      name: 'Test Customer',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Customer

    mockReq = {
      payload: mockPayload,
      user: mockCustomer,
      sessionId: 'session-123',
    } as unknown as EnhancedRequest

    vi.mocked(serviceContextModule.createServiceContext).mockResolvedValue({
      collection: 'addresses',
      payload: mockPayload,
      user: mockCustomer,
      sessionId: 'session-123',
    })
  })

  it('should have correct endpoint configuration', () => {
    expect(getListAddressEndpoint.path).toBe('/v1/addresses')
    expect(getListAddressEndpoint.method).toBe('get')
    expect(getListAddressEndpoint.handler).toBeDefined()
  })

  it('should return addresses successfully', async () => {
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

    vi.mocked(AddressService.findAll).mockResolvedValue({
      data: mockResult,
      error: false,
    })

    const response = await getListAddressHandler(mockReq)

    expect(response.code).toBe(200)
    expect(response.message).toBe('ok')
    expect(response.data).toEqual(mockAddresses)
    expect(serviceContextModule.createServiceContext).toHaveBeenCalledWith({
      collection: 'addresses',
      req: mockReq,
    })
  })

  it('should return empty array when no addresses found', async () => {
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

    vi.mocked(AddressService.findAll).mockResolvedValue({
      data: mockResult,
      error: false,
    })

    const response = await getListAddressHandler(mockReq)

    expect(response.code).toBe(200)
    expect(response.data).toEqual([])
  })

  it('should return error when service fails', async () => {
    vi.mocked(AddressService.findAll).mockResolvedValue({
      data: undefined,
      error: true,
      message: 'Failed to fetch addresses',
    })

    const response = await getListAddressHandler(mockReq)

    expect(response.code).toBe(400)
    expect(response.message).toBe('Failed to fetch addresses')
    expect(response.data).toBeNull()
  })

  it('should return default error message when service fails without message', async () => {
    vi.mocked(AddressService.findAll).mockResolvedValue({
      data: undefined,
      error: true,
    })

    const response = await getListAddressHandler(mockReq)

    expect(response.code).toBe(400)
    expect(response.message).toBe('Failed to fetch addresses')
  })

  it('should handle service returning undefined data', async () => {
    vi.mocked(AddressService.findAll).mockResolvedValue({
      data: undefined,
      error: false,
    })

    const response = await getListAddressHandler(mockReq)

    expect(response.code).toBe(200)
    expect(response.data).toEqual([])
  })

  it('should handle service returning data without docs', async () => {
    vi.mocked(AddressService.findAll).mockResolvedValue({
      data: {} as PaginatedDocs<Address>,
      error: false,
    })

    const response = await getListAddressHandler(mockReq)

    expect(response.code).toBe(200)
    expect(response.data).toEqual([])
  })

  it('should return multiple addresses', async () => {
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

    vi.mocked(AddressService.findAll).mockResolvedValue({
      data: mockResult,
      error: false,
    })

    const response = await getListAddressHandler(mockReq)

    expect(response.code).toBe(200)
    expect(response.data).toHaveLength(2)
    expect(response.data).toEqual(mockAddresses)
  })
})
