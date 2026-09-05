<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CustomerLedger extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'user_id',
        'title',
        'notes',
    ];

    protected $appends = [
        'total_usd',
        'total_rmb',
        'total_store_payments',
        'total_purchases',
        'total_payments',
        'remaining_balance',
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(LedgerItem::class);
    }

    public function getTotalUsdAttribute(): float
    {
        return (float) $this->items()->sum('usd_amount');
    }

    public function getTotalRmbAttribute(): float
    {
        return (float) $this->items()->sum('rmb_amount');
    }

    public function getTotalStorePaymentsAttribute(): float
    {
        return (float) $this->items()->sum('store_payment');
    }

    public function getTotalPurchasesAttribute(): float
    {
        return (float) $this->items()->sum('purchase_amount');
    }

    public function getTotalPaymentsAttribute(): float
    {
        return $this->total_store_payments + $this->total_purchases;
    }

    public function getRemainingBalanceAttribute(): float
    {
        return $this->total_rmb - $this->total_payments;
    }
}
