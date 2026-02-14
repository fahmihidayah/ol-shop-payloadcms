'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, Lock, Eye, EyeOff, LogIn, Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { loginFormSchema, LoginFormSchema } from '../types/login-form-schema'
import { login } from '../actions'

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()
    const redirectUrl = searchParams.get('redirect') || '/dashboard'

    // 1. Inisialisasi form
    const form = useForm<LoginFormSchema>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    })

    // 2. Handler submit
    const onSubmit = async (values: LoginFormSchema) => {
        console.log('[LOGIN FORM] Submitting login form')
        setIsLoading(true)
        try {
            console.log('[LOGIN FORM] Calling login action with email:', values.email)
            const result = await login(values)
            console.log('[LOGIN FORM] Login result received:', {
                success: result.success,
                hasUser: !!result.user,
                hasToken: !!result.token,
                error: result.error,
            })

            if (result.success && result.user && result.token) {
                console.log('[LOGIN FORM] Login successful, redirecting to dashboard')
                toast.success('Login berhasil! Mengalihkan ke dashboard...')
                window.location.href = "/"
            } else {
                console.log('[LOGIN FORM] Login failed:', result.error)
                toast.error(result.error || 'Gagal login. Periksa kembali email dan password Anda.')
            }
        } catch (error) {
            console.error('[LOGIN FORM] Exception during login:', error)
            toast.error('Terjadi kesalahan saat login. Silakan coba lagi.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background p-4">
            <Card className="w-full max-w-md border-border/50 shadow-lg">
                <CardHeader className="space-y-1 text-center">
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <LogIn className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Login</CardTitle>
                    <CardDescription>Masukkan email dan password untuk mengakses dashboard</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            {/* Field Email */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    placeholder="nama@contoh.com"
                                                    className="pl-10"
                                                    type="email"
                                                    autoComplete="email"
                                                    disabled={isLoading}
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Field Password */}
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    placeholder="Password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    className="pl-10 pr-10"
                                                    autoComplete="current-password"
                                                    disabled={isLoading}
                                                    {...field}
                                                    value={(field.value as string) ?? ''}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                                    disabled={isLoading}
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="h-4 w-4" />
                                                    ) : (
                                                        <Eye className="h-4 w-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Memproses...
                                    </>
                                ) : (
                                    <>
                                        <LogIn className="mr-2 h-4 w-4" />
                                        Masuk
                                    </>
                                )}
                            </Button>
                        </form>
                    </Form>

                    {/* Additional Info */}
                    <div className="mt-6 space-y-2 text-center text-sm">
                        <div>
                            <Link href="/forgot-password" className="text-primary hover:underline">
                                Lupa password?
                            </Link>
                        </div>
                        <div className="text-muted-foreground">
                            Belum punya akun?{' '}
                            <Link href="/register" className="text-primary hover:underline font-medium">
                                Daftar di sini
                            </Link>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}