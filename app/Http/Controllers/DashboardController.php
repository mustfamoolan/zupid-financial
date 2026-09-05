<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\CustomerLedger;
use App\Models\LedgerItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $dateFrom = $request->input('date_from');
        $dateTo = $request->input('date_to');

        $customersQuery = Customer::query();
        $ledgersQuery = CustomerLedger::query();

        if ($dateFrom) {
            $customersQuery->whereDate('created_at', '>=', $dateFrom);
            $ledgersQuery->whereDate('created_at', '>=', $dateFrom);
        }

        if ($dateTo) {
            $customersQuery->whereDate('created_at', '<=', $dateTo);
            $ledgersQuery->whereDate('created_at', '<=', $dateTo);
        }

        $totalCustomersCount = $customersQuery->count();
        $totalLedgersCount = $ledgersQuery->count();

        // Financial totals from ledgers
        $ledgers = $ledgersQuery->with('items')->get();
        $totalUsdAmount = $ledgers->sum('total_usd');
        $totalRmbAmount = $ledgers->sum('total_rmb');
        $totalPayments = $ledgers->sum('total_payments');
        $totalRemainingBalance = $ledgers->sum('remaining_balance');

        $recentCustomers = (clone $customersQuery)
            ->withCount('ledgers')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        $recentLedgers = (clone $ledgersQuery)
            ->with(['customer', 'user'])
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('Dashboard', [
            'stats' => [
                'total_customers' => $totalCustomersCount,
                'total_ledgers' => $totalLedgersCount,
                'total_usd' => $totalUsdAmount,
                'total_rmb' => $totalRmbAmount,
                'total_payments' => $totalPayments,
                'remaining_balance' => $totalRemainingBalance,
            ],
            'recent_customers' => $recentCustomers,
            'recent_ledgers' => $recentLedgers,
            'filters' => $request->only(['date_from', 'date_to']),
        ]);
    }
}
