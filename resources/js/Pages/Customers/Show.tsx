import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Phone, MapPin, FileSpreadsheet, Plus, ArrowRight, Trash2, Calendar, UserCheck } from 'lucide-react';

interface LedgerItem {
    id: number;
    usd_amount: number;
    rmb_amount: number;
    store_payment: number;
    purchase_amount: number;
}

interface CustomerLedger {
    id: number;
    title: string;
    notes: string | null;
    created_at: string;
    total_usd: number;
    total_rmb: number;
    total_payments: number;
    remaining_balance: number;
    user?: {
        name: string;
    };
    items?: LedgerItem[];
}

interface Customer {
    id: number;
    name: string;
    phone: string | null;
    address: string | null;
    notes: string | null;
    ledgers: CustomerLedger[];
}

interface ShowProps {
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

export default function Show({ customer }: ShowProps) {
    const ledgerList = customer?.ledgers || [];
    const [isAddLedgerOpen, setIsAddLedgerOpen] = useState(false);
    const [ledgerTitle, setLedgerTitle] = useState('');
    const [ledgerNotes, setLedgerNotes] = useState('');

    const handleCreateLedger = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(`/customers/${customer.id}/ledgers`, {
            title: ledgerTitle,
            notes: ledgerNotes,
        }, {
            onSuccess: () => {
                setIsAddLedgerOpen(false);
                setLedgerTitle('');
                setLedgerNotes('');
            },
        });
    };

    const handleDeleteCustomer = () => {
        if (confirm('هل أنت تأكد من رغبتك بحذف هذا الزبون وكافة جداوله المالحية؟')) {
            router.delete(`/customers/${customer.id}`);
        }
    };

