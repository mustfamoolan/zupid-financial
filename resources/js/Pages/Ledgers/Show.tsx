import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { FileSpreadsheet, Plus, ArrowRight, Trash2, Edit2, Calculator, Calendar, Printer } from 'lucide-react';

interface LedgerItem {
    id: number;
    details: string | null;
    purchase_amount: number;
    store_payment_details: string | null;
    store_payment: number;
    rmb_amount: number;
    rmb_exchange_rate: number;
    transfer_date: string | null;
    usd_amount: number;
}

interface Customer {
    id: number;
    name: string;
    phone: string | null;
}

interface CustomerLedger {
    id: number;
    title: string;
    notes: string | null;
    created_at: string;
    total_usd: number;
    total_rmb: number;
    total_store_payments: number;
    total_purchases: number;
    total_payments: number;
    remaining_balance: number;
    customer: Customer;
    items: LedgerItem[];
}

interface ShowProps {
    ledger: CustomerLedger;
    customer: Customer;
}

const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return '-';
    const match = dateStr.match(/(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
    if (match) {
        return `${match[1]}/${match[2].padStart(2, '0')}/${match[3].padStart(2, '0')}`;
    }
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
    } catch {
        return dateStr;
    }
};

export default function Show({ ledger, customer }: ShowProps) {
    const itemList = ledger?.items || [];
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<LedgerItem | null>(null);

    // Form inputs for row creation/edit
    const [itemForm, setItemForm] = useState({
        details: '',
        purchase_amount: '',
        store_payment_details: '',
        store_payment: '',
        rmb_exchange_rate: '7.25',
        transfer_date: new Date().toISOString().split('T')[0],
        usd_amount: '',
    });

    // Real-time calculated RMB formula preview
    const calculatedRMB = (parseFloat(itemForm.usd_amount || '0') * parseFloat(itemForm.rmb_exchange_rate || '0')).toFixed(2);

    const handleAddItem = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(`/ledgers/${ledger.id}/items`, itemForm, {
            onSuccess: () => {
                setIsAddModalOpen(false);
                resetForm();
            },
        });
    };

    const handleUpdateItem = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingItem) return;
        router.put(`/items/${editingItem.id}`, itemForm, {
            onSuccess: () => {
                setEditingItem(null);
                resetForm();
            },
        });
    };

    const handleDeleteItem = (itemId: number) => {
        if (confirm('هل أنت تأكد من رغبتك بحذف هذا السطر؟')) {
            router.delete(`/items/${itemId}`);
        }
    };

    const startEditItem = (item: LedgerItem) => {
        setEditingItem(item);
        setItemForm({
            details: item.details || '',
            purchase_amount: item.purchase_amount.toString(),
            store_payment_details: item.store_payment_details || '',
            store_payment: item.store_payment.toString(),
            rmb_exchange_rate: item.rmb_exchange_rate.toString(),
            transfer_date: item.transfer_date || '',
            usd_amount: item.usd_amount.toString(),
        });
    };

    const resetForm = () => {
        setItemForm({
            details: '',
            purchase_amount: '',
            store_payment_details: '',
            store_payment: '',
            rmb_exchange_rate: '7.25',
            transfer_date: new Date().toISOString().split('T')[0],
            usd_amount: '',
        });
    };

    return (
        <AuthenticatedLayout header={`جدول حسابات: ${ledger?.title || ''}`}>
            <Head title={`جدول الحسابات - ${ledger?.title || ''}`} />

            {/* 1. SCREEN VIEW CONTAINER (HIDDEN DURING PRINTING) */}
            <div className="space-y-6 text-right print:hidden">
                
                {/* Header Back & Action Links */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <Link href={`/customers/${customer?.id}`} className="w-full sm:w-auto">
                        <Button variant="ghost" size="sm" className="w-full sm:w-auto justify-start sm:justify-center gap-2 text-xs">
                            <ArrowRight className="h-4 w-4" />
                            العودة لملف الزبون ({customer?.name})
                        </Button>
                    </Link>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                        <Button variant="outline" size="sm" onClick={() => window.print()} className="w-full sm:w-auto gap-1 text-xs justify-center">
                            <Printer className="h-4 w-4" />
                            طباعة الجدول
                        </Button>
                        <Button onClick={() => { resetForm(); setIsAddModalOpen(true); }} className="w-full sm:w-auto gap-2 font-bold text-xs justify-center">
                            <Plus className="h-4 w-4" />
                            إضافة سطر/بند جديد
                        </Button>
                    </div>
                </div>

                {/* Ledger Header Card */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-xl border border-border bg-card text-card-foreground shadow-sm">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Badge variant="outline">جدول حسابات معتمد</Badge>
                            <span className="text-xs text-muted-foreground">الزبون: {customer?.name}</span>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-primary">{ledger?.title}</h1>
                        <p className="text-xs text-muted-foreground">
                            {ledger?.notes || 'جدول حسابات تفاعلي يعالج التحويلات والمشتريات وسعر الصرف التلقائي.'}
                        </p>
                    </div>
                </div>

                {/* 4 Calculated Excel Summary KPI Cards (المجاميع الكلية المستخرجة من الإكسل) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    
                    {/* A4: مجموع الدولار */}
                    <Card className="border-primary/30">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
                            <CardTitle className="text-xs font-medium text-muted-foreground">مجموع الدولار (USD)</CardTitle>
                            <span className="text-xs font-bold text-primary">$</span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-extrabold text-foreground font-mono">
                                ${Number(ledger?.total_usd || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-1">إجمالي المبالغ المحولة بالدولار</p>
                        </CardContent>
                    </Card>

                    {/* A7: مجموع الرممبي */}
                    <Card className="border-primary/30">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
                            <CardTitle className="text-xs font-medium text-muted-foreground">مجموع الرممبي (RMB)</CardTitle>
                            <span className="text-xs font-bold text-primary">¥</span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-extrabold text-foreground font-mono">
                                ¥{Number(ledger?.total_rmb || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-1">محسوب = الدولار × سعر الصرف</p>
                        </CardContent>
                    </Card>

                    {/* A10: مجموع الدفوعات */}
                    <Card className="border-primary/30">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
                            <CardTitle className="text-xs font-medium text-muted-foreground">مجموع الدفوعات</CardTitle>
                            <Calculator className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-extrabold text-foreground font-mono">
                                {Number(ledger?.total_payments || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-1">= دفع محلات + مبلغ المشتريات</p>
                        </CardContent>
                    </Card>

                    {/* A13: المجموع الباقي (الرصيد المتبقي) */}
                    <Card className="border-emerald-500/50 bg-emerald-500/5">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
                            <CardTitle className="text-xs font-medium text-emerald-600 dark:text-emerald-400">المجموع الباقي (الرصيد)</CardTitle>
                            <Badge variant="default" className="text-[10px]">الصافي النهائي</Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                                {Number(ledger?.remaining_balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-1">= مجموع الرممبي - مجموع الدفوعات</p>
                        </CardContent>
                    </Card>

                </div>

                {/* Interactive Excel View: Desktop Table + Mobile Cards */}
                <Card>
                    <CardHeader className="pb-3 flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-base flex items-center gap-2">
                                <FileSpreadsheet className="h-5 w-5 text-primary" />
                                <span>جدول العمليات والتحويلات التفصيلي</span>
                            </CardTitle>
                            <CardDescription className="text-xs">
                                مطابق 100% لأعمدة ومعادلات الإكسل مع احتساب حقل الرممبي تلقائياً
                            </CardDescription>
                        </div>
                        <Badge variant="secondary">{itemList.length} بنود مسجلة</Badge>
                    </CardHeader>
                    
                    <CardContent className="p-0">
                        {/* Desktop Table View (Hidden on mobile) */}
                        <div className="hidden md:block overflow-x-auto">
                            <Table dir="rtl">
                                <TableHeader>
                                    <TableRow className="bg-muted/60 text-xs">
                                        <TableHead className="w-12 text-center">#</TableHead>
                                        <TableHead className="text-right">تفاصيل المشتريات (B)</TableHead>
                                        <TableHead className="text-right">مبلغ المشتريات (C)</TableHead>
                                        <TableHead className="text-right">تفاصيل دفع المحلات (D)</TableHead>
                                        <TableHead className="text-right">دفع محلات (E)</TableHead>
                                        <TableHead className="text-right">سعر الصرف RMB (G)</TableHead>
                                        <TableHead className="text-right">تاريخ التحويل (H)</TableHead>
                                        <TableHead className="text-right">مبلغ محول دولار (I)</TableHead>
                                        <TableHead className="text-right bg-primary/10 text-primary font-bold">مبلغ محول رممبي (F)</TableHead>
                                        <TableHead className="text-left w-24">إجراءات</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="text-xs">
                                    {itemList.length > 0 ? (
                                        itemList.map((item, idx) => (
                                            <TableRow key={item.id} className="hover:bg-muted/30 transition">
                                                <TableCell className="text-center font-mono text-muted-foreground">{idx + 1}</TableCell>
                                                <TableCell className="font-semibold text-foreground">{item.details || '-'}</TableCell>
                                                <TableCell className="font-mono">{Number(item.purchase_amount).toLocaleString()}</TableCell>
                                                <TableCell className="text-muted-foreground">{item.store_payment_details || '-'}</TableCell>
                                                <TableCell className="font-mono">{Number(item.store_payment).toLocaleString()}</TableCell>
                                                <TableCell className="font-mono text-muted-foreground">{item.rmb_exchange_rate}</TableCell>
                                                <TableCell className="font-mono text-muted-foreground" dir="ltr">{formatDate(item.transfer_date)}</TableCell>
                                                <TableCell className="font-mono font-bold text-foreground">${Number(item.usd_amount).toLocaleString()}</TableCell>
                                                <TableCell className="font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/5">
                                                    ¥{Number(item.rmb_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </TableCell>
                                                <TableCell className="text-left space-x-1">
                                                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => startEditItem(item)}>
                                                        <Edit2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDeleteItem(item.id)}>
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                                                الجدول فارغ حالياً. اضغط على "إضافة سطر/بند جديد" لإدخال أول عملية.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Mobile Responsive Cards View (Shown only on mobile) */}
                        <div className="block md:hidden p-4 space-y-3">
                            {itemList.length > 0 ? (
                                itemList.map((item, idx) => (
                                    <div key={item.id} className="p-4 rounded-lg border border-border bg-card shadow-sm space-y-3 text-right">
                                        <div className="flex items-center justify-between border-b border-border pb-2">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="font-mono">#{idx + 1}</Badge>
                                                <span className="text-xs text-muted-foreground font-mono" dir="ltr">
                                                    <Calendar className="h-3 w-3 inline ml-1" />
                                                    {formatDate(item.transfer_date)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Button variant="outline" size="sm" className="h-7 px-2 text-xs" onClick={() => startEditItem(item)}>
                                                    <Edit2 className="h-3.5 w-3.5 ml-1" /> تعديل
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDeleteItem(item.id)}>
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        </div>

                                        {/* USD & RMB Row */}
                                        <div className="grid grid-cols-2 gap-2 p-2.5 rounded-md bg-muted/50 text-xs">
                                            <div>
                                                <span className="text-muted-foreground text-[10px] block">المبلغ المحول (USD):</span>
                                                <span className="font-bold font-mono text-foreground">${Number(item.usd_amount).toLocaleString()}</span>
                                            </div>
                                            <div>
                                                <span className="text-emerald-600 dark:text-emerald-400 text-[10px] block font-semibold">الرممبي المحسوب (RMB):</span>
                                                <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">
                                                    ¥{Number(item.rmb_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Purchase Details */}
                                        <div className="space-y-1 text-xs">
                                            <div className="flex items-center justify-between text-muted-foreground">
                                                <span>تفاصيل المشتريات:</span>
                                                <span className="font-semibold text-foreground">{item.details || '-'}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-muted-foreground">
                                                <span>مبلغ المشتريات (C):</span>
                                                <span className="font-mono font-medium text-foreground">{Number(item.purchase_amount).toLocaleString()}</span>
                                            </div>
                                        </div>

                                        {/* Store Payment Details */}
                                        <div className="space-y-1 text-xs border-t border-dashed border-border pt-2">
                                            <div className="flex items-center justify-between text-muted-foreground">
                                                <span>دفع محلات (E):</span>
                                                <span className="font-mono font-medium text-foreground">{Number(item.store_payment).toLocaleString()}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-muted-foreground">
                                                <span>تفاصيل دفع المحلات:</span>
                                                <span className="text-foreground">{item.store_payment_details || '-'}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-muted-foreground">
                                                <span>سعر الصرف (G):</span>
                                                <span className="font-mono">{item.rmb_exchange_rate}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-muted-foreground text-xs">
                                    الجدول فارغ حالياً. اضغط على "إضافة سطر/بند جديد" لإدخال أول عملية.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

            </div>

            {/* 2. DEDICATED OFFICIAL EXCEL PRINT TEMPLATE (PRINT ONLY) */}
            <div className="hidden print:block text-right text-black font-sans text-xs p-2" dir="rtl">
                
                {/* Official Header */}
                <div className="border-b-2 border-black pb-3 mb-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-black">كشف حساب مالي تفصيلي</h1>
                        <p className="text-xs text-gray-700 mt-1">جدول الحسابات والتحويلات المعتمد - المنظومة المالية</p>
                    </div>
                    <div className="text-left text-xs space-y-1">
                        <div><span className="font-bold">تاريخ الطباعة: </span><span dir="ltr" className="font-mono">{new Date().toISOString().split('T')[0]}</span></div>
                        <div><span className="font-bold">عنوان الجدول: </span>{ledger?.title}</div>
                    </div>
                </div>

                {/* Customer Details Summary Bar */}
                <div className="grid grid-cols-3 gap-2 border border-black p-2.5 mb-4 bg-gray-100 text-xs">
                    <div>
                        <span className="font-bold">اسم الزبون: </span>
                        <span>{customer?.name}</span>
                    </div>
                    <div>
                        <span className="font-bold">رقم الهاتف: </span>
                        <span dir="ltr" className="font-mono">{customer?.phone || 'غير مسجل'}</span>
                    </div>
                    <div>
                        <span className="font-bold">عدد العمليات: </span>
                        <span className="font-mono">{itemList.length} بنود</span>
                    </div>
                </div>

                {/* KPI Summary Cards Table */}
                <table className="w-full mb-4 border border-black text-center text-xs border-collapse excel-print-table">
                    <thead>
                        <tr className="bg-gray-200 text-black font-bold">
                            <th className="p-2 border border-black">مجموع الدولار (USD)</th>
                            <th className="p-2 border border-black">مجموع الرممبي (RMB)</th>
                            <th className="p-2 border border-black">مجموع الدفوعات الكلي</th>
                            <th className="p-2 border border-black bg-gray-300">المجموع الباقي (الرصيد النهائي)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="font-mono font-bold text-sm">
                            <td className="p-2 border border-black">${Number(ledger?.total_usd || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                            <td className="p-2 border border-black">¥{Number(ledger?.total_rmb || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                            <td className="p-2 border border-black">{Number(ledger?.total_payments || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                            <td className="p-2 border border-black bg-gray-100">{Number(ledger?.remaining_balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                        </tr>
                    </tbody>
                </table>

                {/* Main Excel Printable Ledger Data Table */}
                <table className="w-full text-right text-xs border border-black border-collapse excel-print-table">
                    <thead>
                        <tr className="bg-gray-200 text-black font-bold text-center">
                            <th className="p-1.5 border border-black w-8">#</th>
                            <th className="p-1.5 border border-black">تفاصيل المشتريات (B)</th>
                            <th className="p-1.5 border border-black">مبلغ المشتريات (C)</th>
                            <th className="p-1.5 border border-black">تفاصيل دفع المحلات (D)</th>
                            <th className="p-1.5 border border-black">دفع محلات (E)</th>
                            <th className="p-1.5 border border-black">سعر الصرف (G)</th>
                            <th className="p-1.5 border border-black">تاريخ التحويل (H)</th>
                            <th className="p-1.5 border border-black">مبلغ دولار (I)</th>
                            <th className="p-1.5 border border-black">مبلغ رممبي (F)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {itemList.map((item, idx) => (
                            <tr key={item.id} className="border-b border-black">
                                <td className="p-1.5 border border-black text-center font-mono">{idx + 1}</td>
                                <td className="p-1.5 border border-black font-medium">{item.details || '-'}</td>
                                <td className="p-1.5 border border-black font-mono text-left">{Number(item.purchase_amount).toLocaleString()}</td>
                                <td className="p-1.5 border border-black">{item.store_payment_details || '-'}</td>
                                <td className="p-1.5 border border-black font-mono text-left">{Number(item.store_payment).toLocaleString()}</td>
                                <td className="p-1.5 border border-black font-mono text-center">{item.rmb_exchange_rate}</td>
                                <td className="p-1.5 border border-black font-mono text-center" dir="ltr">{formatDate(item.transfer_date)}</td>
                                <td className="p-1.5 border border-black font-mono text-left font-bold">${Number(item.usd_amount).toLocaleString()}</td>
                                <td className="p-1.5 border border-black font-mono text-left font-bold">¥{Number(item.rmb_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="bg-gray-200 font-bold border-t-2 border-black">
                            <td colSpan={2} className="p-2 border border-black text-center">المجموع الكلي النهائي</td>
                            <td className="p-2 border border-black font-mono text-left">{Number(ledger?.total_purchases || 0).toLocaleString()}</td>
                            <td className="p-2 border border-black"></td>
                            <td className="p-2 border border-black font-mono text-left">{Number(ledger?.total_store_payments || 0).toLocaleString()}</td>
                            <td className="p-2 border border-black"></td>
                            <td className="p-2 border border-black"></td>
                            <td className="p-2 border border-black font-mono text-left">${Number(ledger?.total_usd || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                            <td className="p-2 border border-black font-mono text-left">¥{Number(ledger?.total_rmb || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                        </tr>
                    </tfoot>
                </table>

                {/* Official Signatures Box */}
                <div className="mt-8 grid grid-cols-3 gap-4 text-center text-xs pt-4 border-t border-gray-400">
                    <div>
                        <p className="font-bold mb-8">توقيع المحاسب / الإعداد:</p>
                        <p className="text-gray-500">...............................................</p>
                    </div>
                    <div>
                        <p className="font-bold mb-8">توقيع الزبون / المستلم:</p>
                        <p className="text-gray-500">...............................................</p>
                    </div>
                    <div>
                        <p className="font-bold mb-8">مصادقة وتختيم الإدارة المالية:</p>
                        <p className="text-gray-500">...............................................</p>
                    </div>
                </div>
            </div>

            {/* Modal: Add or Edit Item (Enhanced Shadcn Styled Dialog) */}
            <Dialog open={isAddModalOpen || editingItem !== null} onOpenChange={(open) => { if (!open) { setIsAddModalOpen(false); setEditingItem(null); } }}>
                <DialogContent dir="rtl" className="sm:max-w-lg text-right p-6 rounded-xl border border-border shadow-lg">
                    <DialogHeader className="space-y-1.5 pb-2 border-b border-border">
                        <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-[11px] font-normal">
                                {editingItem ? 'تعديل سطر' : 'إضافة بند حسابي جديد'}
                            </Badge>
                            <span className="text-xs text-muted-foreground">معادلة RMB التلقائية</span>
                        </div>
                        <DialogTitle className="text-lg font-bold text-primary">
                            {editingItem ? 'تعديل بيانات السطر الحسابي' : 'إدخال عملية تحويل ومشتريات جديدة'}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={editingItem ? handleUpdateItem : handleAddItem} className="space-y-4 pt-3 text-xs">
                        
                        {/* Section 1: Amounts & Conversion */}
                        <div className="space-y-2 p-3 bg-muted/40 rounded-lg border border-border">
                            <h3 className="font-bold text-foreground text-xs flex items-center gap-1.5">
                                <Calculator className="h-4 w-4 text-primary" />
                                <span>المبالغ المحولة وسعر الصرف</span>
                            </h3>
                            
                            <div className="grid grid-cols-2 gap-3 pt-1">
                                <div className="space-y-1.5">
                                    <Label htmlFor="usd_amount" className="text-muted-foreground">مبلغ محول دولار ($) *</Label>
                                    <Input
                                        id="usd_amount"
                                        type="number"
                                        step="0.01"
                                        dir="ltr"
                                        required
                                        value={itemForm.usd_amount}
                                        onChange={(e) => setItemForm({ ...itemForm, usd_amount: e.target.value })}
                                        placeholder="1000.00"
                                        className="font-mono bg-background"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="rmb_exchange_rate" className="text-muted-foreground">سعر الصرف RMB (G) *</Label>
                                    <Input
                                        id="rmb_exchange_rate"
                                        type="number"
                                        step="0.0001"
                                        dir="ltr"
                                        required
                                        value={itemForm.rmb_exchange_rate}
                                        onChange={(e) => setItemForm({ ...itemForm, rmb_exchange_rate: e.target.value })}
                                        placeholder="7.2500"
                                        className="font-mono bg-background"
                                    />
                                </div>
                            </div>

                            {/* Realtime RMB Calculated Display */}
                            <div className="p-2.5 bg-primary/10 rounded-md border border-primary/20 flex items-center justify-between text-xs mt-2">
                                <span className="font-medium text-primary">المبلغ بالرممبي المحسوب تلقائياً (F = I × G):</span>
                                <span className="font-extrabold font-mono text-base text-primary">¥{calculatedRMB}</span>
                            </div>
                        </div>

                        {/* Section 2: Purchase Info */}
                        <div className="space-y-2 p-3 bg-muted/40 rounded-lg border border-border">
                            <h3 className="font-bold text-foreground text-xs flex items-center gap-1.5">
                                <FileSpreadsheet className="h-4 w-4 text-primary" />
                                <span>تفاصيل ومبلغ المشتريات</span>
                            </h3>

                            <div className="grid grid-cols-2 gap-3 pt-1">
                                <div className="space-y-1.5">
                                    <Label htmlFor="details" className="text-muted-foreground">تفاصيل المشتريات (B)</Label>
                                    <Input
                                        id="details"
                                        value={itemForm.details}
                                        onChange={(e) => setItemForm({ ...itemForm, details: e.target.value })}
                                        placeholder="بيان الشحنة..."
                                        className="bg-background"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="purchase_amount" className="text-muted-foreground">مبلغ المشتريات (C)</Label>
                                    <Input
                                        id="purchase_amount"
                                        type="number"
                                        step="0.01"
                                        dir="ltr"
                                        value={itemForm.purchase_amount}
                                        onChange={(e) => setItemForm({ ...itemForm, purchase_amount: e.target.value })}
                                        placeholder="0.00"
                                        className="font-mono bg-background"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Store Payments & Date */}
                        <div className="space-y-2 p-3 bg-muted/40 rounded-lg border border-border">
                            <h3 className="font-bold text-foreground text-xs flex items-center gap-1.5">
                                <Calendar className="h-4 w-4 text-primary" />
                                <span>دفع المحلات وتاريخ التحويل</span>
                            </h3>

                            <div className="grid grid-cols-2 gap-3 pt-1">
                                <div className="space-y-1.5">
                                    <Label htmlFor="store_payment_details" className="text-muted-foreground">تفاصيل دفع المحلات (D)</Label>
                                    <Input
                                        id="store_payment_details"
                                        value={itemForm.store_payment_details}
                                        onChange={(e) => setItemForm({ ...itemForm, store_payment_details: e.target.value })}
                                        placeholder="بيان دفعة المحل..."
                                        className="bg-background"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="store_payment" className="text-muted-foreground">دفع محلات (E)</Label>
                                    <Input
                                        id="store_payment"
                                        type="number"
                                        step="0.01"
                                        dir="ltr"
                                        value={itemForm.store_payment}
                                        onChange={(e) => setItemForm({ ...itemForm, store_payment: e.target.value })}
                                        placeholder="0.00"
                                        className="font-mono bg-background"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5 pt-1">
                                <Label htmlFor="transfer_date" className="text-muted-foreground">تاريخ التحويل (H)</Label>
                                <Input
                                    id="transfer_date"
                                    type="date"
                                    dir="ltr"
                                    value={itemForm.transfer_date}
                                    onChange={(e) => setItemForm({ ...itemForm, transfer_date: e.target.value })}
                                    className="bg-background font-mono text-right"
                                />
                            </div>
                        </div>

                        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-start pt-2 border-t border-border mt-4">
                            <Button type="submit" className="w-full sm:w-auto font-bold gap-1 justify-center">
                                <Plus className="h-4 w-4" />
                                {editingItem ? 'حفظ التعديلات' : 'حفظ وإضافة السطر للجدول'}
                            </Button>
                            <Button type="button" variant="outline" className="w-full sm:w-auto justify-center" onClick={() => { setIsAddModalOpen(false); setEditingItem(null); }}>
                                إلغاء
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}

