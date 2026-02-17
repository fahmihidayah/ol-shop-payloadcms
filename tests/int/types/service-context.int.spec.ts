import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createServiceContext } from '@/types/service-context'
import type { EnhancedRequest } from '@/feature/api/types/request'
import type { Customer } from '@/payload-types'
import type { Payload } from 'payload'

vi.mock('payload', async (importOriginal) => {
  const actual = await importOriginal<typeof import('payload')>()
  return {
    ...actual,
    getPayload: vi.fn(),
  }
})

describe('createServiceContext', () => {
  let mockPayload: Payload
  let mockCustomer: Customer

  beforeEach(() => {
    mockPayload = {
      find: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
      update: vi.fn(),
    } as unknown as Payload

    mockCustomer = {
      id: 'customer-123',
      email: 'test@example.com',
      name: 'Test Customer',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Customer
  })

  it('should create service context with request object', async () => {
    const mockReq = {
      payload: mockPayload,
      user: mockCustomer,
      sessionId: 'session-123',
    } as EnhancedRequest

    const result = await createServiceContext({
      collection: 'addresses',
      req: mockReq,
    })

    expect(result.collection).toBe('addresses')
    expect(result.payload).toBe(mockPayload)
    expect(result.user).toBe(mockCustomer)
    expect(result.sessionId).toBe('session-123')
  })

  it('should create service context without request object', async () => {
    const { getPayload } = await import('payload')
    vi.mocked(getPayload).mockResolvedValue(mockPayload)

    const result = await createServiceContext({
      collection: 'addresses',
      user: mockCustomer,
      sessionId: 'session-456',
    })

    expect(result.collection).toBe('addresses')
    expect(result.payload).toBe(mockPayload)
    expect(result.user).toBe(mockCustomer)
    expect(result.sessionId).toBe('session-456')
    expect(getPayload).toHaveBeenCalled()
  })

  it('should prefer explicit user over request user', async () => {
    const anotherCustomer: Customer = {
      id: 'customer-456',
      email: 'another@example.com',
      name: 'Another Customer',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Customer

    const mockReq = {
      payload: mockPayload,
      user: mockCustomer,
      sessionId: 'session-123',
    } as EnhancedRequest

    const result = await createServiceContext({
      collection: 'addresses',
      req: mockReq,
      user: anotherCustomer,
    })

    expect(result.user).toBe(anotherCustomer)
    expect(result.user).not.toBe(mockCustomer)
  })

  it('should prefer explicit sessionId over request sessionId', async () => {
    const mockReq = {
      payload: mockPayload,
      user: mockCustomer,
      sessionId: 'session-from-req',
    } as EnhancedRequest

    const result = await createServiceContext({
      collection: 'addresses',
      req: mockReq,
      sessionId: 'session-explicit',
    })

    expect(result.sessionId).toBe('session-explicit')
    expect(result.sessionId).not.toBe('session-from-req')
  })

  it('should handle request with no user', async () => {
    const mockReq = {
      payload: mockPayload,
      sessionId: 'session-123',
    } as EnhancedRequest

    const result = await createServiceContext({
      collection: 'addresses',
      req: mockReq,
    })

    expect(result.user).toBeUndefined()
    expect(result.sessionId).toBe('session-123')
  })

  it('should handle request with no sessionId', async () => {
    const mockReq = {
      payload: mockPayload,
      user: mockCustomer,
    } as EnhancedRequest

    const result = await createServiceContext({
      collection: 'addresses',
      req: mockReq,
    })

    expect(result.user).toBe(mockCustomer)
    expect(result.sessionId).toBeUndefined()
  })

  it('should handle different collection types', async () => {
    const mockReq = {
      payload: mockPayload,
      user: mockCustomer,
      sessionId: 'session-123',
    } as EnhancedRequest

    const collections = ['addresses', 'orders', 'products', 'customers'] as const

    for (const collection of collections) {
      const result = await createServiceContext({
        collection,
        req: mockReq,
      })

      expect(result.collection).toBe(collection)
    }
  })

  it('should create context without user and sessionId', async () => {
    const { getPayload } = await import('payload')
    vi.mocked(getPayload).mockResolvedValue(mockPayload)

    const result = await createServiceContext({
      collection: 'addresses',
    })

    expect(result.collection).toBe('addresses')
    expect(result.payload).toBe(mockPayload)
    expect(result.user).toBeUndefined()
    expect(result.sessionId).toBeUndefined()
  })

  it('should use request payload when request is provided', async () => {
    const { getPayload } = await import('payload')
    const mockGetPayload = vi.mocked(getPayload)
    mockGetPayload.mockClear()

    const mockReq = {
      payload: mockPayload,
      user: mockCustomer,
      sessionId: 'session-123',
    } as EnhancedRequest

    const result = await createServiceContext({
      collection: 'addresses',
      req: mockReq,
    })

    expect(result.payload).toBe(mockPayload)
    expect(mockGetPayload).not.toHaveBeenCalled()
  })

  it('should call getPayload when no request is provided', async () => {
    const { getPayload } = await import('payload')
    const mockGetPayload = vi.mocked(getPayload)
    mockGetPayload.mockResolvedValue(mockPayload)

    const result = await createServiceContext({
      collection: 'addresses',
      user: mockCustomer,
    })

    expect(result.payload).toBe(mockPayload)
    expect(mockGetPayload).toHaveBeenCalled()
  })
})
