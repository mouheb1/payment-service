<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateTransactionsTableAmountToInteger extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            // Change columns to integer
            $table->integer('amount')->change();
            $table->integer('final_amount')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            // Revert columns back to decimal (if needed)
            $table->decimal('amount', 10, 2)->change();
            $table->decimal('final_amount', 10, 2)->nullable()->change();
        });
    }
}
