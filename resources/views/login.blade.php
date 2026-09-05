<!DOCTYPE html>
<html lang="ar" dir="rtl" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تسجيل الدخول - النظام المالي للعيادات</title>
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="min-h-screen bg-background text-foreground flex items-center justify-center p-4 relative antialiased transition-colors duration-200">

    <!-- Top Left Theme & View Switcher Bar -->
    <div class="fixed top-4 left-4 z-50 flex items-center gap-2">
        <button type="button" onclick="toggleTheme()" class="inline-flex items-center justify-center rounded-md border border-border bg-secondary text-secondary-foreground hover:bg-secondary/80 h-9 px-3 text-xs font-medium transition">
            🌓 تبديل المظهر (Dark / Light)
        </button>
        <a href="/dashboard" class="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3 text-xs font-medium transition">
            شاشة النظام الرئيسية (Dashboard)
        </a>
    </div>

    <!-- Login Container -->
    <div class="w-full max-w-md space-y-6">
        
        <!-- Header -->
        <div class="space-y-2 text-center">
            <div class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-primary-foreground mb-2 shadow-sm">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
            </div>
            <h1 class="text-2xl font-bold tracking-tight text-foreground">النظام المالي للعيادات الطبية</h1>
            <p class="text-xs text-muted-foreground">قم بتسجيل الدخول للوصول إلى الصناديق وحسابات الأطباء</p>
        </div>

        <!-- shadcn UI Card -->
        <div class="rounded-xl border border-border bg-card text-card-foreground shadow-sm p-6 space-y-6">
            
            <!-- Role Selection Segmented Switch -->
            <div class="space-y-1.5">
                <span class="text-xs font-medium text-muted-foreground">اختر الحساب للتجربة السريعة:</span>
                <div class="grid grid-cols-4 gap-1 p-1 bg-muted rounded-lg text-xs">
                    <button type="button" onclick="selectRole('admin', this)" class="role-btn active rounded-md py-1.5 font-semibold bg-card text-card-foreground shadow-sm border border-border transition">أدمن</button>
                    <button type="button" onclick="selectRole('reception', this)" class="role-btn rounded-md py-1.5 font-medium text-muted-foreground hover:text-foreground transition">استقبال</button>
                    <button type="button" onclick="selectRole('doctor', this)" class="role-btn rounded-md py-1.5 font-medium text-muted-foreground hover:text-foreground transition">طبيب</button>
                    <button type="button" onclick="selectRole('pharmacy', this)" class="role-btn rounded-md py-1.5 font-medium text-muted-foreground hover:text-foreground transition">صيدلية</button>
                </div>
            </div>

            <form action="/dashboard" method="GET" class="space-y-4">
                
                <!-- Field: Email -->
                <div class="space-y-2">
                    <label for="email" class="text-sm font-medium text-foreground leading-none">اسم المستخدم أو البريد</label>
                    <input type="text" id="email" value="admin@clinic.com" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition" placeholder="admin@clinic.com">
                </div>

                <!-- Field: Password -->
                <div class="space-y-2">
                    <div class="flex items-center justify-between">
                        <label for="password" class="text-sm font-medium text-foreground leading-none">كلمة المرور</label>
                        <a href="#" class="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4">نسيت كلمة المرور؟</a>
                    </div>
                    <input type="password" id="password" value="••••••••" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition" placeholder="••••••••">
                </div>

                <!-- Field: Remember Me -->
                <div class="flex items-center justify-between text-xs pt-1">
                    <label class="flex items-center gap-2 font-medium text-muted-foreground cursor-pointer">
                        <input type="checkbox" checked class="h-4 w-4 rounded border-input bg-background text-primary focus:ring-ring">
                        <span>تذكر بيانات الدخول</span>
                    </label>
                    <span id="roleBadge" class="inline-flex items-center rounded-md border border-border px-2 py-0.5 font-semibold bg-secondary text-secondary-foreground">صلاحيات الأدمن كاملة</span>
                </div>

                <!-- Submit Button -->
                <button type="submit" class="inline-flex items-center justify-center w-full h-10 rounded-md bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 shadow transition">
                    تسجيل الدخول
                </button>
            </form>

            <div class="pt-4 border-t border-border text-center">
                <p class="text-xs text-muted-foreground">shadcn/ui v4 theme • Base Nova • RTL Enabled</p>
            </div>
        </div>

    </div>

    <script>
        function toggleTheme() {
            document.documentElement.classList.toggle('dark');
        }

        function selectRole(role, btnElement) {
            document.querySelectorAll('.role-btn').forEach(btn => {
                btn.className = 'role-btn rounded-md py-1.5 font-medium text-muted-foreground hover:text-foreground transition';
            });
            btnElement.className = 'role-btn active rounded-md py-1.5 font-semibold bg-card text-card-foreground shadow-sm border border-border transition';

            const badge = document.getElementById('roleBadge');
            const email = document.getElementById('email');

            if(role === 'admin') {
                badge.innerText = 'صلاحيات الأدمن كاملة';
                email.value = 'admin@clinic.com';
            } else if(role === 'reception') {
                badge.innerText = 'صندوق الاستقبال';
                email.value = 'reception@clinic.com';
            } else if(role === 'doctor') {
                badge.innerText = 'حساب الطبيب';
                email.value = 'dr.ahmed@clinic.com';
            } else if(role === 'pharmacy') {
                badge.innerText = 'صندوق الصيدلية';
                email.value = 'pharmacy@clinic.com';
            }
        }
    </script>
</body>
</html>
