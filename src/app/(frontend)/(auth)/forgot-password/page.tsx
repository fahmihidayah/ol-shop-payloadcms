import ForgotPasswordForm from '@/feature/auth/components/forgot-password-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Forgot Password',
  description:
    'Reset your password securely. Enter your email address and we will send you instructions to create a new password.',
  robots: {
    index: false,
    follow: true,
  },
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />
}