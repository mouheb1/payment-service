<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateTransactionsTable extends Migration
{
    public function up()
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->string('authorization_id')->nullable(); // Authorization ID
            $table->string('capture_id')->nullable();       // Capture ID
            $table->decimal('amount', 10, 2)->change();     // Ensure amount has two decimal places
            $table->decimal('final_amount', 10, 2)->nullable();
            $table->string('status')->default('pending');
            $table->string('capture_mode')->default('MANUAL');
            $table->string('currency')->nullable();         // Transaction currency
            $table->string('country')->nullable();          // Country for transaction
            $table->string('reference')->nullable();        // Reference ID
            $table->string('merchant_id')->nullable();      // Merchant ID
            $table->string('payer_id')->nullable();         // Payer ID
            $table->string('payment_method_id')->nullable(); // Payment method ID
            $table->json('payment_method_data')->nullable(); // Payment method details as JSON
        });
    }

    public function down()
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropColumn([
                'authorization_id',
                'capture_id',
                'final_amount',
                'currency',
                'country',
                'reference',
                'merchant_id',
                'payer_id',
                'payment_method_id',
                'payment_method_data',
            ]);
        });
    }
}