    return (
        <AuthenticatedLayout header={`ملف الزبون: ${customer?.name || ''}`}>
            <Head title={`الزبون - ${customer?.name || ''}`} />

            <div className="space-y-6 text-right">
                
                {/* Top Navigation Back Link & Delete */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <Link href="/customers" className="w-full sm:w-auto">
                        <Button variant="ghost" size="sm" className="w-full sm:w-auto justify-start sm:justify-center gap-2 text-xs">
                            <ArrowRight className="h-4 w-4" />
                            العودة لقائمة الزبائن
                        </Button>
                    </Link>
                    <Button variant="destructive" size="sm" onClick={handleDeleteCustomer} className="w-full sm:w-auto gap-1 text-xs justify-center">
                        <Trash2 className="h-4 w-4" />
                        حذف الزبون
                    </Button>
                </div>

                {/* Customer Details Card */}
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <Badge variant="outline" className="mb-1">بيانات الزبون</Badge>
                                <CardTitle className="text-2xl">{customer?.name}</CardTitle>
                            </div>
                            <Button onClick={() => setIsAddLedgerOpen(true)} className="w-full sm:w-auto gap-2 font-bold text-xs justify-center">
                                <Plus className="h-4 w-4" />
                                إنشاء جدول حسابات جديد للزبون
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-border pt-4 text-xs">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="h-4 w-4 shrink-0 text-primary" />
                            <span>رقم الهاتف:</span>
                            <span dir="ltr" className="font-semibold text-foreground font-mono">{customer?.phone || 'غير محدد'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4 shrink-0 text-primary" />
                            <span>العنوان:</span>
                            <span className="font-semibold text-foreground">{customer?.address || 'غير محدد'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <FileSpreadsheet className="h-4 w-4 shrink-0 text-primary" />
                            <span>جداول الحسابات:</span>
                            <span className="font-semibold text-foreground">{ledgerList.length} جداول مكسورة/نشطة</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Multi-Ledger List (جداول الحسابات المفتوحة للزبون) */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-foreground">جداول الحسابات المالية التابعة للزبون ({ledgerList.length})</h2>
                        <span className="text-xs text-muted-foreground">يمكن إنشاء أكثر من جدول حسابات مستقل لنفس الزبون</span>
                    </div>

                    {ledgerList.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {ledgerList.map((ledger) => (
                                <Card key={ledger.id} className="hover:border-primary/50 transition shadow-sm">
                                    <CardHeader className="pb-2">
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-1">
                                                <CardTitle className="text-base text-primary">
                                                    <Link href={`/ledgers/${ledger.id}`} className="hover:underline">
                                                        {ledger.title}
                                                    </Link>
                                                </CardTitle>
                                                <CardDescription className="text-xs">
                                                    {ledger.notes || 'لا يوجد ملاحظات إضافية'}
                                                </CardDescription>
                                            </div>
                                            <Badge variant="secondary" className="gap-1 font-mono">
                                                <Calendar className="h-3 w-3" />
                                                {formatDate(ledger.created_at)}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-3 pt-2 text-xs">
                                        
                                        {/* Summaries Grid */}
                                        <div className="grid grid-cols-2 gap-2 p-3 bg-muted/50 rounded-lg text-right">
                                            <div>
                                                <span className="text-muted-foreground block text-[10px]">مجموع الدولار:</span>
                                                <span className="font-bold text-foreground font-mono">${ledger.total_usd.toLocaleString()}</span>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground block text-[10px]">مجموع الرممبي (RMB):</span>
                                                <span className="font-bold text-foreground font-mono">¥{ledger.total_rmb.toLocaleString()}</span>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground block text-[10px]">إجمالي الدفوعات:</span>
                                                <span className="font-bold text-foreground font-mono">{ledger.total_payments.toLocaleString()}</span>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground block text-[10px]">المجموع الباقي:</span>
                                                <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">{ledger.remaining_balance.toLocaleString()}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-1">
                                            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                                                <UserCheck className="h-3 w-3" /> المنشئ: {ledger.user?.name || 'الأدمن'}
                                            </span>
                                            <Link href={`/ledgers/${ledger.id}`}>
                                                <Button size="sm" className="gap-1 text-xs font-bold">
                                                    <span>فتح جدول الإكسل الحسابي</span>
                                                    <ArrowRight className="h-3.5 w-3.5 rotate-180" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="p-8 text-center text-muted-foreground space-y-3">
                                <FileSpreadsheet className="h-10 w-10 mx-auto text-muted-foreground/60" />
                                <p>لا يوجد أي جدول حسابات مفتوح لهذا الزبون حالياً.</p>
                                <Button onClick={() => setIsAddLedgerOpen(true)} className="gap-2 text-xs font-bold">
                                    <Plus className="h-4 w-4" />
                                    إنشاء أول جدول حسابات للزبون
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>

            </div>

            {/* Modal: Create Ledger (Enhanced Shadcn Styled Dialog) */}
            <Dialog open={isAddLedgerOpen} onOpenChange={setIsAddLedgerOpen}>
                <DialogContent dir="rtl" className="sm:max-w-md text-right p-6 rounded-xl border border-border shadow-lg">
                    <DialogHeader className="space-y-1 pb-2 border-b border-border">
                        <Badge variant="outline" className="w-fit text-[11px]">جدول حسابات جديد</Badge>
                        <DialogTitle className="text-lg font-bold text-primary">
                            إنشاء جدول حسابات مالي للزبون ({customer?.name})
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleCreateLedger} className="space-y-4 pt-3 text-xs">
                        <div className="space-y-1.5">
                            <Label htmlFor="title" className="text-muted-foreground">عنوان الجدول / الحساب *</Label>
                            <Input
                                id="title"
                                required
                                value={ledgerTitle}
                                onChange={(e) => setLedgerTitle(e.target.value)}
                                placeholder="مثال: جدول مشتريات الصين - وجبة أيلول 2026"
                                className="bg-background"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="ledgerNotes" className="text-muted-foreground">ملاحظات وقود الجدول</Label>
                            <Input
                                id="ledgerNotes"
                                value={ledgerNotes}
                                onChange={(e) => setLedgerNotes(e.target.value)}
                                placeholder="ملاحظات توضيحية اختيارية..."
                                className="bg-background"
                            />
                        </div>

                        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-start pt-2 border-t border-border mt-4">
                            <Button type="submit" className="w-full sm:w-auto font-bold gap-1 justify-center">
                                <Plus className="h-4 w-4" />
                                إنشاء وشروع الإدخال
                            </Button>
                            <Button type="button" variant="outline" className="w-full sm:w-auto justify-center" onClick={() => setIsAddLedgerOpen(false)}>
                                إلغاء
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}

