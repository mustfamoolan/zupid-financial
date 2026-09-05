import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Wallet, AlertCircle } from 'lucide-react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        login: '',
        password: '',
        remember: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <>
            <Head title="تسجيل الدخول - المنظومة المالية" />
            <div
                className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-4"
                dir="rtl"
            >
                {/* Brand Header */}
                <div className="mb-8 flex flex-col items-center gap-3">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary text-primary-foreground font-bold shadow-sm">
                        <Wallet className="h-6 w-6" />
                    </div>
                    <div className="text-center">
                        <h1 className="text-2xl font-bold tracking-tight">المنظومة المالية الموحدة</h1>
                        <p className="text-sm text-muted-foreground mt-1">نظام إدارة الحسابات والزبائن والجداول الحسابية</p>
                    </div>
                </div>

                {/* Card */}
                <Card className="w-full max-w-sm shadow-md">
                    <CardHeader className="space-y-1 text-center">
                        <CardTitle className="text-xl">تسجيل الدخول</CardTitle>
                        <CardDescription>
                            أدخل اسم المستخدم وكلمة المرور للوصول إلى حسابتك
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {/* Error Alert */}
                        {errors.login && (
                            <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg flex items-center gap-2 text-xs text-destructive text-right">
                                <AlertCircle className="h-4 w-4 shrink-0" />
                                <span>{errors.login}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4 text-right">
                            {/* Username / Email */}
                            <div className="space-y-2">
                                <Label htmlFor="login">اسم المستخدم أو البريد الإلكتروني</Label>
                                <Input
                                    id="login"
                                    type="text"
                                    placeholder="اسم المستخدم..."
                                    value={data.login}
                                    onChange={(e) => setData('login', e.target.value)}
                                    autoComplete="username"
                                    dir="ltr"
                                    required
                                />
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">كلمة المرور</Label>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    autoComplete="current-password"
                                    dir="ltr"
                                    required
                                />
                            </div>

                            <Button type="submit" disabled={processing} className="w-full font-bold">
                                {processing ? 'جاري التحقق...' : 'تسجيل الدخول للنظام'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

