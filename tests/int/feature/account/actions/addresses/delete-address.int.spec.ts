import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { deleteAddress } from '@/feature/account/actions/addresses/delete-address'
import * as customerUtils from '@/lib/customer-utils'
// import * as deleteAddressServiceModule from '@/feature/account/services/addresses/delete-address-service'
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
// vi.mock('@/feature/account/services/addresses/delete-address-service')

vi.mock('@/feature/account/services/address-service', () => ({
  AddressService: {
    create: vi.fn(),
    delete: vi.fn(),
    findAll: vi.fn(),
  },
}))

vi.mock('payload', async (importOriginal) => {
  const actual = await importOriginal<typeof import('payload')>()
  return {
    ...actual,
    getPayload: vi.fn(),
  }
})

describe('deleteAddress action', () => {
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

  it('should delete address for authenticated user successfully', async () => {
    const formData = new FormData()
    formData.append('addressId', 'address-123')

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

    vi.mocked(customerUtils.getMeUser).mockResolvedValue({
      token: 'test-token',
      user: mockCustomer,
    })
    mockCookieStore.get.mockReturnValue({ value: 'session-123' })
    vi.mocked(AddressService.delete).mockResolvedValue({
      data: mockDeletedAddress,
      error: false,
    })

    const result = await deleteAddress(formData)

    expect(result.success).toBe(true)
    expect(result.error).toBeUndefined()
    expect(AddressService.delete).toHaveBeenCalledWith({
      id: 'address-123',
      serviceContext: expect.objectContaining({
        collection: 'addresses',
        user: mockCustomer,
        sessionId: 'session-123',
      }),
    })
  })

  it('should delete address for guest user with sessionId', async () => {
    const formData = new FormData()
    formData.append('addressId', 'address-456')

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

    vi.mocked(customerUtils.getMeUser).mockResolvedValue({ token: '', user: undefined })
    mockCookieStore.get.mockReturnValue({ value: 'session-456' })
    vi.mocked(AddressService.delete).mockResolvedValue({
      data: mockDeletedAddress,
      error: false,
    })

    const result = await deleteAddress(formData)

    expect(result.success).toBe(true)
  })

  it('should return error when addressId is missing', async () => {
    const formData = new FormData()
    // No addressId provided

    const result = await deleteAddress(formData)

    expect(result.success).toBe(false)
    expect(result.error).toBe('Address ID is required')
    expect(AddressService.delete).not.toHaveBeenCalled()
  })

  it('should return error when addressId is empty string', async () => {
    const formData = new FormData()
    formData.append('addressId', '')

    const result = await deleteAddress(formData)

    expect(result.success).toBe(false)
    expect(result.error).toBe('Address ID is required')
  })

  it('should return error when service returns error', async () => {
    const formData = new FormData()
    formData.append('addressId', 'address-789')

    vi.mocked(customerUtils.getMeUser).mockResolvedValue({
      token: 'test-token',
      user: mockCustomer,
    })
    mockCookieStore.get.mockReturnValue({ value: 'session-123' })
    vi.mocked(AddressService.delete).mockResolvedValue({
      data: undefined,
      error: true,
      message: 'Address not found',
    })

    const result = await deleteAddress(formData)

    expect(result.success).toBe(false)
    expect(result.error).toBe('Address not found')
  })

  it('should return error when user not authorized', async () => {
    const formData = new FormData()
    formData.append('addressId', 'address-999')

    vi.mocked(customerUtils.getMeUser).mockResolvedValue({
      token: 'test-token',
      user: mockCustomer,
    })
    mockCookieStore.get.mockReturnValue({ value: 'session-123' })
    vi.mocked(AddressService.delete).mockResolvedValue({
      data: undefined,
      error: true,
      message: 'User not found',
    })

    const result = await deleteAddress(formData)

    expect(result.success).toBe(false)
    expect(result.error).toBe('User not found')
  })

  it('should handle service throwing error', async () => {
    const formData = new FormData()
    formData.append('addressId', 'address-111')

    vi.mocked(customerUtils.getMeUser).mockResolvedValue({
      token: 'test-token',
      user: mockCustomer,
    })
    mockCookieStore.get.mockReturnValue({ value: 'session-123' })
    vi.mocked(AddressService.delete).mockRejectedValue(new Error('Database error'))

    const result = await deleteAddress(formData)

    expect(result.success).toBe(false)
    expect(result.error).toBe('Database error')
  })

  it('should handle non-Error exceptions', async () => {
    const formData = new FormData()
    formData.append('addressId', 'address-222')

    vi.mocked(customerUtils.getMeUser).mockResolvedValue({
      token: 'test-token',
      user: mockCustomer,
    })
    mockCookieStore.get.mockReturnValue({ value: 'session-123' })
    vi.mocked(AddressService.delete).mockRejectedValue('String error')

    const result = await deleteAddress(formData)

    expect(result.success).toBe(false)
    expect(result.error).toBe('Failed to delete address')
  })

  it('should handle missing sessionId cookie', async () => {
    const formData = new FormData()
    formData.append('addressId', 'address-333')

    const mockDeletedAddress: Address = {
      id: 'address-333',
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

    vi.mocked(customerUtils.getMeUser).mockResolvedValue({
      token: 'test-token',
      user: mockCustomer,
    })
    mockCookieStore.get.mockReturnValue(undefined)
    vi.mocked(AddressService.delete).mockResolvedValue({
      data: mockDeletedAddress,
      error: false,
    })

    const result = await deleteAddress(formData)

    expect(result.success).toBe(true)
    expect(AddressService.delete).toHaveBeenCalledWith({
      id: 'address-333',
      serviceContext: expect.objectContaining({
        user: mockCustomer,
        sessionId: undefined,
      }),
    })
  })

  it('should call revalidateTag when successful', async () => {
    const { revalidateTag } = await import('next/cache')
    const formData = new FormData()
    formData.append('addressId', 'address-444')

    const mockDeletedAddress: Address = {
      id: 'address-444',
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

    vi.mocked(customerUtils.getMeUser).mockResolvedValue({
      token: 'test-token',
      user: mockCustomer,
    })
    mockCookieStore.get.mockReturnValue({ value: 'session-123' })
    vi.mocked(AddressService.delete).mockResolvedValue({
      data: mockDeletedAddress,
      error: false,
    })

    await deleteAddress(formData)

    expect(revalidateTag).toHaveBeenCalledWith('addresses')
  })

  it('should not call revalidateTag when deletion fails', async () => {
    const { revalidateTag } = await import('next/cache')
    const formData = new FormData()
    formData.append('addressId', 'address-555')

    vi.mocked(customerUtils.getMeUser).mockResolvedValue({
      token: 'test-token',
      user: mockCustomer,
    })
    mockCookieStore.get.mockReturnValue({ value: 'session-123' })
    vi.mocked(AddressService.delete).mockResolvedValue({
      data: undefined,
      error: true,
      message: 'Failed to delete',
    })

    await deleteAddress(formData)

    expect(vi.mocked(revalidateTag)).not.toHaveBeenCalled()
  })

  it('should handle null user and sessionId', async () => {
    const formData = new FormData()
    formData.append('addressId', 'address-666')

    vi.mocked(customerUtils.getMeUser).mockResolvedValue({ token: '', user: undefined })
    mockCookieStore.get.mockReturnValue(undefined)
    vi.mocked(AddressService.delete).mockResolvedValue({
      data: undefined,
      error: true,
      message: 'User not found',
    })

    const result = await deleteAddress(formData)

    expect(result.success).toBe(false)
    expect(result.error).toBe('User not found')
  })
})
