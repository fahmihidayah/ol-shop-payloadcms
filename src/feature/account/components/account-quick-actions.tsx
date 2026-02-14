'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Lock, UserCog } from 'lucide-react'

export function AccountQuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button asChild variant="outline" className="w-full justify-start">
          <Link href="/account/settings/profile">
            <UserCog className="h-4 w-4 mr-2" />
            Edit Profile
          </Link>
        </Button>

        <Button asChild variant="outline" className="w-full justify-start">
          <Link href="/account/settings/password">
            <Lock className="h-4 w-4 mr-2" />
            Change Password
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
