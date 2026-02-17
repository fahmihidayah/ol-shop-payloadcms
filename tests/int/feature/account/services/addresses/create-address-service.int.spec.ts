import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createAddressService } from '@/feature/account/services/addresses/create-address-service'
import type { AddressFormSchema } from '@/feature/account/types/types'
import type { ServiceContext } from '@/types/service-context'
import type { Address, Customer } from '@/payload-types'
import type { Payload } from 'payload'

describe('createAddressService', () => {
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
      create: vi.fn(),
    } as unknown as Payload

    // Setup service context
    serviceContext = {
      collection: 'addresses',
      payload: mockPayload,
      user: mockCustomer,
      sessionId: undefined,
    }
  })

  it('should create address for authenticated user', async () => {
    const addressData: AddressFormSchema = {
      label: 'Home',
      recipientName: 'John Doe',
      phone: '+1234567890',
      addressLine1: '123 Main St',
      addressLine2: 'Apt 4B',
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

    vi.mocked(mockPayload.create).mockResolvedValue(mockCreatedAddress)

    const result = await createAddressService({
      data: addressData,
      serviceContext,
    })

    expect(result.error).toBe(false)
    expect(result.data).toEqual(mockCreatedAddress)
    expect(result.message).toBe('Success')
    expect(mockPayload.create).toHaveBeenCalledWith({
      collection: 'addresses',
      data: expect.objectContaining({
        ...addressData,
        customer: mockCustomer.id,
      }),
    })
  })

  it('should create address for guest user with sessionId', async () => {
    serviceContext.user = undefined
    serviceContext.sessionId = 'session-456'

    const addressData: AddressFormSchema = {
      label: 'Work',
      recipientName: 'Jane Smith',
      phone: '+9876543210',
      addressLine1: '456 Office Blvd',
      city: 'Los Angeles',
      province: 'CA',
      postalCode: '90001',
      country: 'USA',
    }

    const mockCreatedAddress: Address = {
      id: 'address-456',
      ...addressData,
      sessionId: 'session-456',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Address

    vi.mocked(mockPayload.create).mockResolvedValue(mockCreatedAddress)

    const result = await createAddressService({
      data: addressData,
      serviceContext,
    })

    expect(result.error).toBe(false)
    expect(result.data).toEqual(mockCreatedAddress)
    expect(mockPayload.create).toHaveBeenCalledWith({
      collection: 'addresses',
      data: expect.objectContaining({
        ...addressData,
        sessionId: 'session-456',
      }),
    })
  })

  it('should return validation error for missing required fields', async () => {
    const invalidData = {
      label: '',
      recipientName: '',
      phone: '',
      addressLine1: '',
      city: '',
      province: '',
      postalCode: '',
      country: '',
    } as AddressFormSchema

    const result = await createAddressService({
      data: invalidData,
      serviceContext,
    })

    expect(result.error).toBe(true)
    expect(result.errorMessage).toBeDefined()
    expect(result.data).toBeUndefined()
    expect(mockPayload.create).not.toHaveBeenCalled()
  })

  it('should handle validation error for invalid phone number format', async () => {
    const invalidData: AddressFormSchema = {
      label: 'Home',
      recipientName: 'John Doe',
      phone: '', // Invalid phone
      addressLine1: '123 Main St',
      city: 'New York',
      province: 'NY',
      postalCode: '10001',
      country: 'USA',
    }

    const result = await createAddressService({
      data: invalidData,
      serviceContext,
    })

    expect(result.error).toBe(true)
    expect(result.errorMessage).toBeDefined()
    expect(mockPayload.create).not.toHaveBeenCalled()
  })

  it('should accept optional addressLine2', async () => {
    const addressData: AddressFormSchema = {
      label: 'Office',
      recipientName: 'John Doe',
      phone: '+1234567890',
      addressLine1: '123 Main St',
      // addressLine2 is optional
      city: 'New York',
      province: 'NY',
      postalCode: '10001',
      country: 'USA',
    }

    const mockCreatedAddress: Address = {
      id: 'address-789',
      ...addressData,
      customer: mockCustomer.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Address

    vi.mocked(mockPayload.create).mockResolvedValue(mockCreatedAddress)

    const result = await createAddressService({
      data: addressData,
      serviceContext,
    })

    expect(result.error).toBe(false)
    expect(result.data).toEqual(mockCreatedAddress)
  })

  it('should handle payload.create throwing error', async () => {
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

    vi.mocked(mockPayload.create).mockRejectedValue(new Error('Database error'))

    await expect(
      createAddressService({
        data: addressData,
        serviceContext,
      }),
    ).rejects.toThrow('Database error')
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
      isDefault: false,
    }

    const mockCreatedAddress: Address = {
      id: 'address-999',
      ...addressData,
      customer: mockCustomer.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Address

    vi.mocked(mockPayload.create).mockResolvedValue(mockCreatedAddress)

    const result = await createAddressService({
      data: addressData,
      serviceContext,
    })

    expect(result.error).toBe(false)
    expect(result.data?.isDefault).toBe(false)
  })

  it('should validate all required fields are present', async () => {
    const testCases = [
      { field: 'label', value: '' },
      { field: 'recipientName', value: '' },
      { field: 'phone', value: '' },
      { field: 'addressLine1', value: '' },
      { field: 'city', value: '' },
      { field: 'province', value: '' },
      { field: 'postalCode', value: '' },
      { field: 'country', value: '' },
    ]

    for (const testCase of testCases) {
      const invalidData = {
        label: 'Home',
        recipientName: 'John Doe',
        phone: '+1234567890',
        addressLine1: '123 Main St',
        city: 'New York',
        province: 'NY',
        postalCode: '10001',
        country: 'USA',
        [testCase.field]: testCase.value,
      } as AddressFormSchema

      const result = await createAddressService({
        data: invalidData,
        serviceContext,
      })

      expect(result.error).toBe(true)
      expect(result.errorMessage).toBeDefined()
    }
  })
})
