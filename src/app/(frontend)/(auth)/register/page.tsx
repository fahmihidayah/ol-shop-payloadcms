import { RegisterForm } from '@/feature/auth/components/register-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Account',
  description:
    'Create your account to start shopping, track orders, save addresses, and enjoy exclusive member benefits and promotions.',
  robots: {
    index: false,
    follow: true,
  },
}

export default function RegisterPage() {
  return <RegisterForm></RegisterForm>
}