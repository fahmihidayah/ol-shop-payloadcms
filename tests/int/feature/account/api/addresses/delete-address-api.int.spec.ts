import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  deleteAddressEndpoint,
  deleteAddressHandler,
} from '@/feature/account/api/addresses/delete-address-api'
import * as deleteAddressServiceModule from '@/feature/account/services/addresses/delete-address-service'
import * as serviceContextModule from '@/types/service-context'
import type { EnhancedRequest } from '@/feature/api/types/request'
import type { Address, Customer } from '@/payload-types'
import type { Payload } from 'payload'

vi.mock('@/feature/account/services/addresses/delete-address-service')
vi.mock('@/types/service-context')
vi.mock('payload', async (importOriginal) => {
  const actual = await importOriginal<typeof import('payload')>()
  return {
    ...actual,
    getPayload: vi.fn(),
  }
})

describe('deleteAddressEndpoint', () => {
  let mockPayload: Payload
  let mockCustomer: Customer
  let mockReq: EnhancedRequest

  beforeEach(() => {
    vi.clearAllMocks()

    mockPayload = {
      delete: vi.fn(),
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
      routeParams: {
        id: 'address-123',
      },
    } as unknown as EnhancedRequest

    vi.mocked(serviceContextModule.createServiceContext).mockResolvedValue({
      collection: 'addresses',
      payload: mockPayload,
      user: mockCustomer,
      sessionId: 'session-123',
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should have correct endpoint configuration', () => {
    expect(deleteAddressEndpoint.path).toBe('/v1/addresses/:id')
    expect(deleteAddressEndpoint.method).toBe('delete')
    expect(deleteAddressEndpoint.handler).toBeDefined()
  })

  it('should delete address successfully', async () => {
    const mockDeletedAddress: Address = {
      id: 'address-123',
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

    vi.mocked(deleteAddressServiceModule.deleteAddressService).mockResolvedValue({
      data: mockDeletedAddress,
      error: false,
    })

    const response = await deleteAddressHandler(mockReq)

    expect(response.code).toBe(200)
    expect(response.success).toBe(true)
    expect(response.message).toBe('Address deleted successfully')
    expect(response.data).toEqual(mockDeletedAddress)
    expect(serviceContextModule.createServiceContext).toHaveBeenCalledWith({
      collection: 'addresses',
      req: mockReq,
    })
    expect(deleteAddressServiceModule.deleteAddressService).toHaveBeenCalledWith({
      id: 'address-123',
      serviceContext: expect.objectContaining({
        collection: 'addresses',
        user: mockCustomer,
        sessionId: 'session-123',
      }),
    })
  })

  it('should return error when address ID is missing', async () => {
    mockReq.routeParams = {}

    const response = await deleteAddressHandler(mockReq)

    expect(response.code).toBe(400)
    expect(response.message).toBe('Address ID is required')
    expect(response.success).toBe(false)
    expect(deleteAddressServiceModule.deleteAddressService).not.toHaveBeenCalled()
  })

  it('should return error when routeParams is undefined', async () => {
    mockReq.routeParams = undefined

    const response = await deleteAddressHandler(mockReq)

    expect(response.code).toBe(400)
    expect(response.message).toBe('Address ID is required')
    expect(response.success).toBe(false)
  })

  it('should return error when service fails', async () => {
    vi.mocked(deleteAddressServiceModule.deleteAddressService).mockResolvedValue({
      data: undefined,
      error: true,
      message: 'Address not found',
    })

    const response = await deleteAddressHandler(mockReq)

    expect(response.code).toBe(400)
    expect(response.success).toBe(false)
    expect(response.message).toBe('Address not found')
  })

  it('should return default error message when service fails without message', async () => {
    vi.mocked(deleteAddressServiceModule.deleteAddressService).mockResolvedValue({
      data: undefined,
      error: true,
    })

    const response = await deleteAddressHandler(mockReq)

    expect(response.code).toBe(400)
    expect(response.message).toBe('Failed to delete address')
  })

  it('should delete address for guest user with sessionId', async () => {
    const mockDeletedAddress: Address = {
      id: 'address-456',
      label: 'Guest Address',
      recipientName: 'Guest User',
      phone: '+9876543210',
      addressLine1: '456 Guest St',
      city: 'Los Angeles',
      province: 'CA',
      postalCode: '90001',
      country: 'USA',
      sessionId: 'session-456',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Address

    mockReq.user = null
    mockReq.sessionId = 'session-456'
    mockReq.routeParams = { id: 'address-456' }

    vi.mocked(serviceContextModule.createServiceContext).mockResolvedValue({
      collection: 'addresses',
      payload: mockPayload,
      user: undefined,
      sessionId: 'session-456',
    })

    vi.mocked(deleteAddressServiceModule.deleteAddressService).mockResolvedValue({
      data: mockDeletedAddress,
      error: false,
    })

    const response = await deleteAddressHandler(mockReq)

    expect(response.code).toBe(200)
    expect(response.success).toBe(true)
    expect(response.data).toEqual(mockDeletedAddress)
  })

  it('should handle unauthorized deletion attempt', async () => {
    vi.mocked(deleteAddressServiceModule.deleteAddressService).mockResolvedValue({
      data: undefined,
      error: true,
      message: 'User not found',
    })

    const response = await deleteAddressHandler(mockReq)

    expect(response.code).toBe(400)
    expect(response.success).toBe(false)
    expect(response.message).toBe('User not found')
  })

  it('should handle different address IDs', async () => {
    const addressIds = ['addr-1', 'addr-2', 'addr-3']

    for (const addressId of addressIds) {
      mockReq.routeParams = { id: addressId }

      const mockDeletedAddress: Address = {
        id: addressId,
        label: 'Test',
        recipientName: 'Test User',
        phone: '+1234567890',
        addressLine1: '123 Test St',
        city: 'Test City',
        province: 'TC',
        postalCode: '12345',
        country: 'USA',
        customer: mockCustomer.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Address

      vi.mocked(deleteAddressServiceModule.deleteAddressService).mockResolvedValue({
        data: mockDeletedAddress,
        error: false,
      })

      const response = await deleteAddressHandler(mockReq)

      expect(response.code).toBe(200)
      expect(response.success).toBe(true)
      expect(deleteAddressServiceModule.deleteAddressService).toHaveBeenCalledWith({
        id: addressId,
        serviceContext: expect.any(Object),
      })
    }
  })

  it('should return error when trying to delete non-existent address', async () => {
    mockReq.routeParams = { id: 'non-existent-id' }

    vi.mocked(deleteAddressServiceModule.deleteAddressService).mockResolvedValue({
      data: undefined,
      error: true,
      message: 'failed to delete ',
    })

    const response = await deleteAddressHandler(mockReq)

    expect(response.code).toBe(400)
    expect(response.success).toBe(false)
    expect(response.message).toBe('failed to delete ')
  })

  it('should handle numeric address ID', async () => {
    mockReq.routeParams = { id: '12345' }

    const mockDeletedAddress: Address = {
      id: '12345',
      label: 'Test',
      recipientName: 'Test User',
      phone: '+1234567890',
      addressLine1: '123 Test St',
      city: 'Test City',
      province: 'TC',
      postalCode: '12345',
      country: 'USA',
      customer: mockCustomer.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Address

    vi.mocked(deleteAddressServiceModule.deleteAddressService).mockResolvedValue({
      data: mockDeletedAddress,
      error: false,
    })

    const response = await deleteAddressHandler(mockReq)

    expect(response.code).toBe(200)
    expect(response.success).toBe(true)
    expect(deleteAddressServiceModule.deleteAddressService).toHaveBeenCalledWith({
      id: '12345',
      serviceContext: expect.any(Object),
    })
  })
})
