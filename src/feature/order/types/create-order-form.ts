import z from 'zod'

export const createOrderFormSchema = z.object({
  addressId: z.string().min(1, 'Address is required'),
  paymentMethod: z.string().min(1, 'Payment method is required'),
})

export type CreateOrderFormSchema = z.infer<typeof createOrderFormSchema>
