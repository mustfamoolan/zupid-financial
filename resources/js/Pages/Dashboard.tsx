import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, FileSpreadsheet, Calculator, Plus, ArrowLeft, Shield, Calendar, Wallet } from 'lucide-react';

interface Customer {
    id: number;
    name: string;
    phone: string | null;
    address: string | null;
    ledgers_count: number;
}

interface CustomerLedger {
    id: number;
    title: string;
    created_at: string;
    total_usd: number;
    remaining_balance: number;
    customer?: {
        id: number;
        name: string;
    };
}

interface DashboardProps {
    stats: {
        total_customers: number;
        total_ledgers: number;
        total_usd: number;
        total_rmb: number;
        total_payments: number;
        remaining_balance: number;
    };
    recent_customers: Customer[];
    recent_ledgers: CustomerLedger[];
    filters?: {
        date_from?: string;
        date_to?: string;
    };
}

const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return '-';
    const match = dateStr.match(/(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
    if (match) {
        return `${match[1]}/${match[2].padStart(2, '0')}/${match[3].padStart(2, '0')}`;
    }
    return dateStr;
};

export default function Dashboard({ stats, recent_customers = [], recent_ledgers = [], filters = {} }: DashboardProps) {
    const [dateForm, setDateForm] = useState({
        date_from: filters?.date_from || '',
        date_to: filters?.date_to || '',
    });

    const handleDateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/dashboard', dateForm, { preserveState: true });
    };

    const handleResetDate = () => {
        setDateForm({ date_from: '', date_to: '' });
        router.get('/dashboard', {}, { preserveState: true });
    };

    return (
        <AuthenticatedLayout header="الرئيسية والإحصائيات">
            <Head title="الرئيسية - النظام المالي" />

            <div className="space-y-6 text-right">

                {/* Banner & Quick Shortcuts */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-xl border border-border bg-card text-card-foreground shadow-sm">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Badge variant="outline">لوحة التحكم الرئيسية</Badge>
                            <span className="text-xs text-muted-foreground">نظام إدارة جداول الزبائن والمالية</span>
                        </div>
                        <h1 className="text-2xl font-extrabold tracking-tight text-primary">مرحباً بك في المنظومة المالية الموحدة</h1>
                        <p className="text-xs text-muted-foreground">
                            إحصائيات المبالغ المالية المحولة، الجداول المفتوحة، وأزرار الاختصار السريعة.
                        </p>
                    </div>

                    {/* Quick Shortcuts Buttons */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <Link href="/customers">
                            <Button className="w-full sm:w-auto gap-2 font-bold text-xs justify-center">
                                <Plus className="h-4 w-4" />
                                إضافة زبون جديد
                            </Button>
                        </Link>
                        <Link href="/customers">
                            <Button variant="outline" className="w-full sm:w-auto gap-2 text-xs justify-center">
                                <Users className="h-4 w-4" />
                                استعراض دليل الزبائن
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Date Filter Bar for Dashboard Statistics */}
                <Card>
                    <CardContent className="p-4">
                        <form onSubmit={handleDateSubmit} className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-xs">
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
                                <div className="space-y-1 flex-1">
                                    <span className="text-muted-foreground block">من تاريخ:</span>
                                    <input
                                        type="date"
                                        dir="ltr"
                                        value={dateForm.date_from}
                                        onChange={(e) => setDateForm({ ...dateForm, date_from: e.target.value })}
                                        className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus:outline-none focus:ring-1 focus:ring-ring font-mono text-right"
                                    />
                                </div>
                                <div className="space-y-1 flex-1">
                                    <span className="text-muted-foreground block">إلى تاريخ:</span>
                                    <input
                                        type="date"
                                        dir="ltr"
                                        value={dateForm.date_to}
                                        onChange={(e) => setDateForm({ ...dateForm, date_to: e.target.value })}
                                        className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus:outline-none focus:ring-1 focus:ring-ring font-mono text-right"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button type="submit" size="sm" className="font-bold text-xs">
                                    تحديث الإحصائيات بالتاريخ
                                </Button>
                                <Button type="button" variant="outline" size="sm" onClick={handleResetDate} className="text-xs">
                                    عرض الكلي
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* KPI Financial Statistics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    
                    {/* Total Customers */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs font-medium text-muted-foreground">إجمالي الزبائن</CardTitle>
                            <Users className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black font-mono text-foreground">
                                {stats.total_customers}
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-1">زبائن مسجلين بالنظام</p>
                        </CardContent>
                    </Card>

                    {/* Total Ledgers */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs font-medium text-muted-foreground">جداول الحسابات المفتوحة</CardTitle>
                            <FileSpreadsheet className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black font-mono text-foreground">
                                {stats.total_ledgers}
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-1">جداول إكسل حسابية</p>
                        </CardContent>
                    </Card>

                    {/* Total USD Transferred */}
                    <Card className="border-primary/40">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs font-medium text-muted-foreground">إجمالي المبالغ بالدولار</CardTitle>
                            <span className="font-bold text-primary">$</span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-black font-mono text-primary">
                                ${Number(stats.total_usd || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-1">مجموع الحوالات بالدولار ($)</p>
                        </CardContent>
                    </Card>

                    {/* Total Net Balance */}
                    <Card className="border-emerald-500/50 bg-emerald-500/5">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs font-medium text-emerald-600 dark:text-emerald-400">إجمالي المجموع الباقي</CardTitle>
                            <Badge variant="default" className="text-[10px]">الصافي الكلي</Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                                {Number(stats.remaining_balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-1">إجمالي الرصيد الباقي لجميع الزبائن</p>
                        </CardContent>
                    </Card>

                </div>

                {/* Quick Action Cards & Recent Activities */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Recent Customers List */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Users className="h-5 w-5 text-primary" />
                                    <span>أحدث الزبائن المسجلين</span>
                                </CardTitle>
                                <CardDescription className="text-xs">آخر الزبائن المضافين للنظام</CardDescription>
                            </div>
                            <Link href="/customers">
                                <Button variant="ghost" size="sm" className="gap-1 text-xs">
                                    <span>عرض الكل</span>
                                    <ArrowLeft className="h-3.5 w-3.5" />
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent className="space-y-2 pt-2">
                            {recent_customers.length > 0 ? (
                                recent_customers.map((c) => (
                                    <div key={c.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:bg-muted/40 transition text-xs">
                                        <div>
                                            <Link href={`/customers/${c.id}`} className="font-bold text-foreground hover:underline block text-sm">
                                                {c.name}
                                            </Link>
                                            <span className="text-muted-foreground text-[11px] font-mono" dir="ltr">{c.phone || 'بدون هاتف'}</span>
                                        </div>
                                        <Badge variant="secondary" className="gap-1 font-mono">
                                            <FileSpreadsheet className="h-3 w-3" />
                                            {c.ledgers_count} جداول
                                        </Badge>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center py-6 text-xs text-muted-foreground">لا يوجد زبائن مسجلين حالياً</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Ledgers List */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <FileSpreadsheet className="h-5 w-5 text-primary" />
                                    <span>أحدث جداول الحسابات المفتوحة</span>
                                </CardTitle>
                                <CardDescription className="text-xs">جداول إكسل المحتسبة مؤخراً</CardDescription>
                            </div>
                            <Link href="/customers">
                                <Button variant="ghost" size="sm" className="gap-1 text-xs">
                                    <span>عرض الكل</span>
                                    <ArrowLeft className="h-3.5 w-3.5" />
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent className="space-y-2 pt-2">
                            {recent_ledgers.length > 0 ? (
                                recent_ledgers.map((l) => (
                                    <div key={l.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:bg-muted/40 transition text-xs">
                                        <div className="space-y-0.5">
                                            <Link href={`/ledgers/${l.id}`} className="font-bold text-primary hover:underline block text-sm">
                                                {l.title}
                                            </Link>
                                            <span className="text-muted-foreground text-[11px]">الزبون: {l.customer?.name || '-'}</span>
                                        </div>
                                        <div className="text-left font-mono">
                                            <span className="font-bold block text-foreground">${Number(l.total_usd || 0).toLocaleString()}</span>
                                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400">باقي: {Number(l.remaining_balance || 0).toLocaleString()}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center py-6 text-xs text-muted-foreground">لا يوجد جداول مضافة حالياً</p>
                            )}
                        </CardContent>
                    </Card>

                </div>

            </div>
        </AuthenticatedLayout>
    );
}
