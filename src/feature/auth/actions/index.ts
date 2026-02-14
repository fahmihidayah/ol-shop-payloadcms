'use server'

import { Customer, User } from '@/payload-types'

import { getPayload } from 'payload'
import config from '@/payload.config'
import { cookies } from 'next/headers'
import { LoginFormSchema } from '../types/login-form-schema'
import { ForgotPasswordSchema } from '../types/forgot-password-schema'
import { RegisterFormSchema } from '../types/register-form-schema'
import { revalidatePath } from 'next/cache'
/**
 * Authenticates User with email and password
 * Sets payload-token cookie on success
 * Returns User data and token, or error message on failure
 */
export const login = async (
    form: LoginFormSchema,
): Promise<{ success: boolean; user?: Customer; token?: string; error?: string }> => {
    console.log('[LOGIN] Starting login process for:', form.email)

    try {
        const payload = await getPayload({ config })
        console.log('[LOGIN] Payload instance obtained')

        const result = await payload.login({
            collection: 'customers',
            data: {
                email: form.email,
                password: `${form.password}`,
            },
        })

        console.log('[LOGIN] Login result:', {
            hasToken: !!result.token,
            hasUser: !!result.user,
            userId: result.user?.id,
        })

        if (!result.token || !result.user) {
            console.log('[LOGIN] Login failed: missing token or user')
            return {
                success: false,
                error: 'Invalid email or password',
            }
        }

        // Set cookie
        const cookieStore = await cookies()
        cookieStore.set('payload-token', result.token as string, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        })

        console.log('[LOGIN] Cookie set successfully for user:', result.user.id)

        return {
            success: true,
            user: result.user as Customer,
            token: result.token,
        }
    } catch (error) {
        console.error('[LOGIN] Login error:', error)
        console.error('[LOGIN] Error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            name: error instanceof Error ? error.name : 'Unknown',
            stack: error instanceof Error ? error.stack : 'No stack trace',
        })

        return {
            success: false,
            error: error instanceof Error ? error.message : 'Login failed',
        }
    }
}

/**
 * Logs out the current User by deleting the payload-token cookie
 * Returns success status
 */
export const logout = async (): Promise<{ success: boolean }> => {
    console.log('[LOGOUT] Logging out user')

    const cookieStore = await cookies()
    cookieStore.delete('payload-token')

    console.log('[LOGOUT] Cookie deleted successfully')

    revalidatePath("/")
    return {
        success: true,
    }
}

/**
 * Initiates forgot password flow by sending reset email
 * Returns success status and message
 */
export const forgotPassword = async (
    form: ForgotPasswordSchema,
): Promise<{ success: boolean; message: string }> => {
    try {
        const payload = await getPayload({ config })

        await payload.forgotPassword({
            collection: 'customers',
            data: {
                email: form.email,
            },
        })

        return {
            success: true,
            message: 'Password reset email sent. Please check your inbox.',
        }
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Failed to send reset email',
        }
    }
}

/**
 * Registers a new User with email and password
 * Auto-logs in the user after successful registration
 * Sets payload-token cookie and returns User data
 */
export const register = async (
    form: RegisterFormSchema,
): Promise<{ success: boolean; user?: Customer; token?: string; error?: string }> => {
    console.log('[REGISTER] Starting registration process for:', form.email)

    try {
        const payload = await getPayload({ config })
        console.log('[REGISTER] Payload instance obtained')

        // Check if user already exists
        const existingUser = await payload.find({
            collection: 'customers',
            where: {
                email: {
                    equals: form.email,
                },
            },
        })

        if (existingUser.docs.length > 0) {
            console.log('[REGISTER] Registration failed: email already exists')
            return {
                success: false,
                error: 'Email sudah terdaftar',
            }
        }

        // Create new user
        const newUser = await payload.create({
            collection: 'customers',
            data: {
                name: form.name,
                email: form.email,
                password: form.password,
            },
        })

        console.log('[REGISTER] User created successfully:', newUser.id)

        // Auto-login after registration
        const loginResult = await login({
            email: form.email,
            password: form.password,
        })

        if (!loginResult.success) {
            console.log('[REGISTER] Auto-login failed after registration')
            return {
                success: false,
                error: 'Registrasi berhasil, tetapi login otomatis gagal',
            }
        }

        console.log('[REGISTER] Registration and auto-login successful')

        return {
            success: true,

            user: loginResult.user,
            token: loginResult.token,
        }
    } catch (error) {
        console.error('[REGISTER] Registration error:', error)
        console.error('[REGISTER] Error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            name: error instanceof Error ? error.name : 'Unknown',
            stack: error instanceof Error ? error.stack : 'No stack trace',
        })

        return {
            success: false,
            error: error instanceof Error ? error.message : 'Registrasi gagal',
        }
    }
}

/**
 * Gets paginated list of users with optional search filter
 * Returns users with pagination info
 */
export const getListUsers = async (options?: {
    page?: number
    limit?: number
    search?: string
    sort?: string
}) => {
    try {
        const payload = await getPayload({
            config,
        })

        const { page = 1, limit = 10, search = '', sort = '-createdAt' } = options || {}

        const where: any = {}

        // Add search filter if provided
        if (search) {
            where.or = [
                {
                    email: {
                        contains: search,
                    },
                },
            ]
        }

        const result = await payload.find({
            collection: 'users',
            where,
            limit,
            page,
            sort,
        })

        return {
            success: true,
            data: result,
            error: null,
        }
    } catch (error) {
        console.error('Error fetching users:', error)
        return {
            success: false,
            data: null,
            error: error instanceof Error ? error.message : 'Failed to fetch users',
        }
    }
}