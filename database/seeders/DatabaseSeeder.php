<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Customer;
use App\Models\CustomerLedger;
use App\Models\LedgerItem;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Admin & Employee Users
        $admin = User::firstOrCreate(
            ['email' => 'admin@clinic.com'],
            [
                'name' => 'المدير العام (المصطفى)',
                'username' => 'admin',
                'password' => Hash::make('12345678'),
                'role' => 'admin',
            ]
        );

        $employee = User::firstOrCreate(
            ['email' => 'employee@clinic.com'],
            [
                'name' => 'الموظف أحمد',
                'username' => 'employee',
                'password' => Hash::make('12345678'),
                'role' => 'employee',
            ]
        );

        // 2. Demo Customers
        $customer1 = Customer::create([
            'name' => 'شركة الهادي التجارية',
            'phone' => '07701234567',
            'address' => 'بغداد - الكرادة',
            'notes' => 'زبون رئيسي للمستوردات والمشتريات',
        ]);

        $customer2 = Customer::create([
            'name' => 'علي حسين الزبيدي',
            'phone' => '07809876543',
            'address' => 'النجف الأشرف',
            'notes' => 'حساب مشتريات وشحنات الصين',
        ]);

        // 3. Demo Ledger for Customer 1 (مطابق لبيانات ومعادلات الإكسل)
        $ledger1 = CustomerLedger::create([
            'customer_id' => $customer1->id,
            'user_id' => $admin->id,
            'title' => 'جدول مشتريات الصين والتحويلات (أيلول 2026)',
            'notes' => 'جدول الحسابات المالي المستورد والمحتسب تلقائياً',
        ]);

        // Add 5 Sample Ledger Rows
        LedgerItem::create([
            'customer_ledger_id' => $ledger1->id,
            'details' => 'شحنة بضائع إلكترونيات من كوانزو',
            'purchase_amount' => 1250.00,
            'store_payment_details' => 'دفعة أولى للمورد المحلي',
            'store_payment' => 500.00,
            'rmb_exchange_rate' => 7.2500,
            'usd_amount' => 1000.00,
            'transfer_date' => '2026-09-01',
        ]);

        LedgerItem::create([
            'customer_ledger_id' => $ledger1->id,
            'details' => 'أجهزة ومعدات ملحقة',
            'purchase_amount' => 850.00,
            'store_payment_details' => 'تسديد حساب المصنع',
            'store_payment' => 400.00,
            'rmb_exchange_rate' => 7.2400,
            'usd_amount' => 1500.00,
            'transfer_date' => '2026-09-03',
        ]);

        LedgerItem::create([
            'customer_ledger_id' => $ledger1->id,
            'details' => 'رسوم الشحن الجوي السريع',
            'purchase_amount' => 300.00,
            'store_payment_details' => 'دفعة مكتب الشحن',
            'store_payment' => 200.00,
            'rmb_exchange_rate' => 7.2500,
            'usd_amount' => 800.00,
            'transfer_date' => '2026-09-04',
        ]);

        // Demo Ledger for Customer 2
        $ledger2 = CustomerLedger::create([
            'customer_id' => $customer2->id,
            'user_id' => $employee->id,
            'title' => 'جدول حساب الوجبة الثانية',
            'notes' => 'حساب شحنات مستلزمات عامة',
        ]);

        LedgerItem::create([
            'customer_ledger_id' => $ledger2->id,
            'details' => 'دفعة أولى شحنة النجف',
            'purchase_amount' => 450.00,
            'store_payment_details' => 'تسديد كاش',
            'store_payment' => 250.00,
            'rmb_exchange_rate' => 7.2300,
            'usd_amount' => 600.00,
            'transfer_date' => '2026-09-05',
        ]);
    }
}
