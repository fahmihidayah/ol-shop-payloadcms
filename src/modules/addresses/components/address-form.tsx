'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Loader2, Save } from 'lucide-react'
import type { Address } from '@/payload-types'

const addressFormSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  recipientName: z.string().min(2, 'Recipient name must be at least 2 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  addressLine1: z.string().min(5, 'Address is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  province: z.string().min(2, 'Province is required'),
  postalCode: z.string().min(5, 'Postal code is required'),
  country: z.string().optional(),
})

export type AddressFormData = z.infer<typeof addressFormSchema>

interface AddressFormProps {
  address?: Address
  onSubmit: (data: AddressFormData) => Promise<void>
  isLoading?: boolean
}

export function AddressForm({ address, onSubmit, isLoading = false }: AddressFormProps) {
  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      label: address?.label || '',
      recipientName: address?.recipientName || '',
      phone: address?.phone || '',
      addressLine1: address?.addressLine1 || '',
      addressLine2: address?.addressLine2 || '',
      city: address?.city || '',
      province: address?.province || '',
      postalCode: address?.postalCode || '',
      country: address?.country || 'Indonesia',
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address Label</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Home, Office, Mom's House"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormDescription>A nickname for this address</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="recipientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recipient Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" disabled={isLoading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="+62 812 3456 7890"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="addressLine1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address Line 1</FormLabel>
              <FormControl>
                <Input
                  placeholder="Street address, P.O. box, company name"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="addressLine2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address Line 2 (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Apartment, suite, unit, building, floor"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="Jakarta" disabled={isLoading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="province"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Province</FormLabel>
                <FormControl>
                  <Input placeholder="DKI Jakarta" disabled={isLoading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="postalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Postal Code</FormLabel>
                <FormControl>
                  <Input placeholder="12345" disabled={isLoading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Input placeholder="Indonesia" disabled={isLoading} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-3">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Address
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
