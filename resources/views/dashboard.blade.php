<!DOCTYPE html>
<html lang="ar" dir="rtl" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>الرئيسية - النظام المالي للعيادات</title>
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="min-h-screen bg-background text-foreground flex flex-col md:flex-row antialiased transition-colors duration-200">

    <!-- Mobile Header -->
    <div class="md:hidden flex items-center justify-between p-4 bg-sidebar border-b border-sidebar-border">
        <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                🏥
            </div>
            <h1 class="font-bold text-sm text-sidebar-foreground">المركز الطبي المالي</h1>
        </div>
        <a href="/login" class="text-xs px-3 py-1.5 rounded-md border border-border bg-secondary text-secondary-foreground">تسجيل الدخول</a>
    </div>

    <!-- Sidebar (القائمة الجانبية بتنسيق shadcn/ui) -->
    <aside class="w-full md:w-64 bg-sidebar text-sidebar-foreground border-l border-sidebar-border flex-shrink-0 flex flex-col justify-between min-h-screen">
        <div class="p-4 space-y-6">
            
            <!-- Sidebar Header -->
            <div class="flex items-center gap-3 px-2 py-2">
                <div class="w-9 h-9 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground flex items-center justify-center font-bold">
                    🏥
                </div>
                <div>
                    <h2 class="font-bold text-sm leading-tight text-sidebar-foreground">المركز الطبي المالي</h2>
                    <p class="text-xs text-muted-foreground">لوحة التحكم والمالية</p>
                </div>
            </div>

            <!-- Active User Info Pill -->
            <div class="p-3 rounded-lg border border-sidebar-border bg-sidebar-accent/50 text-sidebar-foreground space-y-1">
                <div class="flex items-center justify-between">
                    <span class="text-xs font-bold">الأدمن (المصطفى)</span>
                    <span class="inline-flex items-center rounded-md border border-border px-1.5 py-0.5 text-[10px] font-semibold bg-secondary text-secondary-foreground">أدمن</span>
                </div>
                <p class="text-[11px] text-muted-foreground">صلاحيات إدارة شاملة</p>
            </div>

            <!-- Navigation Links -->
            <nav class="space-y-1 text-sm font-medium">
                <a href="/dashboard" class="flex items-center justify-between px-3 py-2 rounded-lg bg-sidebar-accent text-sidebar-accent-foreground font-semibold transition">
                    <div class="flex items-center gap-2.5">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                        </svg>
                        <span>الرئيسية والملخص</span>
                    </div>
                    <span class="inline-flex items-center rounded-md bg-primary text-primary-foreground px-1.5 py-0.5 text-[10px]">مباشر</span>
                </a>

                <a href="#" class="flex items-center justify-between px-3 py-2 rounded-lg text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition">
                    <div class="flex items-center gap-2.5">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
                        </svg>
                        <span>صندوق الاستقبال</span>
                    </div>
                    <span class="text-[10px] text-muted-foreground">الكاش</span>
                </a>

                <a href="#" class="flex items-center justify-between px-3 py-2 rounded-lg text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition">
                    <div class="flex items-center gap-2.5">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                        </svg>
                        <span>حسابات الأطباء</span>
                    </div>
                    <span class="text-[10px] text-muted-foreground">5 أطباء</span>
                </a>

                <a href="#" class="flex items-center justify-between px-3 py-2 rounded-lg text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition">
                    <div class="flex items-center gap-2.5">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
                        </svg>
                        <span>صندوق الصيدلية</span>
                    </div>
                    <span class="text-[10px] text-muted-foreground">مستقل</span>
                </a>

                <a href="#" class="flex items-center justify-between px-3 py-2 rounded-lg text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition">
                    <div class="flex items-center gap-2.5">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
                        </svg>
                        <span>صندوق المختبر</span>
                    </div>
                    <span class="text-[10px] text-muted-foreground">مستقل</span>
                </a>
            </nav>
        </div>

        <div class="p-4 border-t border-sidebar-border">
            <a href="/login" class="flex items-center justify-center gap-2 w-full h-9 rounded-md border border-sidebar-border bg-sidebar-accent/50 hover:bg-sidebar-accent text-xs font-semibold text-sidebar-foreground transition">
                <span>تسجيل الخروج ومعاينة الدخول</span>
            </a>
        </div>
    </aside>

    <!-- Main Content Area -->
    <main class="flex-1 min-w-0 flex flex-col">
        
        <!-- Top Navbar -->
        <header class="h-14 border-b border-border bg-background px-6 flex items-center justify-between gap-4 sticky top-0 z-10">
            <div class="flex-1 max-w-sm">
                <input type="text" class="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" placeholder="بحث عن مريض، طبيب، أو وصل... (Ctrl+K)">
            </div>
            
            <div class="flex items-center gap-2">
                <button type="button" onclick="toggleTheme()" class="inline-flex items-center justify-center rounded-md border border-border bg-secondary text-secondary-foreground hover:bg-secondary/80 h-9 px-3 text-xs font-medium transition">
                    🌓 المظهر
                </button>
                <a href="/login" class="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3 text-xs font-medium transition">
                    صفحة الدخول
                </a>
            </div>
        </header>

        <!-- Main Body -->
        <div class="p-6 space-y-6 flex-1">
            
            <!-- Page Header -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 class="text-2xl font-bold tracking-tight text-foreground">ملخص الحركة المالية للعيادات</h1>
                    <p class="text-xs text-muted-foreground">تتبع مباشر لصندوق الاستقبال وحسابات الأطباء وصناديق القطاعات المستقلة.</p>
                </div>
                <div class="flex items-center gap-2">
                    <button class="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3 text-xs font-semibold shadow transition">
                        + سند قبض جديد
                    </button>
                </div>
            </div>

            <!-- 4 KPI Stat Cards using shadcn UI card styles -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <!-- Card 1 -->
                <div class="rounded-xl border border-border bg-card text-card-foreground p-4 space-y-2 shadow-sm">
                    <div class="flex items-center justify-between text-xs text-muted-foreground font-medium">
                        <span>إجمالي مقبوضات اليوم</span>
                        <span class="text-lg">💰</span>
                    </div>
                    <div class="text-2xl font-extrabold text-foreground">1,850,000 <span class="text-xs font-normal text-muted-foreground">د.ع</span></div>
                    <div class="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">+12% مقارنة بالأمس</div>
                </div>

                <!-- Card 2 -->
                <div class="rounded-xl border border-border bg-card text-card-foreground p-4 space-y-2 shadow-sm">
                    <div class="flex items-center justify-between text-xs text-muted-foreground font-medium">
                        <span>مستحقات الأطباء</span>
                        <span class="text-lg">👨‍⚕️</span>
                    </div>
                    <div class="text-2xl font-extrabold text-foreground">1,295,000 <span class="text-xs font-normal text-muted-foreground">د.ع</span></div>
                    <div class="text-[11px] text-muted-foreground">موزعة على 5 أطباء</div>
                </div>

                <!-- Card 3 -->
                <div class="rounded-xl border border-border bg-card text-card-foreground p-4 space-y-2 shadow-sm">
                    <div class="flex items-center justify-between text-xs text-muted-foreground font-medium">
                        <span>صندوق الصيدلية المستقل</span>
                        <span class="text-lg">💊</span>
                    </div>
                    <div class="text-2xl font-extrabold text-foreground">420,000 <span class="text-xs font-normal text-muted-foreground">د.ع</span></div>
                    <div class="text-[11px] text-muted-foreground">كاشير خاص بالصيدلية</div>
                </div>

                <!-- Card 4 -->
                <div class="rounded-xl border border-border bg-card text-card-foreground p-4 space-y-2 shadow-sm">
                    <div class="flex items-center justify-between text-xs text-muted-foreground font-medium">
                        <span>صندوق المختبر المستقل</span>
                        <span class="text-lg">🧪</span>
                    </div>
                    <div class="text-2xl font-extrabold text-foreground">310,000 <span class="text-xs font-normal text-muted-foreground">د.ع</span></div>
                    <div class="text-[11px] text-muted-foreground">كاشير خاص بالتحاليل</div>
                </div>

            </div>

            <!-- Doctor Breakdown Table using shadcn UI table design -->
            <div class="rounded-xl border border-border bg-card text-card-foreground shadow-sm">
                <div class="p-4 border-b border-border flex items-center justify-between">
                    <div>
                        <h2 class="font-bold text-sm text-foreground">تفاصيل تحصيلات الأطباء اليومية (صندوق الاستقبال)</h2>
                        <p class="text-xs text-muted-foreground">كل طبيب يرى قائمة مرضاه فقط، بينما الأدمن يرى كافة التوزيعات المادية.</p>
                    </div>
                    <span class="inline-flex items-center rounded-md border border-border px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground">5 أطباء مسجلين</span>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-right text-xs">
                        <thead class="bg-muted/50 text-muted-foreground font-semibold border-b border-border">
                            <tr>
                                <th class="p-3">الطبيب والعيادة</th>
                                <th class="p-3">عدد المرضى</th>
                                <th class="p-3">سعر الكشفية</th>
                                <th class="p-3">الإجمالي المحصل</th>
                                <th class="p-3">نسبة الطبيب</th>
                                <th class="p-3">الصافي المستحق</th>
                                <th class="p-3">حالة التسوية</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-border">
                            <tr class="hover:bg-muted/30 transition">
                                <td class="p-3 font-semibold text-foreground">د. أحمد علي (الباطنية)</td>
                                <td class="p-3 text-muted-foreground">18 مريضاً</td>
                                <td class="p-3">25,000 د.ع</td>
                                <td class="p-3 font-bold text-foreground">450,000 د.ع</td>
                                <td class="p-3 text-muted-foreground">70%</td>
                                <td class="p-3 font-bold text-foreground">315,000 د.ع</td>
                                <td class="p-3"><span class="inline-flex items-center rounded-md border border-border px-2 py-0.5 text-[10px] font-semibold bg-secondary text-secondary-foreground">قيد التصفية</span></td>
                            </tr>
                            <tr class="hover:bg-muted/30 transition">
                                <td class="p-3 font-semibold text-foreground">د. سارة المحمداوي (الجلدية)</td>
                                <td class="p-3 text-muted-foreground">22 مريضاً</td>
                                <td class="p-3">30,000 د.ع</td>
                                <td class="p-3 font-bold text-foreground">660,000 د.ع</td>
                                <td class="p-3 text-muted-foreground">65%</td>
                                <td class="p-3 font-bold text-foreground">429,000 د.ع</td>
                                <td class="p-3"><span class="inline-flex items-center rounded-md border border-border px-2 py-0.5 text-[10px] font-semibold bg-primary text-primary-foreground">تم الصرف ✓</span></td>
                            </tr>
                            <tr class="hover:bg-muted/30 transition">
                                <td class="p-3 font-semibold text-foreground">د. خالد العبيدي (العظام)</td>
                                <td class="p-3 text-muted-foreground">14 مريضاً</td>
                                <td class="p-3">35,000 د.ع</td>
                                <td class="p-3 font-bold text-foreground">490,000 د.ع</td>
                                <td class="p-3 text-muted-foreground">70%</td>
                                <td class="p-3 font-bold text-foreground">343,000 د.ع</td>
                                <td class="p-3"><span class="inline-flex items-center rounded-md border border-border px-2 py-0.5 text-[10px] font-semibold bg-secondary text-secondary-foreground">قيد التصفية</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>

    </main>

    <script>
        function toggleTheme() {
            document.documentElement.classList.toggle('dark');
        }
    </script>
</body>
</html>
