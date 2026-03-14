<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('promo_codes', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->enum('type', ['discount', 'referral']);
            $table->enum('reward_type', ['percentage', 'fixed']); // Potongan persen atau nominal tetap
            $table->integer('reward_value'); // Contoh: 10 (jika persen), 15000 (jika fixed)
            $table->foreignId('owner_id')->nullable()->constrained('users'); // Terisi jika ini kode referal milik user
            $table->integer('max_uses')->nullable(); // Batas maksimal penggunaan kode
            $table->integer('used_count')->default(0);
            $table->dateTime('valid_until')->nullable();
            $table->userstamps();
            $table->userstampSoftDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('promo_codes');
    }
};
