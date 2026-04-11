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
        Schema::table('transactions', function (Blueprint $table) {
            $table->string('payment_method')->nullable()->after('status');
            $table->string('payment_bank')->nullable()->after('payment_method');
            $table->string('va_number')->nullable()->after('payment_bank');
            $table->string('qr_code_url')->nullable()->after('va_number');
            $table->timestamp('payment_expired_at')->nullable()->after('qr_code_url');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropColumn([
                'payment_method',
                'payment_bank',
                'va_number',
                'qr_code_url',
                'payment_expired_at',
            ]);
        });
    }
};
