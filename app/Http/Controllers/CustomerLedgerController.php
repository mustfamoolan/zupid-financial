<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\CustomerLedger;
use App\Models\LedgerItem;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class CustomerLedgerController extends Controller
{
    public function store(Request $request, Customer $customer): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $ledger = $customer->ledgers()->create([
            'title' => $validated['title'],
            'notes' => $validated['notes'] ?? null,
            'user_id' => auth()->id(),
        ]);

        ActivityLog::log('إنشاء جدول حسابات', "تم إنشاء جدول حسابات جديد ({$ledger->title}) للزبون ({$customer->name})");

        return redirect()->route('ledgers.show', $ledger->id)
            ->with('success', 'تم إنشاء جدول الحساب بنجاح');
    }

    public function show(CustomerLedger $ledger): Response
    {
        $ledger->load(['customer', 'user', 'items' => function ($q) {
            $q->orderBy('id', 'asc');
        }]);

        return Inertia::render('Ledgers/Show', [
            'ledger' => $ledger,
            'customer' => $ledger->customer,
        ]);
    }

    public function addItem(Request $request, CustomerLedger $ledger): RedirectResponse
    {
        $validated = $request->validate([
            'details' => 'nullable|string',
            'purchase_amount' => 'nullable|numeric|min:0',
            'store_payment_details' => 'nullable|string',
            'store_payment' => 'nullable|numeric|min:0',
            'rmb_exchange_rate' => 'nullable|numeric|min:0',
            'transfer_date' => 'nullable|date',
            'usd_amount' => 'nullable|numeric|min:0',
        ]);

        $item = $ledger->items()->create([
            'details' => $validated['details'] ?? null,
            'purchase_amount' => $validated['purchase_amount'] ?? 0,
            'store_payment_details' => $validated['store_payment_details'] ?? null,
            'store_payment' => $validated['store_payment'] ?? 0,
            'rmb_exchange_rate' => $validated['rmb_exchange_rate'] ?? 0,
            'transfer_date' => $validated['transfer_date'] ?? null,
            'usd_amount' => $validated['usd_amount'] ?? 0,
        ]);

        $ledger->touch();

        ActivityLog::log('إضافة سطر حسابي', "تم إضافة سطر بحساب دولار (${item->usd_amount}$) وسعر صرف ({$item->rmb_exchange_rate}) في جدول ({$ledger->title})");

        return redirect()->back()->with('success', 'تم إضافة البند بنجاح');
    }

    public function updateItem(Request $request, LedgerItem $item): RedirectResponse
    {
        $validated = $request->validate([
            'details' => 'nullable|string',
            'purchase_amount' => 'nullable|numeric|min:0',
            'store_payment_details' => 'nullable|string',
            'store_payment' => 'nullable|numeric|min:0',
            'rmb_exchange_rate' => 'nullable|numeric|min:0',
            'transfer_date' => 'nullable|date',
            'usd_amount' => 'nullable|numeric|min:0',
        ]);

        $item->update([
            'details' => $validated['details'] ?? $item->details,
            'purchase_amount' => $validated['purchase_amount'] ?? 0,
            'store_payment_details' => $validated['store_payment_details'] ?? $item->store_payment_details,
            'store_payment' => $validated['store_payment'] ?? 0,
            'rmb_exchange_rate' => $validated['rmb_exchange_rate'] ?? 0,
            'transfer_date' => $validated['transfer_date'] ?? $item->transfer_date,
            'usd_amount' => $validated['usd_amount'] ?? 0,
        ]);

        $item->ledger->touch();

        ActivityLog::log('تحديث سطر حسابي', "تم تعديل السطر الحسابي رقم (#{$item->id}) في جدول ({$item->ledger->title})");

        return redirect()->back()->with('success', 'تم تحديث البند بنجاح');
    }

    public function removeItem(LedgerItem $item): RedirectResponse
    {
        $ledger = $item->ledger;
        $id = $item->id;
        $item->delete();
        $ledger->touch();

        ActivityLog::log('حذف سطر حسابي', "تم حذف سطر حسابي رقم (#{$id}) من جدول ({$ledger->title})");

        return redirect()->back()->with('success', 'تم حذف البند بنجاح');
    }

    public function destroy(CustomerLedger $ledger): RedirectResponse
    {
        $customerId = $ledger->customer_id;
        $title = $ledger->title;
        $ledger->delete();

        ActivityLog::log('حذف جدول حسابات', "تم حذف جدول الحسابات بالكامل بعنوان ({$title})");

        return redirect()->route('customers.show', $customerId)
            ->with('success', 'تم حذف جدول الحساب بنجاح');
    }
}

