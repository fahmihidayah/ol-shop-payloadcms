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
  FormDescription,
} from '@/components/ui/form'
import { Loader2, Lock, Key } from 'lucide-react'
import { toast } from 'sonner'

const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type PasswordFormSchema = z.infer<typeof passwordFormSchema>

interface PasswordFormProps {
  onUpdate: (data: PasswordFormSchema) => Promise<{ success: boolean; message?: string }>
}

export function PasswordForm({ onUpdate }: PasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<PasswordFormSchema>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: PasswordFormSchema) => {
    setIsLoading(true)

    try {
      const response = await onUpdate(data)

      if (response.success) {
        toast.success('Password changed successfully')
        form.reset() // Clear form
      } else {
        toast.error(response.message || 'Failed to change password')
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to change password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Enter current password"
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
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Enter new password"
                    className="pl-9"
                    disabled={isLoading}
                    {...field}
                  />
                </div>
              </FormControl>
              <FormDescription>Must be at least 6 characters</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm New Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Confirm new password"
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

        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Changing Password...
            </>
          ) : (
            <>
              <Lock className="mr-2 h-4 w-4" />
              Change Password
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}
