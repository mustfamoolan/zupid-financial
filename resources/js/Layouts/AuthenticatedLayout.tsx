import { useState, useEffect, ReactNode } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    LayoutDashboard,
    Users,
    LogOut,
    Menu,
    X,
    Shield,
    User,
    Wallet,
    Stethoscope,
    Pill,
    TestTube,
    FileText,
    Settings,
} from 'lucide-react';

interface AuthenticatedProps {
    children: ReactNode;
    header?: ReactNode;
}

export default function AuthenticatedLayout({ children, header }: AuthenticatedProps) {
    const { auth } = usePage<any>().props;
    const url = usePage().url;
    const user = auth?.user || { name: 'المستخدم', username: 'user', role: 'admin' };
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        router.post('/logout');
    };

    const navItems = [
        {
            label: 'الرئيسية',
            href: '/dashboard',
            icon: LayoutDashboard,
            active: url.startsWith('/dashboard') || url === '/',
        },
        {
            label: 'الزبائن',
            href: '/customers',
            icon: Users,
            active: url.startsWith('/customers') || url.startsWith('/ledgers'),
        },
        {
            label: 'سجل النشاطات',
            href: '/activity-logs',
            icon: FileText,
            active: url.startsWith('/activity-logs'),
        },
        {
            label: 'المستخدمين',
            href: '/users',
            icon: Shield,
            active: url.startsWith('/users'),
        },
    ];

    const SidebarContent = () => (
        <>
            {/* Logo */}
            <div className="flex h-14 items-center border-b border-border px-6">
                <Link href="/customers" className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold">
                        🏥
                    </div>
                    <span className="font-semibold text-sm">المركز الطبي المالي</span>
                </Link>
            </div>

            {/* Navigation */}
            <div className="flex flex-1 flex-col gap-1 p-3 overflow-y-auto">
                <p className="px-3 pb-1 pt-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">
                    القائمة الرئيسية
                </p>
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                                item.active
                                    ? 'bg-secondary font-medium text-foreground'
                                    : 'text-muted-foreground hover:bg-secondary/70 hover:text-foreground'
                            }`}
                        >
                            <Icon className="h-4 w-4 shrink-0" />
                            {item.label}
                        </Link>
                    );
                })}
            </div>

            {/* User footer */}
            <div className="border-t border-border p-3">
                <div className="flex items-center gap-3 rounded-md px-3 py-2">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs bg-primary/20 text-primary font-bold">
                            {user.name ? user.name.charAt(0) : 'أ'}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0 text-right">
                        <p className="text-sm font-medium truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">@{user.username || 'admin'}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        title="تسجيل الخروج"
                        className="text-muted-foreground hover:text-destructive transition-colors p-1"
                    >
                        <LogOut className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </>
    );

    return (
        <div className="flex min-h-screen bg-background print:block print:bg-white print:p-0 print:m-0" dir="rtl">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:right-0 lg:w-60 border-l border-border bg-background z-20 print:hidden">
                <SidebarContent />
            </aside>

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 lg:hidden print:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <aside
                className={`fixed inset-y-0 right-0 z-40 w-64 flex flex-col border-l border-border bg-background transform transition-transform duration-200 ease-in-out lg:hidden print:hidden ${
                    sidebarOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div className="flex h-14 items-center justify-between border-b border-border px-4">
                    <span className="font-semibold text-sm">القائمة</span>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <SidebarContent />
            </aside>

            {/* Main content */}
            <div className="flex flex-1 flex-col min-w-0 lg:pr-60 print:pr-0 print:p-0 print:m-0 print:w-full">
                {/* Top header */}
                <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:px-6 print:hidden">
                    {/* Mobile menu button */}
                    <button
                        className="lg:hidden text-muted-foreground hover:text-foreground"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="h-5 w-5" />
                    </button>

                    {/* Breadcrumb */}
                    <div className="flex-1">
                        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground justify-start">
                            <span>النظام المالي</span>
                            {header && (
                                <>
                                    <span>/</span>
                                    <span className="font-medium text-foreground">{header}</span>
                                </>
                            )}
                        </nav>
                    </div>

                    {/* Header actions */}
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                            <div className="hidden sm:block text-right">
                                <p className="text-sm font-medium leading-none">{user.name}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    <span className="flex items-center gap-1 justify-end">
                                        <Shield className="h-3 w-3" /> {user.role === 'admin' ? 'مدير النظام' : 'موظف'}
                                    </span>
                                </p>
                            </div>
                            <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-xs bg-primary/20 text-primary font-bold">
                                    {user.name ? user.name.charAt(0) : 'أ'}
                                </AvatarFallback>
                            </Avatar>
                        </div>

                        <button
                            onClick={handleLogout}
                            title="تسجيل الخروج"
                            className="text-muted-foreground hover:text-destructive transition-colors p-1"
                        >
                            <LogOut className="h-4 w-4" />
                        </button>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-4 lg:p-6 pb-24 lg:pb-6 print:p-0 print:m-0 print:w-full">
                    {children}
                </main>
            </div>
        </div>
    );
}
