<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\CustomerLedgerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// Authentication Routes
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store']);
});

Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->middleware('auth')->name('logout');

// Root Redirection
Route::get('/', function () {
    return redirect()->route('dashboard');
});

// Protected Clinic Management Routes
Route::middleware(['auth'])->group(function () {
    // Dashboard Route
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Activity Logs Route
    Route::get('/activity-logs', [\App\Http\Controllers\ActivityLogController::class, 'index'])->name('activity-logs.index');

    // Users Management
    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::post('/users', [UserController::class, 'store'])->name('users.store');
    Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');

    // Customers Management
    Route::get('/customers', [CustomerController::class, 'index'])->name('customers.index');
    Route::post('/customers', [CustomerController::class, 'store'])->name('customers.store');
    Route::get('/customers/{customer}', [CustomerController::class, 'show'])->name('customers.show');
    Route::put('/customers/{customer}', [CustomerController::class, 'update'])->name('customers.update');
    Route::delete('/customers/{customer}', [CustomerController::class, 'destroy'])->name('customers.destroy');

    // Ledgers Management
    Route::post('/customers/{customer}/ledgers', [CustomerLedgerController::class, 'store'])->name('ledgers.store');
    Route::get('/ledgers/{ledger}', [CustomerLedgerController::class, 'show'])->name('ledgers.show');
    Route::delete('/ledgers/{ledger}', [CustomerLedgerController::class, 'destroy'])->name('ledgers.destroy');

    // Ledger Items Operations
    Route::post('/ledgers/{ledger}/items', [CustomerLedgerController::class, 'addItem'])->name('ledgers.items.store');
    Route::put('/items/{item}', [CustomerLedgerController::class, 'updateItem'])->name('ledgers.items.update');
    Route::delete('/items/{item}', [CustomerLedgerController::class, 'removeItem'])->name('ledgers.items.destroy');
});


