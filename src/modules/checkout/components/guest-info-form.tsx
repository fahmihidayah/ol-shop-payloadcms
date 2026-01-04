'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { User, Mail, Phone } from 'lucide-react'

const guestInfoSchema = z.object({
  guestName: z.string().min(2, {
    message: 'Name must be at least 2 characters',
  }),
  guestEmail: z.string().email({
    message: 'Please enter a valid email address',
  }),
  guestPhone: z.string().min(10, {
    message: 'Phone number must be at least 10 characters',
  }),
})

export type GuestInfoFormData = z.infer<typeof guestInfoSchema>

interface GuestInfoFormProps {
  onDataChange?: (data: GuestInfoFormData) => void
  defaultValues?: Partial<GuestInfoFormData>
}

export function GuestInfoForm({ onDataChange, defaultValues }: GuestInfoFormProps) {
  const form = useForm<GuestInfoFormData>({
    resolver: zodResolver(guestInfoSchema),
    defaultValues: {
      guestName: defaultValues?.guestName || '',
      guestEmail: defaultValues?.guestEmail || '',
      guestPhone: defaultValues?.guestPhone || '',
    },
    mode: 'onChange',
  })

  // Watch form changes and notify parent when valid
  const watchedValues = form.watch()
  const { isValid } = form.formState

  // Use effect to notify parent when form becomes valid
  React.useEffect(() => {
    if (onDataChange && isValid) {
      onDataChange(watchedValues)
    } else if (onDataChange && !isValid) {
      onDataChange(null as any)
    }
  }, [watchedValues, isValid, onDataChange])

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Contact Information</h3>
        <p className="text-sm text-muted-foreground">
          Please provide your contact details for order updates
        </p>
      </div>

      <Form {...form}>
        <form className="space-y-4">
          <FormField
            control={form.control}
            name="guestName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="John Doe"
                      className="pl-9"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="guestEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      className="pl-9"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="guestPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="tel"
                      placeholder="+62 812 3456 7890"
                      className="pl-9"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  )
}
