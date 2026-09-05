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
import { Users, UserPlus, Search, Phone, MapPin, ChevronLeft, FileSpreadsheet } from 'lucide-react';

interface Customer {
    id: number;
    name: string;
    phone: string | null;
    address: string | null;
    notes: string | null;
    ledgers_count: number;
    updated_at: string;
}

interface IndexProps {
    customers: {
        data: Customer[];
        links: any[];
        current_page: number;
        last_page: number;
    };
    filters?: {
        search?: string;
        date_from?: string;
        date_to?: string;
    };
}

export default function Index({ customers, filters = {} }: IndexProps) {
    const customerList: Customer[] = Array.isArray(customers) 
        ? customers 
        : (customers && 'data' in customers && Array.isArray(customers.data) ? customers.data : []);
    
    const [filterState, setFilterState] = useState({
        search: filters?.search || '',
        date_from: filters?.date_from || '',
        date_to: filters?.date_to || '',
    });

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        notes: '',
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/customers', filterState, { preserveState: true });
    };

    const handleResetFilters = () => {
        setFilterState({ search: '', date_from: '', date_to: '' });
        router.get('/customers', {}, { preserveState: true });
    };

    const handleAddCustomer = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/customers', formData, {
            onSuccess: () => {
                setIsAddOpen(false);
                setFormData({ name: '', phone: '', address: '', notes: '' });
            },
        });
    };

    return (
        <AuthenticatedLayout header="دليل الزبائن وجداول الحسابات">
            <Head title="دليل الزبائن" />

            <div className="space-y-6 text-right">
                
                {/* Header Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-xl border border-border bg-card text-card-foreground shadow-sm">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Badge variant="outline">إدارة الزبائن</Badge>
                            <span className="text-xs text-muted-foreground">إجمالي الزبائن: {customerList.length}</span>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight">سجل الزبائن والحسابات المالية</h1>
                        <p className="text-xs text-muted-foreground">
                            إدارة بيانات الزبائن وإنشاء واستعراض جداول الحسابات المالية التابعة لكل زبون.
                        </p>
                    </div>
                    <Button onClick={() => setIsAddOpen(true)} className="w-full sm:w-auto gap-2 text-xs font-bold justify-center">
                        <UserPlus className="h-4 w-4" />
                        إضافة زبون جديد
                    </Button>
                </div>

                {/* Search & Date Filter Bar */}
                <Card>
                    <CardContent className="p-4">
                        <form onSubmit={handleSearch} className="space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                                
                                {/* Search input */}
                                <div className="relative flex-1">
                                    <Label htmlFor="search" className="text-muted-foreground mb-1 block">البحث بالنص:</Label>
                                    <div className="relative">
                                        <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="search"
                                            type="text"
                                            placeholder="اسم الزبون، الهاتف، أو العنوان..."
                                            value={filterState.search}
                                            onChange={(e) => setFilterState({ ...filterState, search: e.target.value })}
                                            className="pr-9 text-xs bg-background"
                                        />
                                    </div>
                                </div>

                                {/* Date From */}
                                <div>
                                    <Label htmlFor="date_from" className="text-muted-foreground mb-1 block">من تاريخ الإضافة:</Label>
                                    <Input
                                        id="date_from"
                                        type="date"
                                        dir="ltr"
                                        value={filterState.date_from}
                                        onChange={(e) => setFilterState({ ...filterState, date_from: e.target.value })}
                                        className="text-xs bg-background text-right font-mono"
                                    />
                                </div>

                                {/* Date To */}
                                <div>
                                    <Label htmlFor="date_to" className="text-muted-foreground mb-1 block">إلى تاريخ الإضافة:</Label>
                                    <Input
                                        id="date_to"
                                        type="date"
                                        dir="ltr"
                                        value={filterState.date_to}
                                        onChange={(e) => setFilterState({ ...filterState, date_to: e.target.value })}
                                        className="text-xs bg-background text-right font-mono"
                                    />
                                </div>

                            </div>

                            <div className="flex justify-end gap-2 pt-1 border-t border-border">
                                <Button type="submit" size="sm" className="text-xs font-bold">
                                    تطبيق البحث والفلترة
                                </Button>
                                <Button type="button" variant="outline" size="sm" onClick={handleResetFilters} className="text-xs">
                                    إعادة ضبط
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Customers View: Desktop Table + Mobile Cards */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center justify-between">
                            <span>قائمة الزبائن المسجلين</span>
                            <Users className="h-5 w-5 text-muted-foreground" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {/* Desktop Table (Hidden on mobile) */}
                        <div className="hidden md:block overflow-x-auto">
                            <Table dir="rtl">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-right">اسم الزبون</TableHead>
                                        <TableHead className="text-right">رقم الهاتف</TableHead>
                                        <TableHead className="text-right">العنوان</TableHead>
                                        <TableHead className="text-right">عدد جداول الحسابات</TableHead>
                                        <TableHead className="text-left">الإجراء</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {customerList.length > 0 ? (
                                        customerList.map((customer) => (
                                            <TableRow key={customer.id} className="hover:bg-muted/40 transition">
                                                <TableCell className="font-semibold text-foreground">
                                                    <Link href={`/customers/${customer.id}`} className="hover:underline flex items-center gap-2">
                                                        <span>{customer.name}</span>
                                                    </Link>
                                                </TableCell>
                                                <TableCell dir="ltr" className="text-right text-muted-foreground font-mono">
                                                    {customer.phone || 'غير محدد'}
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {customer.address || 'غير محدد'}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary" className="gap-1">
                                                        <FileSpreadsheet className="h-3 w-3" />
                                                        {customer.ledgers_count ?? 0} جدول مالي
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-left">
                                                    <Link href={`/customers/${customer.id}`}>
                                                        <Button variant="ghost" size="sm" className="gap-1 text-xs">
                                                            <span>استعراض الحسابات</span>
                                                            <ChevronLeft className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                                لا يوجد زبائن مسجلين حالياً. اضغط "إضافة زبون جديد" للبدء.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Mobile Cards View (Shown only on mobile) */}
                        <div className="block md:hidden p-4 space-y-3">
                            {customerList.length > 0 ? (
                                customerList.map((customer) => (
                                    <div key={customer.id} className="p-4 rounded-lg border border-border bg-card shadow-sm space-y-3 text-right">
                                        <div className="flex items-center justify-between border-b border-border pb-2">
                                            <Link href={`/customers/${customer.id}`} className="font-bold text-base text-primary hover:underline">
                                                {customer.name}
                                            </Link>
                                            <Badge variant="secondary" className="gap-1">
                                                <FileSpreadsheet className="h-3 w-3" />
                                                {customer.ledgers_count ?? 0} جداول
                                            </Badge>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                                            <div className="flex items-center gap-1.5">
                                                <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
                                                <span dir="ltr" className="font-mono text-foreground font-medium">{customer.phone || 'غير محدد'}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                                                <span className="text-foreground font-medium truncate">{customer.address || 'غير محدد'}</span>
                                            </div>
                                        </div>

                                        <div className="pt-2 border-t border-dashed border-border flex justify-end">
                                            <Link href={`/customers/${customer.id}`}>
                                                <Button size="sm" className="gap-1 text-xs font-bold w-full sm:w-auto">
                                                    <span>استعراض ملف الجداول الحسابية</span>
                                                    <ChevronLeft className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-muted-foreground text-xs">
                                    لا يوجد زبائن مسجلين حالياً. اضغط "إضافة زبون جديد" للبدء.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

            </div>

            {/* Modal: Add Customer (Enhanced Shadcn Dialog) */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent dir="rtl" className="sm:max-w-md text-right p-6 rounded-xl border border-border shadow-lg">
                    <DialogHeader className="space-y-1 pb-2 border-b border-border">
                        <Badge variant="outline" className="w-fit text-[11px]">بيانات الزبون الجديد</Badge>
                        <DialogTitle className="text-lg font-bold text-primary">تسجيل زبون جديد في النظام</DialogTitle>
                    </DialogHeader>
                    
                    <form onSubmit={handleAddCustomer} className="space-y-4 pt-3 text-xs">
                        <div className="space-y-1.5">
                            <Label htmlFor="name" className="text-muted-foreground">اسم الزبون الكامل أو الشركة *</Label>
                            <Input
                                id="name"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="مثال: شركة الهادي التجارية / علي حسين"
                                className="bg-background"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="phone" className="text-muted-foreground">رقم الهاتف</Label>
                                <Input
                                    id="phone"
                                    dir="ltr"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="0770XXXXXXX"
                                    className="font-mono bg-background text-right"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="address" className="text-muted-foreground">العنوان</Label>
                                <Input
                                    id="address"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    placeholder="بغداد - الكرادة"
                                    className="bg-background"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="notes" className="text-muted-foreground">ملاحظات وقود الحساب</Label>
                            <Input
                                id="notes"
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                placeholder="أي معلومات أو تفاصيل اختيارية..."
                                className="bg-background"
                            />
                        </div>

                        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-start pt-2 border-t border-border mt-4">
                            <Button type="submit" className="w-full sm:w-auto font-bold gap-1 justify-center">
                                <UserPlus className="h-4 w-4" />
                                حفظ وشروع الإدخال
                            </Button>
                            <Button type="button" variant="outline" className="w-full sm:w-auto justify-center" onClick={() => setIsAddOpen(false)}>
                                إلغاء
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}

