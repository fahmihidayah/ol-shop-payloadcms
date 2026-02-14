'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { forgotPasswordSchema, ForgotPasswordSchema } from '../types/forgot-password-schema'
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
import { Mail, KeyRound, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { Alert, AlertDescription } from '@/components/ui/alert'
import Link from 'next/link'

export default function ForgotPasswordForm() {
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    // 1. Inisialisasi form
    const form = useForm<ForgotPasswordSchema>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: '',
        },
    })

    // 2. Handler submit
    const onSubmit = async (values: ForgotPasswordSchema) => {
        setIsLoading(true)
        try {
            console.log(values)
            // Tambahkan logika reset password di sini
            // await requestPasswordReset(values.email)

            // Simulasi delay
            await new Promise((resolve) => setTimeout(resolve, 1500))
            setIsSuccess(true)
        } catch (error) {
            console.error('Password reset request failed:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background p-4">
            <Card className="w-full max-w-md border-border/50 shadow-lg">
                <CardHeader className="space-y-1 text-center">
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <KeyRound className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Lupa Password</CardTitle>
                    <CardDescription>
                        Masukkan email Anda dan kami akan mengirimkan instruksi reset password
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isSuccess ? (
                        <div className="space-y-4">
                            {/* <Alert className="border-success/50 bg-success/10">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <AlertDescription className="text-success">
                  Email reset password telah dikirim! Silakan cek inbox Anda.
                </AlertDescription>
              </Alert> */}

                            <div className="text-center space-y-4">
                                <p className="text-sm text-muted-foreground">
                                    Tidak menerima email? Periksa folder spam atau hubungi administrator.
                                </p>

                                <Link href="/login">
                                    <Button variant="outline" className="w-full">
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Kembali ke Login
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <>
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

                                    <Button type="submit" className="w-full" disabled={isLoading}>
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Mengirim Email...
                                            </>
                                        ) : (
                                            <>
                                                <Mail className="mr-2 h-4 w-4" />
                                                Kirim Reset Password
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </Form>

                            {/* Back to Login */}
                            <div className="mt-6 text-center">
                                <Link
                                    href="/login"
                                    className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                                >
                                    <ArrowLeft className="h-3 w-3" />
                                    Kembali ke Login
                                </Link>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}