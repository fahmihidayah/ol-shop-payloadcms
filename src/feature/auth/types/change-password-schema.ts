import z from 'zod'

export const changePasswordSchema = z
    .object({
        currentPassword: z.string().min(6, { message: 'Password minimal 6 karakter' }),
        newPassword: z.string().min(6, { message: 'Password baru minimal 6 karakter' }),
        confirmPassword: z.string().min(6, { message: 'Konfirmasi password minimal 6 karakter' }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: 'Password tidak cocok',
        path: ['confirmPassword'],
    })
    .refine((data) => data.currentPassword !== data.newPassword, {
        message: 'Password baru harus berbeda dari password lama',
        path: ['newPassword'],
    })

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>