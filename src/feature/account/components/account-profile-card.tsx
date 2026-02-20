'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User, Mail, Phone, Calendar, Edit } from 'lucide-react'
import { Customer } from '@/payload-types'

interface AccountProfileCardProps {
  customer: Customer
}

export function AccountProfileCard({ customer }: AccountProfileCardProps) {
  const initials =
    customer.name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase() || 'U'

  const joinDate = customer.createdAt
    ? new Date(customer.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : 'N/A'

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle>Profile Information</CardTitle>
        <Button asChild variant="ghost" size="sm">
          <Link href="/account/settings">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>

          {/* Profile Details */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{customer.name || 'Not set'}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{customer.email}</span>
            </div>

            {customer.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{customer.phone}</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Member since {joinDate}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
