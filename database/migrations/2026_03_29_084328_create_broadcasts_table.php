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
        Schema::create('broadcasts', function (Blueprint $table) {
            $table->id();
            $table->string('subject')->nullable();
            $table->text('message');
            $table->string('type')->default('whatsapp'); // whatsapp, email, all
            $table->string('target_role')->nullable(); // null for all
            $table->enum('status', ['pending', 'sending', 'completed', 'failed'])->default('pending');
            $table->integer('total_count')->default(0);
            $table->integer('sent_count')->default(0);
            $table->text('error_message')->nullable();
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('broadcasts');
    }
};
