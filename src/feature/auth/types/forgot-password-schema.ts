import z from 'zod'

export const forgotPasswordSchema = z.object({
    email: z.email({ message: 'Email tidak valid' }),
})

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>