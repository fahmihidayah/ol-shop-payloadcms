import { Suspense } from 'react'
import LoginForm from '@/feature/auth/components/login-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login',
  description:
    'Sign in to your account to access your orders, manage your addresses, and enjoy a personalized shopping experience.',
  robots: {
    index: false,
    follow: true,
  },
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
}