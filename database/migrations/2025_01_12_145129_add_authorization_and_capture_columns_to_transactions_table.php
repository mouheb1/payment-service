<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->string('authorization_id')->nullable()->after('transaction_id');
            $table->string('capture_id')->nullable()->after('authorization_id');
            $table->enum('capture_mode', ['AUTO', 'MANUAL'])->default('MANUAL')->after('status');
            $table->decimal('final_amount', 10, 2)->nullable()->after('amount');
        });
    }

    public function down()
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropColumn('authorization_id');
            $table->dropColumn('capture_id');
            $table->dropColumn('capture_mode');
            $table->dropColumn('final_amount');
        });
    }
};
