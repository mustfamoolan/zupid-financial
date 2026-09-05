import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { History, Calendar, Search, User, Filter, RotateCcw } from 'lucide-react';

interface LogUser {
    id: number;
    name: string;
    username: string;
}

interface ActivityLogItem {
    id: number;
    user_id: number | null;
    action: string;
    description: string;
    ip_address: string | null;
    created_at: string;
    user: LogUser | null;
}

interface IndexProps {
    logs: {
        data: ActivityLogItem[];
        current_page: number;
        last_page: number;
    };
    users: LogUser[];
    filters: {
        user_id?: string;
        action?: string;
        date_from?: string;
        date_to?: string;
    };
}

const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return '-';
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${year}/${month}/${day} - ${hours}:${minutes}`;
    } catch {
        return dateStr;
    }
};

export default function Index({ logs, users = [], filters = {} }: IndexProps) {
    const logList = logs?.data || [];

    const [filterForm, setFilterForm] = useState({
        user_id: filters?.user_id || '',
        action: filters?.action || '',
        date_from: filters?.date_from || '',
        date_to: filters?.date_to || '',
    });

    const handleFilterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/activity-logs', filterForm, { preserveState: true });
    };

    const handleResetFilters = () => {
        setFilterForm({ user_id: '', action: '', date_from: '', date_to: '' });
        router.get('/activity-logs', {}, { preserveState: true });
    };

    return (
        <AuthenticatedLayout header="سجل النشاطات والعمليات">
            <Head title="سجل النشاطات" />

            <div className="space-y-6 text-right">

                {/* Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-xl border border-border bg-card text-card-foreground shadow-sm">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Badge variant="outline">الأمان والمراجعة</Badge>
                            <span className="text-xs text-muted-foreground">تتبع الإجراءات الزمانية</span>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-primary">سجل نشاطات النظام والعمليات (Activity Logs)</h1>
                        <p className="text-xs text-muted-foreground">
                            تسجيل زمني دقيق لكل عملية تمت في النظام (من قام بالعملية، ماهيتها، ومتى حدثت).
                        </p>
                    </div>
                </div>

                {/* Date & Action Filter Bar */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-semibold flex items-center gap-1.5 text-muted-foreground">
                            <Filter className="h-4 w-4 text-primary" />
                            <span>تصفية وتحديد نطاق النشاطات</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <form onSubmit={handleFilterSubmit} className="space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                                
                                {/* Date From */}
                                <div className="space-y-1">
                                    <Label htmlFor="date_from" className="text-muted-foreground">من تاريخ:</Label>
                                    <Input
                                        id="date_from"
                                        type="date"
                                        dir="ltr"
                                        value={filterForm.date_from}
                                        onChange={(e) => setFilterForm({ ...filterForm, date_from: e.target.value })}
                                        className="bg-background text-right font-mono"
                                    />
                                </div>

                                {/* Date To */}
                                <div className="space-y-1">
                                    <Label htmlFor="date_to" className="text-muted-foreground">إلى تاريخ:</Label>
                                    <Input
                                        id="date_to"
                                        type="date"
                                        dir="ltr"
                                        value={filterForm.date_to}
                                        onChange={(e) => setFilterForm({ ...filterForm, date_to: e.target.value })}
                                        className="bg-background text-right font-mono"
                                    />
                                </div>

                                {/* User Filter */}
                                <div className="space-y-1">
                                    <Label htmlFor="user_id" className="text-muted-foreground">المستخدم:</Label>
                                    <select
                                        id="user_id"
                                        value={filterForm.user_id}
                                        onChange={(e) => setFilterForm({ ...filterForm, user_id: e.target.value })}
                                        className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus:outline-none focus:ring-1 focus:ring-ring"
                                    >
                                        <option value="">جميع المستخدمين</option>
                                        {users.map((u) => (
                                            <option key={u.id} value={u.id}>{u.name} (@{u.username})</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Action Filter */}
                                <div className="space-y-1">
                                    <Label htmlFor="action" className="text-muted-foreground">نوع الإجراء:</Label>
                                    <Input
                                        id="action"
                                        type="text"
                                        placeholder="بحث بالإجراء (مثال: إضافة، حذف)..."
                                        value={filterForm.action}
                                        onChange={(e) => setFilterForm({ ...filterForm, action: e.target.value })}
                                        className="bg-background text-xs"
                                    />
                                </div>

                            </div>

                            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-1 border-t border-border">
                                <Button type="submit" size="sm" className="w-full sm:w-auto text-xs font-bold gap-1">
                                    <Search className="h-3.5 w-3.5" />
                                    تطبيق الفلتر
                                </Button>
                                <Button type="button" variant="outline" size="sm" onClick={handleResetFilters} className="w-full sm:w-auto text-xs gap-1">
                                    <RotateCcw className="h-3.5 w-3.5" />
                                    إعادة ضبط
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Logs View: Desktop Table + Mobile Cards */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center justify-between">
                            <span>السجل الزمني للأحداث</span>
                            <History className="h-5 w-5 text-primary" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        
                        {/* Desktop Table View */}
                        <div className="hidden md:block overflow-x-auto">
                            <Table dir="rtl">
                                <TableHeader>
                                    <TableRow className="bg-muted/60 text-xs">
                                        <TableHead className="w-12 text-center">#</TableHead>
                                        <TableHead className="text-right">المستخدم القائم بالعملية</TableHead>
                                        <TableHead className="text-right">نوع الإجراء</TableHead>
                                        <TableHead className="text-right">الوصف التفصيلي للعملية</TableHead>
                                        <TableHead className="text-right">تاريخ ووقت التنفيذ</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="text-xs">
                                    {logList.length > 0 ? (
                                        logList.map((log, idx) => (
                                            <TableRow key={log.id} className="hover:bg-muted/30 transition">
                                                <TableCell className="text-center font-mono text-muted-foreground">{idx + 1}</TableCell>
                                                <TableCell className="font-semibold text-foreground">
                                                    <div className="flex items-center gap-1.5">
                                                        <User className="h-3.5 w-3.5 text-primary" />
                                                        <span>{log.user?.name || 'النظام'}</span>
                                                        <span className="text-[10px] text-muted-foreground font-mono">(@{log.user?.username || 'system'})</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="font-semibold bg-background">
                                                        {log.action}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-foreground leading-relaxed">
                                                    {log.description}
                                                </TableCell>
                                                <TableCell className="font-mono text-muted-foreground" dir="ltr">
                                                    {formatDate(log.created_at)}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                                لا يوجد نشاطات مسجلة ضمن الفلتر المحدد.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Mobile Cards View */}
                        <div className="block md:hidden p-4 space-y-3">
                            {logList.length > 0 ? (
                                logList.map((log, idx) => (
                                    <div key={log.id} className="p-4 rounded-lg border border-border bg-card shadow-sm space-y-2 text-right text-xs">
                                        <div className="flex items-center justify-between border-b border-border pb-2">
                                            <div className="flex items-center gap-1.5">
                                                <User className="h-3.5 w-3.5 text-primary" />
                                                <span className="font-bold text-foreground">{log.user?.name || 'النظام'}</span>
                                            </div>
                                            <Badge variant="outline">{log.action}</Badge>
                                        </div>
                                        <p className="text-foreground font-medium pt-1">{log.description}</p>
                                        <div className="flex items-center justify-between pt-2 border-t border-dashed border-border text-[11px] text-muted-foreground font-mono">
                                            <span dir="ltr">
                                                <Calendar className="h-3 w-3 inline ml-1" />
                                                {formatDate(log.created_at)}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-muted-foreground text-xs">
                                    لا يوجد نشاطات مسجلة ضمن الفلتر المحدد.
                                </div>
                            )}
                        </div>

                    </CardContent>
                </Card>

            </div>
        </AuthenticatedLayout>
    );
}
