'use client'

import { useEffect } from 'react'
import { useUser, useUserStore } from '@/store'
import { ProfileForm } from '../components/profile-form'
import { PasswordForm } from '../components/password-form'
import { User, Lock, Loader2 } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

interface ProfilePageProps {
  onUpdateProfile: (data: any) => Promise<{ success: boolean; message?: string }>
  onUpdatePassword: (data: any) => Promise<{ success: boolean; message?: string }>
}

export function ProfilePage({ onUpdateProfile, onUpdatePassword }: ProfilePageProps) {
  const user = useUser()
  const isLoading = useUserStore((state) => state.isLoading)
  const fetchUser = useUserStore((state) => state.fetchUser)

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account information and security settings
        </p>
      </div>

      {/* Profile Information Section */}
      <div className="bg-card rounded-lg border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Personal Information</h2>
            <p className="text-sm text-muted-foreground">
              Update your personal details and contact information
            </p>
          </div>
        </div>
        <Separator className="mb-6" />
        <ProfileForm user={user} onUpdate={onUpdateProfile} />
      </div>

      {/* Password Section */}
      <div className="bg-card rounded-lg border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center">
            <Lock className="h-5 w-5 text-orange-500" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Change Password</h2>
            <p className="text-sm text-muted-foreground">
              Update your password to keep your account secure
            </p>
          </div>
        </div>
        <Separator className="mb-6" />
        <PasswordForm onUpdate={onUpdatePassword} />
      </div>

      {/* Account Info */}
      <div className="bg-muted/30 rounded-lg border p-6">
        <h3 className="font-semibold mb-4">Account Information</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Account ID:</span>
            <span className="font-mono">{user.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Member Since:</span>
            <span>{new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Last Updated:</span>
            <span>{new Date(user.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
