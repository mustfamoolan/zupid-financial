<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LedgerItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_ledger_id',
        'details',
        'purchase_amount',
        'store_payment_details',
        'store_payment',
        'rmb_amount',
        'rmb_exchange_rate',
        'transfer_date',
        'usd_amount',
    ];

    protected function casts(): array
    {
        return [
            'purchase_amount' => 'decimal:2',
            'store_payment' => 'decimal:2',
            'rmb_amount' => 'decimal:2',
            'rmb_exchange_rate' => 'decimal:4',
            'usd_amount' => 'decimal:2',
            'transfer_date' => 'date',
        ];
    }

    protected static function booted(): void
    {
        static::saving(function (LedgerItem $item) {
            // Excel formula: RMB Amount = USD Amount * RMB Exchange Rate
            $item->rmb_amount = (float)$item->usd_amount * (float)$item->rmb_exchange_rate;
        });
    }

    public function ledger(): BelongsTo
    {
        return $this->belongsTo(CustomerLedger::class, 'customer_ledger_id');
    }
}
