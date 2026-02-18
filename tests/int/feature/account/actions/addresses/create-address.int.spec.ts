import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createAddress } from '@/feature/account/actions/addresses/create-address'
import type { AddressFormSchema } from '@/feature/account/types/address'
import * as customerUtils from '@/lib/customer-utils'
// import * as createAddressServiceModule from '@/feature/account/services/addresses/create-address-service'
import type { Address, Customer } from '@/payload-types'
import { cookies } from 'next/headers'
import { AddressService } from '@/feature/account/services/address-service'

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}))

vi.mock('next/cache', () => ({
  revalidateTag: vi.fn(),
}))

vi.mock('@/lib/customer-utils')
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

describe('createAddress action', () => {
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

  it('should create address for authenticated user successfully', async () => {
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

    vi.mocked(customerUtils.getMeUser).mockResolvedValue({
      token: 'test-token',
      user: mockCustomer,
    })
    mockCookieStore.get.mockReturnValue({ value: 'session-123' })
    vi.mocked(AddressService.create).mockResolvedValue({
      data: mockCreatedAddress,
      error: false,
      message: 'Success',
    })

    const result = await createAddress(addressData)

    expect(result.success).toBe(true)
    expect(result.address).toEqual(mockCreatedAddress)
    expect(result.error).toBeUndefined()
    expect(AddressService.create).toHaveBeenCalledWith({
      data: addressData,
      serviceContext: expect.objectContaining({
        user: mockCustomer,
        sessionId: 'session-123',
        collection: 'addresses',
      }),
    })
  })

  it('should create address for guest user with sessionId', async () => {
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

    vi.mocked(customerUtils.getMeUser).mockResolvedValue({ token: '', user: undefined })
    mockCookieStore.get.mockReturnValue({ value: 'session-456' })
    vi.mocked(AddressService.create).mockResolvedValue({
      data: mockCreatedAddress,
      error: false,
      message: 'Success',
    })

    const result = await createAddress(addressData)

    expect(result.success).toBe(true)
    expect(result.address).toEqual(mockCreatedAddress)
  })

  it('should return error when service returns validation error', async () => {
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

    vi.mocked(customerUtils.getMeUser).mockResolvedValue({
      token: 'test-token',
      user: mockCustomer,
    })
    mockCookieStore.get.mockReturnValue({ value: 'session-123' })
    vi.mocked(AddressService.create).mockResolvedValue({
      data: undefined,
      error: true,
      errorMessage: {
        label: 'Label is required',
        recipientName: 'Recipient name is required',
      },
      message: '',
    })

    const result = await createAddress(invalidData)

    expect(result.success).toBe(false)
    expect(result.error).toBeDefined()
    expect(result.error).toContain('Label is required')
    expect(result.address).toBeUndefined()
  })

  it('should return error when service returns error message', async () => {
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

    vi.mocked(customerUtils.getMeUser).mockResolvedValue({
      token: 'test-token',
      user: mockCustomer,
    })
    mockCookieStore.get.mockReturnValue({ value: 'session-123' })
    vi.mocked(AddressService.create).mockResolvedValue({
      data: undefined,
      error: true,
      message: 'Database error',
    })

    const result = await createAddress(addressData)

    expect(result.success).toBe(false)
    expect(result.error).toBe('Database error')
  })

  it('should handle service throwing error', async () => {
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

    vi.mocked(customerUtils.getMeUser).mockResolvedValue({
      token: 'test-token',
      user: mockCustomer,
    })
    mockCookieStore.get.mockReturnValue({ value: 'session-123' })
    vi.mocked(AddressService.create).mockRejectedValue(new Error('Unexpected error'))

    const result = await createAddress(addressData)

    expect(result.success).toBe(false)
    expect(result.error).toBe('Unexpected error')
  })

  it('should handle non-Error exceptions', async () => {
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

    vi.mocked(customerUtils.getMeUser).mockResolvedValue({
      token: 'test-token',
      user: mockCustomer,
    })
    mockCookieStore.get.mockReturnValue({ value: 'session-123' })
    vi.mocked(AddressService.create).mockRejectedValue('String error')

    const result = await createAddress(addressData)

    expect(result.success).toBe(false)
    expect(result.error).toBe('Failed to create address')
  })

  it('should handle missing sessionId cookie', async () => {
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

    const mockCreatedAddress: Address = {
      id: 'address-789',
      ...addressData,
      customer: mockCustomer.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Address

    vi.mocked(customerUtils.getMeUser).mockResolvedValue({
      token: 'test-token',
      user: mockCustomer,
    })
    mockCookieStore.get.mockReturnValue(undefined)
    vi.mocked(AddressService.create).mockResolvedValue({
      data: mockCreatedAddress,
      error: false,
      message: 'Success',
    })

    const result = await createAddress(addressData)

    expect(result.success).toBe(true)
    expect(AddressService.create).toHaveBeenCalledWith({
      data: addressData,
      serviceContext: expect.objectContaining({
        user: mockCustomer,
        sessionId: undefined,
      }),
    })
  })

  it('should call revalidateTag when successful', async () => {
    const { revalidateTag } = await import('next/cache')
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

    const mockCreatedAddress: Address = {
      id: 'address-999',
      ...addressData,
      customer: mockCustomer.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Address

    vi.mocked(customerUtils.getMeUser).mockResolvedValue({
      token: 'test-token',
      user: mockCustomer,
    })
    mockCookieStore.get.mockReturnValue({ value: 'session-123' })
    vi.mocked(AddressService.create).mockResolvedValue({
      data: mockCreatedAddress,
      error: false,
      message: 'Success',
    })

    await createAddress(addressData)

    expect(revalidateTag).toHaveBeenCalledWith('addresses')
  })

  it('should handle optional fields correctly', async () => {
    const addressData: AddressFormSchema = {
      label: 'Office',
      recipientName: 'John Doe',
      phone: '+1234567890',
      addressLine1: '123 Main St',
      city: 'New York',
      province: 'NY',
      postalCode: '10001',
      country: 'USA',
      // Optional fields not provided
    }

    const mockCreatedAddress: Address = {
      id: 'address-111',
      ...addressData,
      customer: mockCustomer.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Address

    vi.mocked(customerUtils.getMeUser).mockResolvedValue({
      token: 'test-token',
      user: mockCustomer,
    })
    mockCookieStore.get.mockReturnValue({ value: 'session-123' })
    vi.mocked(AddressService.create).mockResolvedValue({
      data: mockCreatedAddress,
      error: false,
      message: 'Success',
    })

    const result = await createAddress(addressData)

    expect(result.success).toBe(true)
    expect(result.address).toEqual(mockCreatedAddress)
  })
})
