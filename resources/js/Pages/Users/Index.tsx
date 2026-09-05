import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Shield, UserPlus, Key, UserCheck, Trash2, Edit2, Mail, User } from 'lucide-react';

interface UserItem {
    id: number;
    name: string;
    username: string;
    email: string;
    role: 'admin' | 'employee';
    created_at: string;
}

interface IndexProps {
    users: UserItem[];
}

const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return '-';
    const match = dateStr.match(/(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
    if (match) {
        return `${match[1]}/${match[2].padStart(2, '0')}/${match[3].padStart(2, '0')}`;
    }
    return dateStr;
};

export default function Index({ users = [] }: IndexProps) {
    const { auth, flash } = usePage<any>().props;
    const currentUserId = auth?.user?.id;

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserItem | null>(null);

    const [userForm, setUserForm] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        role: 'employee' as 'admin' | 'employee',
    });

    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/users', userForm, {
            onSuccess: () => {
                setIsAddModalOpen(false);
                resetForm();
            },
        });
    };

    const handleUpdateUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;
        router.put(`/users/${editingUser.id}`, userForm, {
            onSuccess: () => {
                setEditingUser(null);
                resetForm();
            },
        });
    };

    const handleDeleteUser = (user: UserItem) => {
        if (confirm(`هل أنت تأكد من رغبتك بحذف المستخدم (${user.name})؟`)) {
            router.delete(`/users/${user.id}`);
        }
    };

    const startEditUser = (user: UserItem) => {
        setEditingUser(user);
        setUserForm({
            name: user.name,
            username: user.username,
            email: user.email,
            password: '',
            role: user.role,
        });
    };

    const resetForm = () => {
        setUserForm({
            name: '',
            username: '',
            email: '',
            password: '',
            role: 'employee',
        });
    };

    return (
        <AuthenticatedLayout header="إدارة المستخدمين والحسابات">
            <Head title="إدارة المستخدمين" />

            <div className="space-y-6 text-right">

                {/* Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-xl border border-border bg-card text-card-foreground shadow-sm">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Badge variant="outline">إدارة الحسابات</Badge>
                            <span className="text-xs text-muted-foreground">إجمالي المستخدمين: {users.length}</span>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-primary">المستخدمين وصلاحيات النظام</h1>
                        <p className="text-xs text-muted-foreground">
                            إضافة وإدارة حسابات مدراء النظام والموظفين وتحديد صلاحياتهم.
                        </p>
                    </div>
                    <Button onClick={() => { resetForm(); setIsAddModalOpen(true); }} className="w-full sm:w-auto gap-2 font-bold text-xs justify-center">
                        <UserPlus className="h-4 w-4" />
                        إضافة مستخدم جديد
                    </Button>
                </div>

                {/* Users View: Desktop Table + Mobile Cards */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center justify-between">
                            <span>قائمة مستخدمي النظام المسجلين</span>
                            <Shield className="h-5 w-5 text-primary" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {/* Desktop Table View */}
                        <div className="hidden md:block overflow-x-auto">
                            <Table dir="rtl">
                                <TableHeader>
                                    <TableRow className="bg-muted/60 text-xs">
                                        <TableHead className="text-right">الاسم الكامل</TableHead>
                                        <TableHead className="text-right">اسم المستخدم (Username)</TableHead>
                                        <TableHead className="text-right">البريد الإلكتروني</TableHead>
                                        <TableHead className="text-right">نوع الحساب / الصلاحية</TableHead>
                                        <TableHead className="text-right">تاريخ الإضافة</TableHead>
                                        <TableHead className="text-left w-24">إجراءات</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="text-xs">
                                    {users.length > 0 ? (
                                        users.map((u) => (
                                            <TableRow key={u.id} className="hover:bg-muted/30 transition">
                                                <TableCell className="font-semibold text-foreground">
                                                    <div className="flex items-center gap-2">
                                                        <User className="h-4 w-4 text-primary" />
                                                        <span>{u.name}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell dir="ltr" className="text-right font-mono text-foreground font-medium">
                                                    @{u.username}
                                                </TableCell>
                                                <TableCell dir="ltr" className="text-right text-muted-foreground font-mono">
                                                    {u.email}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={u.role === 'admin' ? 'default' : 'secondary'} className="gap-1">
                                                        <Shield className="h-3 w-3" />
                                                        {u.role === 'admin' ? 'مدير نظام (Admin)' : 'موظف (Employee)'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="font-mono text-muted-foreground" dir="ltr">
                                                    {formatDate(u.created_at)}
                                                </TableCell>
                                                <TableCell className="text-left space-x-1">
                                                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => startEditUser(u)}>
                                                        <Edit2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                    {currentUserId !== u.id && (
                                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDeleteUser(u)}>
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                                لا يوجد مستخدمين مسجلين حالياً.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Mobile Cards View */}
                        <div className="block md:hidden p-4 space-y-3">
                            {users.length > 0 ? (
                                users.map((u) => (
                                    <div key={u.id} className="p-4 rounded-lg border border-border bg-card shadow-sm space-y-3 text-right">
                                        <div className="flex items-center justify-between border-b border-border pb-2">
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4 text-primary" />
                                                <span className="font-bold text-foreground text-sm">{u.name}</span>
                                            </div>
                                            <Badge variant={u.role === 'admin' ? 'default' : 'secondary'}>
                                                {u.role === 'admin' ? 'مدير نظام' : 'موظف'}
                                            </Badge>
                                        </div>

                                        <div className="space-y-1 text-xs text-muted-foreground">
                                            <div className="flex items-center justify-between">
                                                <span>اسم المستخدم:</span>
                                                <span dir="ltr" className="font-mono text-foreground font-semibold">@{u.username}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span>البريد الإلكتروني:</span>
                                                <span dir="ltr" className="font-mono text-foreground">{u.email}</span>
                                            </div>
                                        </div>

                                        <div className="pt-2 border-t border-dashed border-border flex items-center justify-end gap-2">
                                            <Button variant="outline" size="sm" className="h-8 text-xs gap-1" onClick={() => startEditUser(u)}>
                                                <Edit2 className="h-3.5 w-3.5" /> تعديل
                                            </Button>
                                            {currentUserId !== u.id && (
                                                <Button variant="destructive" size="sm" className="h-8 text-xs gap-1" onClick={() => handleDeleteUser(u)}>
                                                    <Trash2 className="h-3.5 w-3.5" /> حذف
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-muted-foreground text-xs">
                                    لا يوجد مستخدمين مسجلين حالياً.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

            </div>

            {/* Modal: Add or Edit User */}
            <Dialog open={isAddModalOpen || editingUser !== null} onOpenChange={(open) => { if (!open) { setIsAddModalOpen(false); setEditingUser(null); } }}>
                <DialogContent dir="rtl" className="sm:max-w-md text-right p-6 rounded-xl border border-border shadow-lg">
                    <DialogHeader className="space-y-1 pb-2 border-b border-border">
                        <Badge variant="outline" className="w-fit text-[11px]">
                            {editingUser ? 'تعديل المستخدم' : 'مستخدم جديد'}
                        </Badge>
                        <DialogTitle className="text-lg font-bold text-primary">
                            {editingUser ? `تعديل حساب (${editingUser.name})` : 'إضافة حساب جديد للنظام'}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={editingUser ? handleUpdateUser : handleAddUser} className="space-y-4 pt-3 text-xs">
                        <div className="space-y-1.5">
                            <Label htmlFor="name" className="text-muted-foreground">الاسم الكامل *</Label>
                            <Input
                                id="name"
                                required
                                value={userForm.name}
                                onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                                placeholder="مثال: المصطفى أحمد"
                                className="bg-background"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="username" className="text-muted-foreground">اسم المستخدم *</Label>
                                <Input
                                    id="username"
                                    required
                                    dir="ltr"
                                    value={userForm.username}
                                    onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                                    placeholder="admin / employee"
                                    className="font-mono bg-background text-right"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="role" className="text-muted-foreground">نوع الصلاحية *</Label>
                                <select
                                    id="role"
                                    value={userForm.role}
                                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value as any })}
                                    className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus:outline-none focus:ring-1 focus:ring-ring"
                                >
                                    <option value="employee">موظف (Employee)</option>
                                    <option value="admin">مدير نظام (Admin)</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-muted-foreground">البريد الإلكتروني *</Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                dir="ltr"
                                value={userForm.email}
                                onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                                placeholder="user@clinic.com"
                                className="font-mono bg-background text-right"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="password" className="text-muted-foreground">
                                {editingUser ? 'كلمة المرور (اتركها فارغة إذا لم ترد التغيير)' : 'كلمة المرور *'}
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                required={!editingUser}
                                dir="ltr"
                                value={userForm.password}
                                onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                                placeholder="••••••••"
                                className="font-mono bg-background"
                            />
                        </div>

                        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-start pt-2 border-t border-border mt-4">
                            <Button type="submit" className="w-full sm:w-auto font-bold gap-1 justify-center">
                                <UserPlus className="h-4 w-4" />
                                {editingUser ? 'حفظ التعديلات' : 'إنشاء الحساب'}
                            </Button>
                            <Button type="button" variant="outline" className="w-full sm:w-auto justify-center" onClick={() => { setIsAddModalOpen(false); setEditingUser(null); }}>
                                إلغاء
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}
