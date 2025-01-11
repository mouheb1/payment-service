<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Link to users table
            $table->foreignId('service_id')->constrained()->onDelete('cascade'); // Link to services table
            $table->string('transaction_id')->unique(); // Transaction ID from payment gateway
            $table->decimal('amount', 10, 2); // Amount paid
            $table->enum('status', ['pending', 'success', 'failed'])->default('pending'); // Transaction status
            $table->timestamps(); // created_at and updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
