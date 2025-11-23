'use client'

import { useState } from 'react'
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
} from '@/components/ui/form'
import { Loader2, User, Mail, Phone, Save } from 'lucide-react'
import { toast } from 'sonner'
import { useUserStore } from '@/store'
import type { Customer } from '@/payload-types'

const profileFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
})

type ProfileFormSchema = z.infer<typeof profileFormSchema>

interface ProfileFormProps {
  user: Customer
  onUpdate: (data: ProfileFormSchema) => Promise<{ success: boolean; message?: string }>
}

export function ProfileForm({ user, onUpdate }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const updateUser = useUserStore((state) => state.updateUser)

  const form = useForm<ProfileFormSchema>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
    },
  })

  const onSubmit = async (data: ProfileFormSchema) => {
    setIsLoading(true)

    try {
      const response = await onUpdate(data)

      if (response.success) {
        // Update user store
        updateUser(data)

        toast.success('Profile updated successfully')
        form.reset(data) // Reset form with new values
      } else {
        toast.error(response.message || 'Failed to update profile')
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="John Doe"
                    className="pl-9"
                    disabled={isLoading}
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
          name="email"
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
                    disabled={isLoading}
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
          name="phone"
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
                    disabled={isLoading}
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading || !form.formState.isDirty}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}
