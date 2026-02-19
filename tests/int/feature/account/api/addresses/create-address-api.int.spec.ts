import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  createAddressEndpoint,
  createAddressHandler,
} from '@/feature/account/api/addresses/create-address'
// import * as createAddressServiceModule from '@/feature/account/services/addresses/create-address-service'
import * as serviceContextModule from '@/types/service-context'
import type { EnhancedRequest } from '@/feature/api/types/request'
import type { Address, Customer } from '@/payload-types'
import type { Payload } from 'payload'
import type { AddressFormSchema } from '@/feature/account/types/address'
import { AddressService } from '@/feature/account/services/address-service'

// vi.mock('@/feature/account/services/addresses/create-address-service')
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

describe('createAddressEndpoint', () => {
  let mockPayload: Payload
  let mockCustomer: Customer
  let mockReq: EnhancedRequest

  beforeEach(() => {
    mockPayload = {
      create: vi.fn(),
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
      validatedData: {},
    } as unknown as EnhancedRequest

    vi.mocked(serviceContextModule.createServiceContext).mockResolvedValue({
      payload: mockPayload,
      user: mockCustomer,
      sessionId: 'session-123',
    })
  })

  it('should have correct endpoint configuration', () => {
    expect(createAddressEndpoint.path).toBe('/v1/addresses')
    expect(createAddressEndpoint.method).toBe('post')
    expect(createAddressEndpoint.handler).toBeDefined()
  })

  it('should create address successfully', async () => {
    const addressData: AddressFormSchema = {
      label: 'Home',
      recipientName: 'John Doe',
      phone: '+1234567890',
      addressLine1: '123 Main St',
      city: 'New York',
      province: 'NY',
      postalCode: '10001',
      country: 'USA',
      isDefault: true,
    }

    const mockCreatedAddress: Address = {
      id: 'address-123',
      ...addressData,
      customer: mockCustomer.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Address

    mockReq.validatedData = addressData

    vi.mocked(AddressService.create).mockResolvedValue({
      data: mockCreatedAddress,
      error: false,
      message: 'Success',
    })

    const response = await createAddressHandler(mockReq)

    expect(response.code).toBe(201)
    expect(response.success).toBe(true)
    expect(response.message).toBe('Address created successfully')
    expect(response.data).toEqual(mockCreatedAddress)
    expect(serviceContextModule.createServiceContext).toHaveBeenCalledWith({
      req: mockReq,
    })
    expect(AddressService.create).toHaveBeenCalledWith({
      data: addressData,
      serviceContext: expect.objectContaining({
        user: mockCustomer,
        sessionId: 'session-123',
      }),
    })
  })

  it('should return error when service fails', async () => {
    const addressData: AddressFormSchema = {
      label: 'Home',
      recipientName: 'John Doe',
      phone: '+1234567890',
      addressLine1: '123 Main St',
      city: 'New York',
      province: 'NY',
      postalCode: '10001',
      country: 'USA',
    }

    mockReq.validatedData = addressData

    vi.mocked(AddressService.create).mockResolvedValue({
      data: undefined,
      error: true,
      message: 'Database error',
    })

    const response = await createAddressHandler(mockReq)

    expect(response.code).toBe(400)
    expect(response.success).toBe(false)
    expect(response.message).toBe('Database error')
  })

  it('should return default error message when service fails without message', async () => {
    const addressData: AddressFormSchema = {
      label: 'Home',
      recipientName: 'John Doe',
      phone: '+1234567890',
      addressLine1: '123 Main St',
      city: 'New York',
      province: 'NY',
      postalCode: '10001',
      country: 'USA',
    }

    mockReq.validatedData = addressData

    vi.mocked(AddressService.create).mockResolvedValue({
      data: undefined,
      error: true,
    })

    const response = await createAddressHandler(mockReq)

    expect(response.code).toBe(400)
    expect(response.message).toBe('Failed to create address')
  })

  it('should return validation errors', async () => {
    const invalidData: AddressFormSchema = {
      label: '',
      recipientName: '',
      phone: '',
      addressLine1: '',
      city: '',
      province: '',
      postalCode: '',
      country: '',
    }

    mockReq.validatedData = invalidData

    vi.mocked(AddressService.create).mockResolvedValue({
      data: undefined,
      error: true,
      errorMessage: {
        label: 'Label is required',
        recipientName: 'Recipient name is required',
      },
      message: '',
    })

    const response = await createAddressHandler(mockReq)

    expect(response.code).toBe(400)
    expect(response.success).toBe(false)
    expect(response.error).toEqual({
      label: 'Label is required',
      recipientName: 'Recipient name is required',
    })
  })

  it('should create address with optional fields', async () => {
    const addressData: AddressFormSchema = {
      label: 'Office',
      recipientName: 'John Doe',
      phone: '+1234567890',
      addressLine1: '123 Main St',
      addressLine2: 'Suite 100',
      city: 'New York',
      province: 'NY',
      postalCode: '10001',
      country: 'USA',
    }

    const mockCreatedAddress: Address = {
      id: 'address-456',
      ...addressData,
      customer: mockCustomer.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Address

    mockReq.validatedData = addressData

    vi.mocked(AddressService.create).mockResolvedValue({
      data: mockCreatedAddress,
      error: false,
      message: 'Success',
    })

    const response = await createAddressHandler(mockReq)

    expect(response.code).toBe(201)
    expect(response.success).toBe(true)
    expect(response.data).toEqual(mockCreatedAddress)
  })

  it('should create address for guest user with sessionId', async () => {
    const addressData: AddressFormSchema = {
      label: 'Shipping',
      recipientName: 'Guest User',
      phone: '+9876543210',
      addressLine1: '456 Guest Ave',
      city: 'Los Angeles',
      province: 'CA',
      postalCode: '90001',
      country: 'USA',
    }

    const mockCreatedAddress: Address = {
      id: 'address-789',
      ...addressData,
      sessionId: 'session-456',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Address

    mockReq.user = null
    mockReq.sessionId = 'session-456'
    mockReq.validatedData = addressData

    vi.mocked(serviceContextModule.createServiceContext).mockResolvedValue({
      payload: mockPayload,
      user: undefined,
      sessionId: 'session-456',
    })

    vi.mocked(AddressService.create).mockResolvedValue({
      data: mockCreatedAddress,
      error: false,
      message: 'Success',
    })

    const response = await createAddressHandler(mockReq)

    expect(response.code).toBe(201)
    expect(response.success).toBe(true)
    expect(response.data).toEqual(mockCreatedAddress)
  })

  it('should handle isDefault flag correctly', async () => {
    const addressData: AddressFormSchema = {
      label: 'Home',
      recipientName: 'John Doe',
      phone: '+1234567890',
      addressLine1: '123 Main St',
      city: 'New York',
      province: 'NY',
      postalCode: '10001',
      country: 'USA',
      isDefault: true,
    }

    const mockCreatedAddress: Address = {
      id: 'address-999',
      ...addressData,
      customer: mockCustomer.id,
      isDefault: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Address

    mockReq.validatedData = addressData

    vi.mocked(AddressService.create).mockResolvedValue({
      data: mockCreatedAddress,
      error: false,
      message: 'Success',
    })

    const response = await createAddressHandler(mockReq)

    expect(response.code).toBe(201)
    expect(response.data?.isDefault).toBe(true)
  })
})
