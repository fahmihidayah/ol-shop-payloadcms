'use server'

import config from '@payload-config'
import { getPayload } from 'payload'
import { cookies } from 'next/headers'

type SignInResponse = {
  success: boolean
  message?: string
  user?: any
  token?: string
}

export const signIn = async (data: {
  email: string
  password: string
}): Promise<SignInResponse> => {
  try {
    // Validate input
    if (!data.email || !data.password) {
      return {
        success: false,
        message: 'Email and password are required',
      }
    }

    // Get Payload instance
    const payload = await getPayload({
      config,
    })

    // Attempt to login
    const result = await payload.login({
      collection: 'customers',
      data: {
        email: data.email,
        password: data.password,
      },
    })

    // Check if login was successful
    if (!result.user) {
      return {
        success: false,
        message: 'Invalid email or password',
      }
    }

    // Set the auth token in cookies if available
    if (result.token) {
      const cookieStore = await cookies()
      cookieStore.set('payload-token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      })
    }

    return {
      success: true,
      message: 'Successfully signed in',
      user: result.user,
      token: result.token,
    }
  } catch (error: any) {
    // Handle specific error cases
    if (error.message?.includes('Invalid login')) {
      return {
        success: false,
        message: 'Invalid email or password',
      }
    }

    if (error.message?.includes('rate limit')) {
      return {
        success: false,
        message: 'Too many login attempts. Please try again later',
      }
    }

    if (error.message?.includes('locked')) {
      return {
        success: false,
        message: 'Your account has been locked. Please contact support',
      }
    }

    // Generic error
    console.error('Sign in error:', error)
    return {
      success: false,
      message: error.message || 'An unexpected error occurred. Please try again',
    }
  }
}
