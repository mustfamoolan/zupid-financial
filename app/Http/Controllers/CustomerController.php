<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class CustomerController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Customer::query()->withCount('ledgers');

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('address', 'like', "%{$search}%");
            });
        }

        if ($dateFrom = $request->input('date_from')) {
            $query->whereDate('created_at', '>=', $dateFrom);
        }

        if ($dateTo = $request->input('date_to')) {
            $query->whereDate('created_at', '<=', $dateTo);
        }

        $customers = $query->orderBy('updated_at', 'desc')->paginate(10)->withQueryString();

        return Inertia::render('Customers/Index', [
            'customers' => $customers,
            'filters' => $request->only(['search', 'date_from', 'date_to']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $customer = Customer::create($validated);

        ActivityLog::log('إضافة زبون', "تم تسجيل زبون جديد باسم ({$customer->name}) في دليل الزبائن");

        return redirect()->route('customers.show', $customer->id)
            ->with('success', 'تم إضافة الزبون بنجاح');
    }

    public function show(Customer $customer): Response
    {
        $customer->load(['ledgers' => function ($q) {
            $q->with('items', 'user')->orderBy('updated_at', 'desc');
        }]);

        return Inertia::render('Customers/Show', [
            'customer' => $customer,
        ]);
    }

    public function update(Request $request, Customer $customer): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $customer->update($validated);

        ActivityLog::log('تحديث زبون', "تم تحديث البيانات الشخصية للزبون ({$customer->name})");

        return redirect()->back()->with('success', 'تم تحديث بيانات الزبون بنجاح');
    }

    public function destroy(Customer $customer): RedirectResponse
    {
        $name = $customer->name;
        $customer->delete();

        ActivityLog::log('حذف زبون', "تم حذف الزبون ({$name}) وكافة بياناته وجدواله من النظام");

        return redirect()->route('customers.index')->with('success', 'تم حذف الزبون بنجاح');
    }
}

