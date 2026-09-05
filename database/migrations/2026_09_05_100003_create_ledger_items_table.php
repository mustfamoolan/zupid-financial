<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ledger_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_ledger_id')->constrained()->onDelete('cascade');
            $table->text('details')->nullable();
            $table->decimal('purchase_amount', 15, 2)->default(0);
            $table->text('store_payment_details')->nullable();
            $table->decimal('store_payment', 15, 2)->default(0);
            $table->decimal('rmb_amount', 15, 2)->default(0);
            $table->decimal('rmb_exchange_rate', 10, 4)->default(0);
            $table->date('transfer_date')->nullable();
            $table->decimal('usd_amount', 15, 2)->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ledger_items');
    }
};
