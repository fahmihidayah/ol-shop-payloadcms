'use server'

import config from '@payload-config'
import { getPayload } from 'payload'
import { cookies } from 'next/headers'

type SignUpResponse = {
  success: boolean
  message?: string
  user?: any
  token?: string
}

export const signUp = async (data: {
  name: string
  email: string
  password: string
  phone?: string
}): Promise<SignUpResponse> => {
  try {
    // Validate required input
    if (!data.name || !data.email || !data.password) {
      return {
        success: false,
        message: 'Name, email, and password are required',
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      return {
        success: false,
        message: 'Please enter a valid email address',
      }
    }

    // Validate password strength
    if (data.password.length < 6) {
      return {
        success: false,
        message: 'Password must be at least 6 characters long',
      }
    }

    // Get Payload instance
    const payload = await getPayload({
      config,
    })

    // Check if email already exists
    const existingCustomer = await payload.find({
      collection: 'customers',
      where: {
        email: {
          equals: data.email.toLowerCase(),
        },
      },
      limit: 1,
    })

    if (existingCustomer.docs.length > 0) {
      return {
        success: false,
        message: 'An account with this email already exists',
      }
    }

    // Create new customer
    const newCustomer = await payload.create({
      collection: 'customers',
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        password: data.password,
        phone: data.phone || undefined,
        isActive: true,
      },
    })

    if (!newCustomer) {
      return {
        success: false,
        message: 'Failed to create account. Please try again',
      }
    }

    // Automatically log in the new customer
    const loginResult = await payload.login({
      collection: 'customers',
      data: {
        email: data.email.toLowerCase(),
        password: data.password,
      },
    })

    // Set the auth token in cookies if available
    if (loginResult.token) {
      const cookieStore = await cookies()
      cookieStore.set('payload-token', loginResult.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      })
    }

    return {
      success: true,
      message: 'Account created successfully',
      user: newCustomer,
      token: loginResult.token,
    }
  } catch (error: any) {
    // Handle specific error cases
    if (error.message?.includes('duplicate') || error.message?.includes('unique')) {
      return {
        success: false,
        message: 'An account with this email already exists',
      }
    }

    if (error.message?.includes('validation')) {
      return {
        success: false,
        message: 'Please check your information and try again',
      }
    }

    // Generic error
    console.error('Sign up error:', error)
    return {
      success: false,
      message: error.message || 'An unexpected error occurred. Please try again',
    }
  }
}
