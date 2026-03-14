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
        Schema::create('user_whatsapps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // Opsional: Nomor WA ini didedikasikan untuk bisnis yang mana? (Bisa null jika ini WA personal)
            $table->foreignId('business_id')->nullable()->constrained('businesses')->nullOnDelete();

            $table->string('phone_number');
            $table->string('label')->nullable(); // "Admin Toko A", "Pribadi", dll
            $table->boolean('is_primary')->default(false);
            $table->boolean('receive_notifications')->default(true);
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
        Schema::dropIfExists('user_whatsapps');
    }
};
